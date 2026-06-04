import type { Content } from "@/data/content";
import { MODULES, LOCKED_CLUSTERS, type ManagerModule } from "@/data/modules";
import {
  currentModuleId,
  currentModuleNumber,
  planPct,
  moduleState,
  TOTAL_MODULES,
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
  const completed = progress.completedModules;
  const nowId = currentModuleId(completed);
  const pill = fmt(j.pillTemplate, {
    n: currentModuleNumber(nowId),
    total: TOTAL_MODULES,
    pct: planPct(completed),
  });

  // Group authored modules by cluster, preserving order.
  const clusters: { title: string; modules: ManagerModule[] }[] = [];
  MODULES.forEach((m) => {
    let cl = clusters.find((x) => x.title === m.cluster);
    if (!cl) {
      cl = { title: m.cluster, modules: [] };
      clusters.push(cl);
    }
    cl.modules.push(m);
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

      {clusters.map((cl, ci) => (
        <div className="phase" key={ci}>
          <div className="ph-top">
            <span className="pn">{`Phase 0${ci + 1}`}</span>
            <h3>{cl.title}</h3>
            <span className="ln" />
          </div>
          <div className="weeks">
            {cl.modules.map((m) => {
              const st = moduleState(m.id, completed, nowId);
              return (
                <div key={m.id} className={`week ${st === "done" ? "done" : st === "now" ? "now" : ""}`}>
                  <div className="wtag">
                    <span className="wn">{fmt(c.common.minRead, { n: m.minutes })}</span>
                    <span className={`wstate ${st === "done" ? "s-done" : st === "now" ? "s-now" : "s-next"}`}>
                      {st === "done" ? c.weekStates.done : st === "now" ? c.weekStates.now : c.weekStates.next}
                    </span>
                  </div>
                  <h4>{m.title}</h4>
                  <p>{m.summary}</p>
                  <div className="lessons">
                    {j.steps.map((s, si) => (
                      <div key={si} className={`ls ${st === "done" ? "done" : ""}`}>
                        <span className="ck">{st === "done" && <Check />}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                  {st === "now" && (
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

      {/* Clusters not yet authored — shown locked */}
      <div className="phase">
        <div className="ph-top">
          <span className="pn">{`Phase 0${clusters.length + 1}`}</span>
          <h3>{j.comingTitle}</h3>
          <span className="ln" />
        </div>
        <div className="weeks">
          {LOCKED_CLUSTERS.map((name, i) => (
            <div key={i} className="week locked">
              <div className="wtag">
                <span className="wn">—</span>
                <span className="wstate s-next">{j.lockedTag}</span>
              </div>
              <h4>{name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
