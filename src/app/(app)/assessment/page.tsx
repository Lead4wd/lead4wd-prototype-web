"use client";

import { useRouter } from "next/navigation";
import Assessment from "@/components/views/Assessment";
import { useApp } from "@/app/providers";

export default function AssessmentPage() {
  const router = useRouter();
  const { c, assessmentQuestions, submitAssessment } = useApp();
  return (
    <Assessment
      c={c}
      questions={assessmentQuestions}
      onExit={() => router.push("/dashboard")}
      onComplete={(answers, scores) => {
        void submitAssessment(answers, scores);
        router.push("/results");
      }}
    />
  );
}
