import type { Content } from "@/data/content";
import { fmt } from "@/lib/format";
import type { GaSummary } from "@/lib/data";

// Shared Google Analytics aggregate block — used by the user analytics page and
// the admin panel. Degrades to a clear "not connected" note when GA isn't set up.
export default function GaSection({ c, summary }: { c: Content; summary: GaSummary | null }) {
  const g = c.ga;

  return (
    <>
      <div className="sectitle">
        <h3>{g.title}</h3>
      </div>
      <div className="card">
        <span className="eyebrow">{g.lede}</span>
        {summary == null ? (
          <p className="ga-note">…</p>
        ) : !summary.configured ? (
          <p className="ga-note">{g.notConfigured}</p>
        ) : (
          <>
            <div className="ga-stats">
              <div className="ga-stat">
                <span className="n">{summary.activeUsers}</span>
                <span className="l">{g.activeUsers}</span>
              </div>
              <div className="ga-stat">
                <span className="n">{summary.newUsers}</span>
                <span className="l">{g.newUsers}</span>
              </div>
              <div className="ga-stat">
                <span className="n">{summary.sessions}</span>
                <span className="l">{g.sessions}</span>
              </div>
              <div className="ga-stat">
                <span className="n">{fmt(g.secondsUnit, { n: summary.avgEngagementSec })}</span>
                <span className="l">{g.avgEngagement}</span>
              </div>
            </div>

            {summary.daily.length > 0 && (
              <>
                <span className="eyebrow" style={{ marginTop: 18, display: "block" }}>
                  {g.dailyActive}
                </span>
                <DayBars points={summary.daily.map((d) => ({ date: d.date, value: d.activeUsers }))} />
              </>
            )}

            {summary.topEvents.length > 0 && (
              <>
                <span className="eyebrow" style={{ marginTop: 18, display: "block" }}>
                  {g.topEvents}
                </span>
                <div className="ev-list">
                  {summary.topEvents.map((e) => (
                    <div className="ev-row" key={e.name}>
                      <span className="ev-name">{e.name}</span>
                      <span className="ev-count">{e.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

// Tiny day-by-day bar chart, shared with the analytics views.
export function DayBars({ points }: { points: { date: string; value: number }[] }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className="daybars">
      {points.map((p) => (
        <div className="daybar" key={p.date} title={`${p.date}: ${p.value}`}>
          <div className="daybar-fill" style={{ height: `${Math.round((p.value / max) * 100)}%` }} />
          <span className="daybar-lbl">{p.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}
