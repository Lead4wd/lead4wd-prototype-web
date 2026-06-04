import type { Content, SkillId } from "@/data/content";
import { levelFromScore, pctFromScore } from "@/data/content";
import { getModule } from "@/data/modules";
import {
  planPct,
  streakCells,
  currentModuleId,
  currentModuleNumber,
  TOTAL_MODULES,
  type Progress,
  type View,
} from "@/lib/progress";
import { fmt, levelKey, barClass } from "@/lib/format";
import { Clock, Bolt } from "@/components/icons";

const R = 46;
const CIRC = 2 * Math.PI * R;
const FOCUS_SKILLS: SkillId[] = ["feedback", "delegation"];

export default function Dashboard({
  c,
  progress,
  go,
}: {
  c: Content;
  progress: Progress;
  go: (v: View) => void;
}) {
  const d = c.dashboard;
  const completed = progress.completedModules;
  const pct = planPct(completed);
  const nowId = currentModuleId(completed);
  const current = getModule(nowId);
  const cells = streakCells(progress.streak, d.weekdaysShort, d.todayLabel);

  // Hero reflects the current module (or an "all caught up" state).
  const heroTitle = current ? current.title : d.caughtUpTitle;
  const heroDesc = current ? current.summary : d.caughtUpDesc;
  const heroMins = current ? current.minutes : c.lesson.minutes;

  return (
    <section className="view on">
      <div className="greet">
        <div>
          <span className="eyebrow">{fmt(d.eyebrowDate, { n: currentModuleNumber(nowId), total: TOTAL_MODULES })}</span>
          <h1 style={{ marginTop: 10 }}>{d.greeting}</h1>
          <p className="sub">{d.sub}</p>
        </div>
        <button className="btn btn-pri" onClick={() => go("lesson")}>
          {d.continueCta}
        </button>
      </div>

      <div className="dash-grid">
        {/* next best step → current module */}
        <div className="next-hero">
          <div className="glow" />
          <span className="k">{fmt(d.nextStepKicker, { n: heroMins })}</span>
          <h2>{heroTitle}</h2>
          <p>{heroDesc}</p>
          <div className="row">
            <button
              className="btn"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
              onClick={() => go("lesson")}
            >
              {c.common.startLesson}
            </button>
            <span className="meta">
              <Clock />
              {fmt(c.common.minRead, { n: heroMins })}
            </span>
            <span className="meta">
              <Bolt />
              {c.common.oneAction}
            </span>
          </div>
        </div>

        {/* progress */}
        <div className="statcol">
          <div className="card ringcard">
            <div className="ring">
              <svg width="104" height="104" viewBox="0 0 104 104">
                <circle cx="52" cy="52" r={R} fill="none" stroke="var(--line)" strokeWidth="9" />
                <circle
                  cx="52"
                  cy="52"
                  r={R}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - pct / 100)}
                />
              </svg>
              <div className="lbl">
                <span className="v">{pct}%</span>
                <span className="t">{d.planLabel}</span>
              </div>
            </div>
            <div className="kpis">
              <div className="kpi">
                <span className="n">{completed.length}</span>
                <span className="l">{d.lessonsCompleted}</span>
              </div>
              <div className="kpi">
                <span className="n" style={{ color: "var(--good)" }}>{progress.actionsTried.length}</span>
                <span className="l">{d.actionsTried}</span>
              </div>
            </div>
          </div>

          <div className="card focus-skills">
            <span className="eyebrow">{d.focusEyebrow}</span>
            {FOCUS_SKILLS.map((id) => {
              const lvl = levelFromScore(progress.scores[id]);
              return (
                <div className="sk" key={id}>
                  <div className="top">
                    <span className="nm">{c.skillShort[id]}</span>
                    <span className={`lv lv-${levelKey(lvl)}`}>{c.levels[lvl]}</span>
                  </div>
                  <div className="track">
                    <i className={barClass(lvl)} style={{ width: `${pctFromScore(progress.scores[id])}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* streak */}
      <div className="sectitle">
        <h3>{d.streakTitle}</h3>
        <a onClick={() => go("journey")}>{d.seeJourney}</a>
      </div>
      <div className="card">
        <div className="streakcal">
          {cells.map((cell, i) => (
            <div key={i} className={`d ${cell.state === "done" ? "done" : cell.state === "today" ? "today" : ""}`}>
              {cell.state === "done" && <span className="ic">🔥</span>}
              {cell.state === "today" && <span style={{ fontWeight: 800, color: "var(--accent)" }}>·</span>}
              {cell.label}
            </div>
          ))}
        </div>
      </div>

      {/* team pulse mini */}
      <div className="sectitle">
        <h3>{d.teamTitle}</h3>
        <a onClick={() => go("team")}>{d.openTeam}</a>
      </div>
      <div className="dash-grid">
        <div className="card pulse-mini">
          <span className="eyebrow">{d.pulseEyebrow}</span>
          <div style={{ marginTop: 16 }}>
            {d.pulseRows.map((row, i) => (
              <div className="row" key={i}>
                <span className="nm">{row.name}</span>
                <div className="track" style={{ flex: 1 }}>
                  <i className={row.tone === "normal" ? "" : row.tone} style={{ width: `${row.pct}%` }} />
                </div>
                <span className="v">{row.score}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="card"
          style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--surface-2)" }}
        >
          <span className="eyebrow">{d.coachEyebrow}</span>
          <p style={{ fontSize: 15, color: "var(--ink)", fontWeight: 500, marginTop: 10, lineHeight: 1.5 }}>
            {d.coachNote}
          </p>
        </div>
      </div>
    </section>
  );
}
