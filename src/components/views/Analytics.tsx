"use client";

import { useEffect, useState } from "react";
import type { Content } from "@/data/content";
import type { ManagerModule } from "@/data/modules";
import { fmt } from "@/lib/format";
import { loadUserAnalytics, fetchGaSummary, type UserAnalytics, type GaSummary } from "@/lib/data";
import GaSection, { DayBars } from "@/components/views/GaSection";
import LoadError from "@/components/LoadError";

const mins = (ms: number) => Math.max(0, Math.round(ms / 60000));

// User-facing analytics: the signed-in user's own learning stats (from Supabase)
// plus an anonymous, product-wide Google Analytics aggregate section.
export default function Analytics({ c, modules }: { c: Content; modules: ManagerModule[] }) {
  const a = c.analytics;
  const [data, setData] = useState<UserAnalytics | null>(null);
  const [failed, setFailed] = useState(false);
  const [ga, setGa] = useState<GaSummary | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    void loadUserAnalytics().then((d) => {
      if (!active) return;
      setData(d);
      setFailed(d === null);
    });
    void fetchGaSummary().then((g) => active && setGa(g));
    return () => {
      active = false;
    };
  }, [attempt]);

  const moduleTitle = (id: string) => {
    const i = modules.findIndex((m) => m.id === id);
    return i >= 0 ? `${fmt(c.journey.moduleTag, { n: i + 1 })} · ${modules[i].title}` : id;
  };
  const maxModuleMs = Math.max(1, ...(data?.timeByModule ?? []).map((m) => m.ms));
  const hasOwnData = data && (data.totalTimeMs > 0 || data.started > 0);

  return (
    <section className="view on">
      <div className="results">
        <span className="eyebrow">{a.eyebrow}</span>
        <h1 style={{ marginTop: 12 }}>{a.title}</h1>
        <p className="rlede">{a.lede}</p>

        {/* personal stat cards */}
        <div className="an-stats">
          <div className="card an-stat">
            <span className="n">{mins(data?.totalTimeMs ?? 0)}</span>
            <span className="l">{a.totalTime} ({a.minutesUnit.replace("{n} ", "")})</span>
          </div>
          <div className="card an-stat">
            <span className="n">{data?.activeDays ?? 0}</span>
            <span className="l">{a.activeDays}</span>
          </div>
          <div className="card an-stat">
            <span className="n" style={{ color: "var(--good)" }}>{data?.completed ?? 0}</span>
            <span className="l">{a.completed}</span>
          </div>
          <div className="card an-stat">
            <span className="n" style={{ color: "var(--accent)" }}>{data?.skips ?? 0}</span>
            <span className="l">{a.skipped}</span>
          </div>
        </div>

        {failed ? (
          // "Nothing here yet" would be a lie if we simply could not reach the
          // server — and a discouraging one, on a page about their own effort.
          <LoadError c={c} onRetry={() => setAttempt((n) => n + 1)} />
        ) : !hasOwnData ? (
          <div className="card" style={{ marginTop: 18 }}>
            <p className="ga-note">{a.noData}</p>
          </div>
        ) : (
          <>
            {(data?.timeByModule.length ?? 0) > 0 && (
              <>
                <div className="sectitle">
                  <h3>{a.timeByModuleTitle}</h3>
                </div>
                <div className="card">
                  {data!.timeByModule.map((m) => (
                    <div className="mtime-row" key={m.moduleId}>
                      <span className="mtime-lbl">{moduleTitle(m.moduleId)}</span>
                      <div className="track" style={{ flex: 1 }}>
                        <i className="acc" style={{ width: `${Math.round((m.ms / maxModuleMs) * 100)}%` }} />
                      </div>
                      <span className="mtime-val">{fmt(a.minutesUnit, { n: mins(m.ms) })}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(data?.daily.length ?? 0) > 0 && (
              <>
                <div className="sectitle">
                  <h3>{a.dailyTitle}</h3>
                </div>
                <div className="card">
                  <DayBars points={data!.daily.map((d) => ({ date: d.date, value: mins(d.ms) }))} />
                </div>
              </>
            )}
          </>
        )}

        {/* anonymous product-wide GA aggregate */}
        <GaSection c={c} summary={ga} />
      </div>
    </section>
  );
}
