import type { Content, SkillId } from "@/data/content";
import { SKILL_ORDER, levelFromScore, pctFromScore } from "@/data/content";
import type { View } from "@/lib/progress";
import { levelKey, barClass } from "@/lib/format";

export default function SkillsProfile({
  c,
  scores,
  go,
  onRetake,
}: {
  c: Content;
  scores: Record<SkillId, number>;
  go: (v: View) => void;
  onRetake: () => void;
}) {
  const r = c.results;
  return (
    <section className="view on">
      <div className="results">
        <span className="eyebrow">{r.eyebrow}</span>
        <h1 style={{ marginTop: 12 }}>{r.title}</h1>
        <p className="rlede">{r.lede}</p>

        <div className="card" style={{ padding: "8px 26px" }}>
          <div className="skill-rows">
            {SKILL_ORDER.map((id) => {
              const score = scores[id];
              const lvl = levelFromScore(score);
              return (
                <div className="skill-row" key={id}>
                  <div className="info">
                    <div className="nm">{c.skillNames[id]}</div>
                    <span className={`lv lvt-${levelKey(lvl)}`}>{c.levels[lvl]}</span>
                  </div>
                  <div className="bar track">
                    <i className={barClass(lvl)} style={{ width: `${pctFromScore(score)}%` }} />
                  </div>
                  <div className="score">{score.toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dash-grid" style={{ marginTop: 20 }}>
          <div className="card" style={{ background: "var(--dark)", color: "var(--on-dark)" }}>
            <span className="eyebrow" style={{ color: "var(--accent)" }}>{r.startEyebrow}</span>
            <h3 style={{ fontSize: 22, color: "#fff", marginTop: 10, lineHeight: 1.1 }}>{r.startTitle}</h3>
            <p style={{ color: "color-mix(in srgb, var(--on-dark) 72%, transparent)", fontSize: 14.5, marginTop: 8, fontWeight: 500 }}>
              {r.startDesc}
            </p>
            <button
              className="btn"
              style={{ background: "var(--primary)", color: "var(--on-primary)", marginTop: 18 }}
              onClick={() => go("journey")}
            >
              {r.startCta}
            </button>
          </div>
          <div
            className="card"
            style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--surface-2)" }}
          >
            <span className="eyebrow">{r.recheckEyebrow}</span>
            <p style={{ fontSize: 15, color: "var(--ink)", fontWeight: 500, marginTop: 10, lineHeight: 1.5 }}>
              {r.recheckText}
            </p>
            <button className="btn btn-soft" style={{ marginTop: 16, alignSelf: "flex-start" }} onClick={onRetake}>
              {r.recheckCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
