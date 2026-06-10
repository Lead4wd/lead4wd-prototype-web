"use client";

import { useEffect, useRef, useState } from "react";
import { CONTENT, LANGUAGES, type LanguageCode, type SkillId } from "@/data/content";
import type { ManagerModule } from "@/data/modules";
import { completeModule, emptyProgress, type Progress } from "@/lib/progress";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  fetchModules,
  fetchLockedClusters,
  fetchAssessmentQuestions,
  fetchOnboardingQuestions,
  loadProfile,
  loadUserState,
  saveAssessmentAnswers,
  saveModuleCompletion,
  saveOnboardingAnswers,
  updateProfile,
  type AssessmentQuestion,
  type OnboardingQuestion,
  type ProfileRow,
} from "@/lib/data";
import type { ModuleResult } from "@/components/ModulePlayer";
import Onboarding from "@/components/Onboarding";
import Auth from "@/components/Auth";
import FirstRun from "@/components/FirstRun";
import AppShell from "@/components/AppShell";

type Phase = "loading" | "intro" | "auth" | "firstrun" | "app";
type SessionUser = { id: string; email: string | null };

function Splash() {
  return (
    <div className="entry">
      <div className="entry-card">
        <div className="entry-brand">
          <span className="arr">→</span>Lead4wd
        </div>
        <p className="lede">…</p>
      </div>
    </div>
  );
}

export default function Home() {
  const sb = getSupabaseBrowserClient();

  const [phase, setPhase] = useState<Phase>("loading");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [progress, setProgress] = useState<Progress>(emptyProgress);

  const [modules, setModules] = useState<ManagerModule[]>([]);
  const [lockedClusters, setLockedClusters] = useState<string[]>([]);
  const [onboardingQuestions, setOnboardingQuestions] = useState<OnboardingQuestion[]>([]);
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>([]);
  const [questionsReady, setQuestionsReady] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  // Last user whose state we loaded — lets us ignore TOKEN_REFRESHED / duplicate
  // auth events that would otherwise refetch and clobber optimistic progress.
  const loadedUserIdRef = useRef<string | null>(null);

  const c = CONTENT[language];

  // ---- content + session bootstrap (once) ----
  useEffect(() => {
    let active = true;

    try {
      const l = localStorage.getItem("lead4wd_lang");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (l && LANGUAGES.some((x) => x.code === l)) setLanguage(l as LanguageCode);
    } catch {
      /* ignore */
    }

    void Promise.all([fetchModules(), fetchLockedClusters()]).then(([m, lc]) => {
      if (!active) return;
      setModules(m);
      setLockedClusters(lc);
    });

    const handle = async (session: { user: { id: string; email?: string } } | null, event?: string) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
      if (!session?.user) {
        loadedUserIdRef.current = null;
        setUser(null);
        setProfile(null);
        setProgress(emptyProgress());
        setPhase((prev) => (prev === "auth" ? "auth" : "intro"));
        return;
      }
      if (loadedUserIdRef.current === session.user.id) return; // already loaded (token refresh etc.)
      loadedUserIdRef.current = session.user.id;
      const u: SessionUser = { id: session.user.id, email: session.user.email ?? null };
      setUser(u);
      const prof =
        (await loadProfile(u.id)) ??
        ({
          id: u.id,
          display_name: u.email?.split("@")[0] ?? null,
          role: CONTENT.en.profile.role,
          language: "en",
          streak: 0,
          onboarded: false,
        } satisfies ProfileRow);
      if (!active) return;
      setProfile(prof);
      if (LANGUAGES.some((x) => x.code === prof.language)) setLanguage(prof.language as LanguageCode);
      if (prof.onboarded) {
        const pr = await loadUserState(u.id);
        if (!active) return;
        setProgress(pr);
        setPhase("app");
      } else {
        setPhase("firstrun");
      }
    };

    void sb.auth.getSession().then(({ data }) => handle(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      void handle(session, event);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- language-specific question text + <html lang> ----
  useEffect(() => {
    let active = true;
    document.documentElement.lang = language;
    void Promise.all([fetchOnboardingQuestions(language), fetchAssessmentQuestions(language)]).then(([oq, aq]) => {
      if (!active) return;
      setOnboardingQuestions(oq);
      setAssessmentQuestions(aq);
      setQuestionsReady(true);
    });
    return () => {
      active = false;
    };
  }, [language]);

  const changeLanguage = (l: LanguageCode) => {
    setLanguage(l);
    try {
      localStorage.setItem("lead4wd_lang", l);
    } catch {
      /* ignore */
    }
    if (user) void updateProfile(user.id, { language: l });
  };

  const handleFirstRun = async (data: {
    onboardingAnswers: (number | null)[];
    assessmentAnswers: (number | null)[];
    scores: Record<SkillId, number>;
  }) => {
    if (!user) return;
    await Promise.all([
      saveOnboardingAnswers(user.id, data.onboardingAnswers),
      saveAssessmentAnswers(user.id, data.assessmentAnswers),
      updateProfile(user.id, { onboarded: true }),
    ]);
    setProfile((p) => (p ? { ...p, onboarded: true } : p));
    setProgress((prev) => ({ ...prev, scores: data.scores }));
    setPhase("app");
  };

  const handleCompleteModule = async (moduleId: string, result: ModuleResult) => {
    if (!user) return;
    const already = progress.completedModules.includes(moduleId);
    const optimistic = completeModule(progress, moduleId, result.reflection);
    setProgress(optimistic);
    await saveModuleCompletion(user.id, moduleId, {
      quizCorrect: result.quizCorrect,
      quizTotal: result.quizTotal,
      scorePct: result.scorePct,
      reflection: result.reflection,
      attempts: result.attempts,
      newStreak: optimistic.streak,
      alreadyCompleted: already,
    });
  };

  const handleSubmitAssessment = async (answers: (number | null)[], scores: Record<SkillId, number>) => {
    if (!user) return;
    setProgress((prev) => ({ ...prev, scores }));
    await saveAssessmentAnswers(user.id, answers);
  };

  const handleProfileUpdated = (patch: Partial<ProfileRow>) => {
    setProfile((p) => (p ? { ...p, ...patch } : p));
  };

  // ---- render ----
  if (phase === "loading") return <Splash />;
  if (phase === "intro") return <Onboarding c={c} onDone={() => setPhase("auth")} />;
  if (phase === "auth") return <Auth c={c} />;
  if (phase === "firstrun") {
    // Wait for the questions to load — otherwise the skills check would render
    // empty and auto-complete with default scores.
    if (!questionsReady) return <Splash />;
    return (
      <FirstRun
        c={c}
        onboardingQuestions={onboardingQuestions}
        assessmentQuestions={assessmentQuestions}
        onComplete={handleFirstRun}
      />
    );
  }
  if (!profile) return <Splash />;
  return (
    <AppShell
      c={c}
      language={language}
      languages={LANGUAGES}
      onChangeLanguage={changeLanguage}
      progress={progress}
      profile={profile}
      modules={modules}
      lockedClusters={lockedClusters}
      assessmentQuestions={assessmentQuestions}
      onCompleteModule={handleCompleteModule}
      onSubmitAssessment={handleSubmitAssessment}
      onProfileUpdated={handleProfileUpdated}
      initialAccountOpen={recoveryMode}
    />
  );
}
