"use client";

import { useEffect, useState } from "react";
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

  // No questions (e.g. content not seeded yet) — complete with defaults. Must be
  // an effect: calling onComplete during render corrupts the parent's state.
  useEffect(() => {
    if (total === 0) onComplete([], computeScores([], []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);
  if (total === 0) return null;

  const q = questions[current];
  const selected = answers[current];
  const isLast = current === total - 1;

  const finish = (final: Record<number, number>) => {
    const raw = questions.map((_, i) => (final[i] ?? null));
    const scores = computeScores(
      questions.map((qq, i) => ({ question_idx: qq.idx, value: final[i] ?? null })),
      questions.map((qq) => ({ idx: qq.idx, skill: qq.skill }))
    );
    onComplete(raw, scores);
  };

  // Answering advances on its own — a separate "Next" tap on a one-tap question
  // is pure friction. The last answer finishes, and it must finish from the
  // freshly-built map rather than `answers`, which has not re-rendered yet.
  const pick = (n: number) => {
    const next = { ...answers, [current]: n };
    setAnswers(next);
    if (isLast) finish(next);
    else setCurrent((i) => i + 1);
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
              onClick={() => pick(opt.n)}
            >
              <span className="n">{opt.n}</span>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Picking advances on its own, so the only control left is the way back
            — for a mis-tap, or to change an answer. */}
        <div className="lesson-foot" style={{ border: "none", marginTop: 30, paddingTop: 0 }}>
          <button className="btn btn-soft" disabled={current === 0} onClick={() => setCurrent((i) => Math.max(0, i - 1))}>
            {a.previous}
          </button>
        </div>
      </div>
    </section>
  );
}
