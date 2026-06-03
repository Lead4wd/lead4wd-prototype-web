"use client";

import { useEffect, useState } from "react";
import { CONTENT, LANGUAGES, type LanguageCode, type SkillId } from "@/data/content";
import {
  completeLesson,
  currentLessonId,
  loadProgress,
  saveProgress,
  seedProgress,
  type Progress,
} from "@/lib/progress";
import Onboarding from "@/components/Onboarding";
import Auth from "@/components/Auth";
import AppShell from "@/components/AppShell";

type AppState = "ONBOARDING" | "AUTH" | "APP";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("ONBOARDING");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [progress, setProgress] = useState<Progress>(seedProgress);
  const [hydrated, setHydrated] = useState(false);

  const c = CONTENT[language];

  // Load persisted language + progress once on mount (client only).
  useEffect(() => {
    const l = localStorage.getItem("lead4wd_lang") as LanguageCode | null;
    if (l && LANGUAGES.some((x) => x.code === l)) setLanguage(l);
    const stored = loadProgress();
    if (stored) setProgress(stored);
    setHydrated(true);
  }, []);

  // Persist progress after hydration (so we never overwrite stored data with the seed).
  useEffect(() => {
    if (hydrated) saveProgress(progress);
  }, [progress, hydrated]);

  // Reflect language on <html> for a11y / font fallback.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (l: LanguageCode) => {
    setLanguage(l);
    localStorage.setItem("lead4wd_lang", l);
  };

  const handleCompleteLesson = (reflection: string) => {
    setProgress((prev) => {
      const id = currentLessonId(prev.completedLessons);
      return id ? completeLesson(prev, id, reflection) : prev;
    });
  };

  const handleSubmitAssessment = (scores: Record<SkillId, number>) => {
    setProgress((prev) => ({ ...prev, scores }));
  };

  if (appState === "ONBOARDING") {
    return <Onboarding c={c} onDone={() => setAppState("AUTH")} />;
  }
  if (appState === "AUTH") {
    return <Auth c={c} onLogin={() => setAppState("APP")} />;
  }
  return (
    <AppShell
      c={c}
      language={language}
      languages={LANGUAGES}
      onChangeLanguage={changeLanguage}
      progress={progress}
      onCompleteLesson={handleCompleteLesson}
      onSubmitAssessment={handleSubmitAssessment}
    />
  );
}
