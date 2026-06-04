import { useState } from "react";
import type { Content } from "@/data/content";

export default function TeamPulse({ c }: { c: Content }) {
  const t = c.team;
  const [showDummy, setShowDummy] = useState(false);
  return (
    <section className="view on">
      <div className="pulse-head">
        <div>
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 style={{ marginTop: 10, fontSize: "clamp(28px,3.4vw,40px)" }}>{t.title}</h1>
        </div>
        <button className="btn btn-pri" onClick={() => setShowDummy(true)}>
          {t.sendCta}
        </button>
      </div>

      {showDummy && (
        <div className="modal-scrim" onClick={() => setShowDummy(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <span className="eyebrow">{t.title}</span>
            <p>{t.dummyNote}</p>
            <button className="btn btn-pri" onClick={() => setShowDummy(false)}>
              {t.dummyClose}
            </button>
          </div>
        </div>
      )}

      <div className="pulse-grid">
        <div className="card">
          <span className="eyebrow">{t.overallEyebrow}</span>
          <div className="pulse-stat" style={{ marginTop: 14 }}>
            <div className="big" style={{ color: "var(--good)" }}>
              {t.overallScore}
              <span style={{ fontSize: 20, color: "var(--ink-faint)" }}>{t.overallOf}</span>
            </div>
            <div className="lab">{t.overallLabel}</div>
          </div>
          <div className="bigbars">
            {t.bars.map((bar, i) => (
              <div className="col" key={i}>
                <div className={`b ${bar.tone === "acc" ? "acc" : ""}`} style={{ height: `${bar.pct}%` }} />
                <div className="cl">{bar.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <span className="eyebrow">{t.changedEyebrow}</span>
          <p style={{ fontSize: 15, color: "var(--ink)", fontWeight: 500, marginTop: 12, lineHeight: 1.55 }}>
            {t.changedText}
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {t.pills.map((p, i) => (
              <span
                key={i}
                className="pill"
                style={
                  p.tone === "good"
                    ? {
                        background: "color-mix(in srgb, var(--good) 14%, transparent)",
                        color: "var(--good)",
                      }
                    : undefined
                }
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="sectitle">
        <h3>{t.wordsTitle}</h3>
        <span className="mono" style={{ fontSize: 12, color: "var(--ink-faint)" }}>
          {t.anon}
        </span>
      </div>
      <div className="quote-list">
        {t.quotes.map((quote, i) => (
          <div className="qcard" key={i}>
            {quote.text}
            <span className="qby">{quote.by}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
