import { useState } from "react";
import { CONTENT, DEFAULT_SCORES, SKILL_ORDER, type Content, type SkillId } from "@/data/content";
import { fmt } from "@/lib/format";
import { ChevronLeft } from "@/components/icons";

export default function Assessment({
  c,
  onExit,
  onComplete,
}: {
  c: Content;
  onExit: () => void;
  onComplete: (scores: Record<SkillId, number>) => void;
}) {
  const a = c.assessment;
  const total = a.questions.length;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const q = a.questions[current];
  const selected = answers[current];
  const isLast = current === total - 1;

  // Average answers per skill → score (1–5). The skill of each question is the
  // same across languages, so any language's question list maps identically.
  const compute = (): Record<SkillId, number> => {
    const sum: Record<string, { t: number; n: number }> = {};
    SKILL_ORDER.forEach((id) => (sum[id] = { t: 0, n: 0 }));
    CONTENT.en.assessment.questions.forEach((qq, i) => {
      const v = answers[i];
      if (v) {
        sum[qq.skill].t += v;
        sum[qq.skill].n += 1;
      }
    });
    const result = {} as Record<SkillId, number>;
    SKILL_ORDER.forEach((id) => {
      result[id] = sum[id].n ? Math.round((sum[id].t / sum[id].n) * 10) / 10 : DEFAULT_SCORES[id];
    });
    return result;
  };

  return (
    <section className="view on">
      <div className="assess">
        <div className="abar">
          <button className="back" onClick={onExit}>
            <ChevronLeft />
            {a.exit}
          </button>
          <div className="progress-dots">
            {a.questions.map((_, i) => (
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
          <button
            className="btn btn-soft"
            disabled={current === 0}
            onClick={() => setCurrent((i) => Math.max(0, i - 1))}
          >
            {a.previous}
          </button>
          <button
            className="btn btn-pri"
            disabled={!selected}
            onClick={() => (isLast ? onComplete(compute()) : setCurrent((i) => i + 1))}
          >
            {isLast ? a.finish : a.next}
          </button>
        </div>
      </div>
    </section>
  );
}
