import type { Content } from "@/data/content";
import type { ManagerModule } from "@/data/modules";
import {
  currentModuleId,
  currentModuleNumber,
  planPct,
  moduleState,
  type Progress,
  type View,
} from "@/lib/progress";
import { fmt } from "@/lib/format";
import { Check } from "@/components/icons";

export default function Journey({
  c,
  progress,
  go,
  modules,
  lockedClusters,
}: {
  c: Content;
  progress: Progress;
  go: (v: View) => void;
  modules: ManagerModule[];
  lockedClusters: string[];
}) {
  const j = c.journey;
  const completed = progress.completedModules;
  const moduleIds = modules.map((m) => m.id);
  const nowId = currentModuleId(completed, moduleIds);
  const pill = fmt(j.pillTemplate, {
    n: currentModuleNumber(nowId, moduleIds),
    total: moduleIds.length,
    pct: planPct(completed, moduleIds.length),
  });

  // Group authored modules by cluster, preserving order.
  const clusters: { title: string; modules: ManagerModule[] }[] = [];
  modules.forEach((m) => {
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
            <span className="pn">{fmt(j.phaseLabel, { n: String(ci + 1).padStart(2, "0") })}</span>
            <h3>{cl.title}</h3>
            <span className="ln" />
          </div>
          <div className="weeks">
            {cl.modules.map((m) => {
              const st = moduleState(m.id, completed, nowId);
              const mn = modules.indexOf(m) + 1;
              return (
                <div key={m.id} className={`week ${st === "done" ? "done" : st === "now" ? "now" : ""}`}>
                  <div className="wtag">
                    <span className="wn">{fmt(j.moduleTag, { n: mn })}</span>
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
      {lockedClusters.length > 0 && (
        <div className="phase">
          <div className="ph-top">
            <span className="pn">{fmt(j.phaseLabel, { n: String(clusters.length + 1).padStart(2, "0") })}</span>
            <h3>{j.comingTitle}</h3>
            <span className="ln" />
          </div>
          <div className="weeks">
            {lockedClusters.map((name, i) => (
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
      )}
    </section>
  );
}
