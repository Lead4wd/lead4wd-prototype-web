"use client";

import { useState } from "react";
import type { Content, SkillId } from "@/data/content";
import { fmt } from "@/lib/format";
import type { OnboardingQuestion, AssessmentQuestion } from "@/lib/data";
import Assessment from "@/components/views/Assessment";

// Post-signup first run: onboarding questions (answers captured; skip = null)
// then the skills check. Reports all answers + derived scores once, for persistence.
export default function FirstRun({
  c,
  onboardingQuestions,
  assessmentQuestions,
  onComplete,
}: {
  c: Content;
  onboardingQuestions: OnboardingQuestion[];
  assessmentQuestions: AssessmentQuestion[];
  onComplete: (data: {
    onboardingAnswers: (number | null)[];
    assessmentAnswers: (number | null)[];
    scores: Record<SkillId, number>;
  }) => void;
}) {
  const o = c.onboarding;
  const [phase, setPhase] = useState<"onboarding" | "assessment">(
    onboardingQuestions.length > 0 ? "onboarding" : "assessment"
  );
  const [idx, setIdx] = useState(0);
  const [obAnswers, setObAnswers] = useState<(number | null)[]>(() => onboardingQuestions.map(() => null));

  if (phase === "onboarding") {
    const q = onboardingQuestions[idx];
    const last = idx === onboardingQuestions.length - 1;
    const choose = (optIdx: number) => {
      setObAnswers((prev) => {
        const next = [...prev];
        next[idx] = optIdx;
        return next;
      });
      if (last) setPhase("assessment");
      else setIdx((i) => i + 1);
    };

    return (
      <div className="entry">
        <div className="entry-card">
          <div className="entry-brand">
            <span className="arr">→</span>Lead4wd
          </div>
          <span className="eyebrow">{fmt(o.stepLabel, { n: idx + 1, total: onboardingQuestions.length })}</span>
          <h1 style={{ marginBottom: 22 }}>{q.text}</h1>

          <div className="o-opts">
            {q.options.map((opt, i) => (
              <button key={i} className="o-opt" onClick={() => choose(i)}>
                <span className="o-dot" />
                {opt}
              </button>
            ))}
          </div>

          <div className="entry-foot">
            <button
              className="linkbtn"
              style={{ color: "var(--ink-faint)" }}
              disabled={idx === 0}
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
            >
              {o.back}
            </button>
            <div className="dots">
              {onboardingQuestions.map((_, i) => (
                <i key={i} className={i === idx ? "on" : ""} />
              ))}
            </div>
            <button className="linkbtn" onClick={() => setPhase("assessment")}>
              {o.skip}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Assessment
      c={c}
      questions={assessmentQuestions}
      onComplete={(assessmentAnswers, scores) =>
        onComplete({ onboardingAnswers: obAnswers, assessmentAnswers, scores })
      }
    />
  );
}
