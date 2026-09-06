"use client";

// The entry gate at `/`.
//
// Everything before the app proper: the marketing intro, sign-in, and the
// first-run questions. Once the user is signed in and onboarded there is
// nothing to show here, so it hands off to /dashboard.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./providers";
import Splash from "@/components/Splash";
import Onboarding from "@/components/Onboarding";
import Auth from "@/components/Auth";
import FirstRun from "@/components/FirstRun";

export default function Home() {
  const router = useRouter();
  const { phase, c, startAuth, onboardingQuestions, assessmentQuestions, questionsReady, completeFirstRun } = useApp();

  // replace, not push: the gate should not sit in history behind the dashboard,
  // or Back would bounce the user straight out of the app.
  useEffect(() => {
    if (phase === "app") router.replace("/dashboard");
  }, [phase, router]);

  if (phase === "loading" || phase === "app") return <Splash />;
  if (phase === "intro") return <Onboarding c={c} onDone={startAuth} />;
  if (phase === "auth") return <Auth c={c} />;

  // Wait for the questions to load — otherwise the skills check would render
  // empty and auto-complete with default scores.
  if (!questionsReady) return <Splash />;
  return (
    <FirstRun
      c={c}
      onboardingQuestions={onboardingQuestions}
      assessmentQuestions={assessmentQuestions}
      onComplete={completeFirstRun}
    />
  );
}
