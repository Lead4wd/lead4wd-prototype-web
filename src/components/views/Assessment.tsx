"use client";

import { useState } from "react";
import type { Content, SkillId } from "@/data/content";
import { fmt } from "@/lib/format";
import { ChevronLeft } from "@/components/icons";
import { computeScores, type AssessmentQuestion } from "@/lib/data";

// Skills check. Questions come from the DB; reports raw answers (null = skipped)
// plus the derived per-skill scores. Used in first-run and for in-app retakes.
export default function Assessment({
  c,
  questions,
  onExit,
  onComplete,
}: {
  c: Content;
  questions: AssessmentQuestion[];
  onExit?: () => void;
  onComplete: (answers: (number | null)[], scores: Record<SkillId, number>) => void;
}) {
  const a = c.assessment;
  const total = questions.length;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // No questions (e.g. content not seeded yet) — complete immediately with defaults.
  if (total === 0) {
    onComplete([], computeScores([], []));
    return null;
  }

  const q = questions[current];
  const selected = answers[current];
  const isLast = current === total - 1;

  const finish = () => {
    const raw = questions.map((_, i) => (answers[i] ?? null));
    const scores = computeScores(
      questions.map((qq, i) => ({ question_idx: qq.idx, value: answers[i] ?? null })),
      questions.map((qq) => ({ idx: qq.idx, skill: qq.skill }))
    );
    onComplete(raw, scores);
  };

  return (
    <section className="view on">
      <div className="assess">
        <div className="abar">
          {onExit && (
            <button className="back" onClick={onExit}>
              <ChevronLeft />
              {a.exit}
            </button>
          )}
          <div className="progress-dots">
            {questions.map((_, i) => (
              <i key={i} className={answers[i] || i === current ? "on" : ""} />
            ))}
          </div>
        </div>

        <div className="qmeta">
          <span className="eyebrow">{c.skillNames[q.skill]}</span>
          <span className="qcount">
            {fmt(a.counter, {
              n: String(current + 1).padStart(2, "0"),
              total: String(total).padStart(2, "0"),
            })}
          </span>
        </div>

        <h1>{q.text}</h1>
        <p className="qhint">{a.hint}</p>

        <div className="scale">
          {a.scale.map((opt) => (
            <button
              key={opt.n}
              className={`scale-opt ${selected === opt.n ? "sel" : ""}`}
              onClick={() => setAnswers((prev) => ({ ...prev, [current]: opt.n }))}
            >
              <span className="n">{opt.n}</span>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="lesson-foot" style={{ border: "none", marginTop: 30, paddingTop: 0 }}>
          <button className="btn btn-soft" disabled={current === 0} onClick={() => setCurrent((i) => Math.max(0, i - 1))}>
            {a.previous}
          </button>
          <button className="btn btn-pri" disabled={!selected} onClick={() => (isLast ? finish() : setCurrent((i) => i + 1))}>
            {isLast ? a.finish : a.next}
          </button>
        </div>
      </div>
    </section>
  );
}
