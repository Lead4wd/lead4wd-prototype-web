import type { Content } from "@/data/content";
import {
  currentLessonId,
  currentWeekNumber,
  lessonState,
  weekState,
  planPct,
  type Progress,
  type View,
} from "@/lib/progress";
import { fmt } from "@/lib/format";
import { Check } from "@/components/icons";

export default function Journey({
  c,
  progress,
  go,
}: {
  c: Content;
  progress: Progress;
  go: (v: View) => void;
}) {
  const j = c.journey;
  const completed = progress.completedLessons;
  const nowId = currentLessonId(completed);
  const pill = fmt(j.pillTemplate, {
    week: currentWeekNumber(nowId),
    pct: planPct(completed),
  });

  return (
    <section className="view on">
      <div className="journey-head">
        <div>
          <span className="eyebrow">{j.eyebrow}</span>
          <h1 style={{ marginTop: 10, fontSize: "clamp(28px,3.4vw,40px)" }}>{j.title}</h1>
        </div>
        <div className="pill">{pill}</div>
      </div>

      {j.phases.map((phase, pi) => (
        <div className="phase" key={pi}>
          <div className="ph-top">
            <span className="pn">{phase.number}</span>
            <h3>{phase.title}</h3>
            <span className="ln" />
          </div>
          <div className="weeks">
            {phase.weeks.map((week) => {
              const wState = weekState(week, completed, nowId);
              return (
                <div key={week.id} className={`week ${wState}`}>
                  <div className="wtag">
                    <span className="wn">{week.label}</span>
                    <span
                      className={`wstate ${
                        wState === "done" ? "s-done" : wState === "now" ? "s-now" : "s-next"
                      }`}
                    >
                      {c.weekStates[wState]}
                    </span>
                  </div>
                  <h4>{week.title}</h4>
                  <p>{week.subtitle}</p>
                  <div className="lessons">
                    {week.lessons.map((ls) => {
                      const lState = lessonState(ls.id, completed, nowId);
                      return (
                        <div key={ls.id} className={`ls ${lState === "done" ? "done" : lState === "now" ? "now" : ""}`}>
                          <span className="ck">{lState === "done" && <Check />}</span>
                          {ls.title}
                        </div>
                      );
                    })}
                  </div>
                  {wState === "now" && (
                    <button
                      className="btn btn-pri"
                      style={{ width: "100%", justifyContent: "center", marginTop: 14, padding: 10 }}
                      onClick={() => go("lesson")}
                    >
                      {j.resume}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
