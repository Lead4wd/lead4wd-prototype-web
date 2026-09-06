"use client";

// App-wide state, hoisted out of the old single-page component.
// ---------------------------------------------------------------------------
// Every view used to be rendered by one component that owned the session, the
// profile, the fetched content and the user's progress. Now that views are
// separate routes, that state has to outlive a navigation — so it lives here,
// in a provider mounted by the root layout. Layouts are preserved across
// client-side navigation, so moving between routes does not refetch any of it.
//
// The route files stay thin on purpose: they read from this and render a view.
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CONTENT, LANGUAGES, type Content, type LanguageCode, type SkillId } from "@/data/content";
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
  track,
  updateProfile,
  type AssessmentQuestion,
  type OnboardingQuestion,
  type ProfileRow,
} from "@/lib/data";
import type { ModuleResult, TrackEvent } from "@/components/ModulePlayer";

/**
 * Where the user is in getting into the app.
 *
 * - `loading` — we do not yet know whether they are signed in
 * - `intro` / `auth` — signed out
 * - `firstrun` — signed in but has not answered the onboarding + skills check
 * - `app` — ready; the routed views may render
 */
export type Phase = "loading" | "intro" | "auth" | "firstrun" | "app";

export type SessionUser = { id: string; email: string | null };

export type FirstRunData = {
  onboardingAnswers: (number | null)[];
  assessmentAnswers: (number | null)[];
  scores: Record<SkillId, number>;
};

type AppValue = {
  phase: Phase;
  /** Moves the gate on from the marketing intro to the sign-in form. */
  startAuth: () => void;
  c: Content;
  language: LanguageCode;
  languages: typeof LANGUAGES;
  changeLanguage: (l: LanguageCode) => void;
  user: SessionUser | null;
  profile: ProfileRow | null;
  progress: Progress;
  modules: ManagerModule[];
  /** The curriculum could not be fetched — the app is empty for the wrong reason. */
  contentFailed: boolean;
  /** Re-fetch the curriculum after a failure. */
  retryContent: () => void;
  lockedClusters: string[];
  onboardingQuestions: OnboardingQuestion[];
  assessmentQuestions: AssessmentQuestion[];
  questionsReady: boolean;
  /** A password-recovery link landed us here; open account settings on arrival. */
  recoveryMode: boolean;
  completeFirstRun: (data: FirstRunData) => Promise<void>;
  completeModuleRun: (moduleId: string, result: ModuleResult) => Promise<void>;
  submitAssessment: (answers: (number | null)[], scores: Record<SkillId, number>) => Promise<void>;
  profileUpdated: (patch: Partial<ProfileRow>) => void;
  trackEvent: (ev: TrackEvent) => void;
};

const AppContext = createContext<AppValue | null>(null);

export function useApp(): AppValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside <AppProvider>");
  return value;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
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
  const [contentFailed, setContentFailed] = useState(false);
  // Bumping this re-runs the content fetch; it is what the retry button does.
  const [contentAttempt, setContentAttempt] = useState(0);

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
        (await loadProfile()) ??
        ({
          id: u.id,
          display_name: u.email?.split("@")[0] ?? null,
          email: u.email,
          role: CONTENT.en.profile.role,
          language: "en",
          streak: 0,
          onboarded: false,
          is_admin: false,
        } satisfies ProfileRow);
      if (!active) return;
      setProfile(prof);
      if (LANGUAGES.some((x) => x.code === prof.language)) setLanguage(prof.language as LanguageCode);
      if (prof.onboarded) {
        // One retry: the common failure here is a phone waking up with the
        // radio not yet back, which fixes itself in a second.
        let pr = await loadUserState();
        if (!pr && active) {
          await new Promise((r) => setTimeout(r, 1200));
          pr = await loadUserState();
        }
        if (!active) return;
        // Still nothing: go in without overwriting what we have rather than
        // replacing it with zeros, which reads as "all your progress is gone".
        if (pr) setProgress(pr);
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

  // ---- the curriculum ----
  // Its own effect, separate from the session, so a failure here can be retried
  // without tearing down the auth subscription.
  useEffect(() => {
    let active = true;
    void Promise.all([fetchModules(), fetchLockedClusters()]).then(([m, lc]) => {
      if (!active) return;
      // Keep whatever we already had on a failed retry rather than blanking
      // the journey the user is looking at.
      if (m) setModules(m);
      setContentFailed(m === null);
      setLockedClusters(lc);
    });
    return () => {
      active = false;
    };
  }, [contentAttempt]);

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
    if (user) void updateProfile({ language: l });
  };

  const completeFirstRun = async (data: FirstRunData) => {
    if (!user) return;
    await Promise.all([
      saveOnboardingAnswers(data.onboardingAnswers),
      saveAssessmentAnswers(data.assessmentAnswers),
      updateProfile({ onboarded: true }),
    ]);
    setProfile((p) => (p ? { ...p, onboarded: true } : p));
    setProgress((prev) => ({ ...prev, scores: data.scores }));
    setPhase("app");
  };

  const completeModuleRun = async (moduleId: string, result: ModuleResult) => {
    if (!user) return;
    const already = progress.completedModules.includes(moduleId);
    const optimistic = completeModule(progress, moduleId, result.reflection);
    setProgress(optimistic);
    await saveModuleCompletion(moduleId, {
      quizCorrect: result.quizCorrect,
      quizTotal: result.quizTotal,
      scorePct: result.scorePct,
      reflection: result.reflection,
      attempts: result.attempts,
      newStreak: optimistic.streak,
      alreadyCompleted: already,
    });
  };

  const submitAssessment = async (answers: (number | null)[], scores: Record<SkillId, number>) => {
    if (!user) return;
    setProgress((prev) => ({ ...prev, scores }));
    await saveAssessmentAnswers(answers);
  };

  const profileUpdated = (patch: Partial<ProfileRow>) => {
    setProfile((p) => (p ? { ...p, ...patch } : p));
    if (patch.language && patch.language !== language) changeLanguage(patch.language as LanguageCode);
  };

  const trackEvent = (ev: TrackEvent) => {
    if (user) void track(ev);
  };

  return (
    <AppContext.Provider
      value={{
        phase,
        startAuth: () => setPhase("auth"),
        c,
        language,
        languages: LANGUAGES,
        changeLanguage,
        user,
        profile,
        progress,
        modules,
        contentFailed,
        retryContent: () => setContentAttempt((n) => n + 1),
        lockedClusters,
        onboardingQuestions,
        assessmentQuestions,
        questionsReady,
        recoveryMode,
        completeFirstRun,
        completeModuleRun,
        submitAssessment,
        profileUpdated,
        trackEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
