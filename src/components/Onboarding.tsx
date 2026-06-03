import { useState } from "react";
import type { Content } from "@/data/content";
import { fmt } from "@/lib/format";

export default function Onboarding({ c, onDone }: { c: Content; onDone: () => void }) {
  const o = c.onboarding;
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);

  if (!started) {
    return (
      <div className="entry">
        <div className="entry-card">
          <div className="entry-brand">
            <span className="arr">→</span>Lead4wd
          </div>
          <span className="eyebrow">{o.eyebrow}</span>
          <h1>{o.title}</h1>
          <p className="lede">{o.sub}</p>
          <button className="btn btn-pri" onClick={() => setStarted(true)}>
            {o.next}
          </button>
        </div>
      </div>
    );
  }

  // Guard against overshoot (e.g. a double-click) so we never index past the end.
  if (idx >= o.questions.length) {
    onDone();
    return null;
  }

  const q = o.questions[idx];
  const last = idx === o.questions.length - 1;
  const pick = () => {
    if (last) onDone();
    else setIdx((i) => Math.min(i + 1, o.questions.length - 1));
  };

  return (
    <div className="entry">
      <div className="entry-card">
        <div className="entry-brand">
          <span className="arr">→</span>Lead4wd
        </div>
        <span className="eyebrow">{fmt(o.stepLabel, { n: idx + 1, total: o.questions.length })}</span>
        <h1 style={{ marginBottom: 22 }}>{q.text}</h1>

        <div className="o-opts">
          {q.options.map((opt, i) => (
            <button key={i} className="o-opt" onClick={pick}>
              <span className="o-dot" />
              {opt}
            </button>
          ))}
        </div>

        <div className="entry-foot">
          <button
            className="linkbtn"
            style={{ color: "var(--ink-faint)" }}
            onClick={() => (idx === 0 ? setStarted(false) : setIdx((i) => i - 1))}
          >
            {o.back}
          </button>
          <div className="dots">
            {o.questions.map((_, i) => (
              <i key={i} className={i === idx ? "on" : ""} />
            ))}
          </div>
          <button className="linkbtn" onClick={onDone}>
            {o.skip}
          </button>
        </div>
      </div>
    </div>
  );
}
