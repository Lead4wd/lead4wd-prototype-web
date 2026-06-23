"use client";

import { useEffect, useMemo, useState } from "react";
import type { Content } from "@/data/content";
import type { ManagerModule } from "@/data/modules";
import { fmt } from "@/lib/format";
import {
  fetchAdminOverview,
  fetchAdminUserDetail,
  fetchGaSummary,
  fetchAssessmentQuestions,
  fetchOnboardingQuestions,
  type AdminOverview,
  type AdminUserSummary,
  type AdminUserDetail,
  type AssessmentQuestion,
  type OnboardingQuestion,
  type GaSummary,
} from "@/lib/data";
import GaSection, { DayBars } from "@/components/views/GaSection";

const mins = (ms: number) => Math.max(0, Math.round(ms / 60000));
const fmtDate = (iso: string | null, never: string) => (iso ? iso.slice(0, 10) : never);

// Admin (super-admin) panel: a list of every learner + a per-user drill-down
// showing all responses, reflections, time, and skipped sections.
export default function AdminPanel({ c, modules }: { c: Content; modules: ManagerModule[] }) {
  const t = c.admin;
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [ga, setGa] = useState<GaSummary | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AdminUserSummary | null>(null);

  useEffect(() => {
    let active = true;
    void fetchAdminOverview().then((o) => active && setOverview(o));
    void fetchGaSummary("admin").then((g) => active && setGa(g));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const users = overview?.users ?? [];
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.displayName ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q)
    );
  }, [overview, query]);

  if (selected) {
    return <UserDetail c={c} user={selected} modules={modules} onBack={() => setSelected(null)} />;
  }

  return (
    <section className="view on">
      <div className="results">
        <span className="eyebrow">{c.nav.admin}</span>
        <h1 style={{ marginTop: 12 }}>{t.title}</h1>
        <p className="rlede">{t.lede}</p>

        <div className="an-stats">
          <div className="card an-stat">
            <span className="n">{overview?.totals.users ?? 0}</span>
            <span className="l">{t.totalUsers}</span>
          </div>
          <div className="card an-stat">
            <span className="n">{overview?.totals.onboarded ?? 0}</span>
            <span className="l">{t.totalOnboarded}</span>
          </div>
          <div className="card an-stat">
            <span className="n" style={{ color: "var(--good)" }}>
              {overview?.totals.completedModules ?? 0}
            </span>
            <span className="l">{t.totalCompleted}</span>
          </div>
          <div className="card an-stat">
            <span className="n">{mins(overview?.totals.totalTimeMs ?? 0)}</span>
            <span className="l">{t.totalTime} ({t.minutesUnit.replace("{n} ", "")})</span>
          </div>
        </div>

        <div className="card" style={{ marginTop: 18, padding: 0, overflow: "hidden" }}>
          <div className="admin-search">
            <input
              className="field"
              style={{ margin: 0 }}
              placeholder={t.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="admin-table">
            <div className="admin-row admin-head">
              <span>{t.colUser}</span>
              <span className="hide-sm">{t.colEmail}</span>
              <span>{t.colProgress}</span>
              <span className="hide-sm">{t.colTime}</span>
              <span>{t.colLastActive}</span>
            </div>
            {filtered.length === 0 ? (
              <div className="admin-empty">{t.noUsers}</div>
            ) : (
              filtered.map((u) => (
                <button className="admin-row admin-link" key={u.id} onClick={() => setSelected(u)}>
                  <span className="admin-user">
                    <span className="pf-sm">{(u.displayName ?? "?").charAt(0).toUpperCase()}</span>
                    <span className="admin-name">
                      {u.displayName ?? "—"}
                      {u.isAdmin && <span className="admin-badge">{t.adminTag}</span>}
                    </span>
                  </span>
                  <span className="hide-sm admin-email">{u.email ?? "—"}</span>
                  <span>
                    {u.completed}/{modules.length}
                  </span>
                  <span className="hide-sm">{fmt(t.minutesUnit, { n: mins(u.totalTimeMs) })}</span>
                  <span className="admin-dim">{fmtDate(u.lastActive, t.never)}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <GaSection c={c} summary={ga} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function UserDetail({
  c,
  user,
  modules,
  onBack,
}: {
  c: Content;
  user: AdminUserSummary;
  modules: ManagerModule[];
  onBack: () => void;
}) {
  const t = c.admin;
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [aq, setAq] = useState<AssessmentQuestion[]>([]);
  const [oq, setOq] = useState<OnboardingQuestion[]>([]);

  useEffect(() => {
    let active = true;
    void fetchAdminUserDetail(user.id).then((d) => active && setDetail(d));
    void fetchAssessmentQuestions("en").then((q) => active && setAq(q));
    void fetchOnboardingQuestions("en").then((q) => active && setOq(q));
    return () => {
      active = false;
    };
  }, [user.id]);

  const moduleNum = (id: string) => {
    const i = modules.findIndex((m) => m.id === id);
    return i >= 0 ? i + 1 : 0;
  };
  const moduleLabel = (id: string) => {
    const n = moduleNum(id);
    const title = modules.find((m) => m.id === id)?.title ?? id;
    return n ? `${fmt(t.moduleLabel, { n })} · ${title}` : title;
  };
  const maxModuleMs = Math.max(1, ...(detail?.timeByModule ?? []).map((m) => m.ms));

  // attempts grouped by module, in module order
  const grouped = useMemo(() => {
    const by = new Map<string, AdminUserDetail["attempts"]>();
    (detail?.attempts ?? []).forEach((a) => {
      const arr = by.get(a.module_id) ?? [];
      arr.push(a);
      by.set(a.module_id, arr);
    });
    return [...by.entries()].sort((a, b) => moduleNum(a[0]) - moduleNum(b[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, modules]);

  return (
    <section className="view on">
      <div className="results">
        <button className="back" onClick={onBack} style={{ marginBottom: 14 }}>
          {t.back}
        </button>
        <h1 style={{ marginTop: 4 }}>{user.displayName ?? "—"}</h1>
        <p className="rlede">{user.email ?? "—"}</p>

        <div className="an-stats">
          <div className="card an-stat">
            <span className="n">{mins(detail?.totalTimeMs ?? user.totalTimeMs)}</span>
            <span className="l">{t.totalTime} ({t.minutesUnit.replace("{n} ", "")})</span>
          </div>
          <div className="card an-stat">
            <span className="n">🔥 {user.streak}</span>
            <span className="l">{t.colStreak}</span>
          </div>
          <div className="card an-stat">
            <span className="n" style={{ color: "var(--good)" }}>
              {user.completed}/{modules.length}
            </span>
            <span className="l">{t.colProgress}</span>
          </div>
          <div className="card an-stat">
            <span className="n" style={{ color: "var(--accent)" }}>{user.skips}</span>
            <span className="l">{c.analytics.skipped}</span>
          </div>
        </div>

        {/* module progress + reflections */}
        <div className="sectitle"><h3>{t.secProgress}</h3></div>
        <div className="card">
          {(detail?.modules.length ?? 0) === 0 ? (
            <p className="ga-note">{t.noResponses}</p>
          ) : (
            detail!.modules
              .slice()
              .sort((a, b) => moduleNum(a.module_id) - moduleNum(b.module_id))
              .map((m) => (
                <div className="adm-mod" key={m.module_id}>
                  <div className="adm-mod-head">
                    <span className="adm-mod-title">{moduleLabel(m.module_id)}</span>
                    <span className={`wstate ${m.status === "completed" ? "s-done" : "s-now"}`}>
                      {m.status === "completed" ? c.weekStates.done : c.weekStates.now}
                    </span>
                    {m.quiz_total > 0 && (
                      <span className="adm-score">
                        {t.scoreLabel}: {m.score_pct}% ({m.quiz_correct}/{m.quiz_total})
                      </span>
                    )}
                  </div>
                  {m.reflection && (
                    <p className="adm-reflection">
                      <span className="adm-k">{t.reflectionLabel}:</span> {m.reflection}
                    </p>
                  )}
                </div>
              ))
          )}
        </div>

        {/* every module response */}
        <div className="sectitle"><h3>{t.secResponses}</h3></div>
        <div className="card">
          {grouped.length === 0 ? (
            <p className="ga-note">{t.noResponses}</p>
          ) : (
            grouped.map(([moduleId, atts]) => (
              <div className="adm-mod" key={moduleId}>
                <div className="adm-mod-head">
                  <span className="adm-mod-title">{moduleLabel(moduleId)}</span>
                </div>
                {atts.map((a, i) => (
                  <div className="adm-resp" key={i}>
                    <div className="adm-resp-q">{a.prompt}</div>
                    <div className="adm-resp-a">
                      <span>{a.response}</span>
                      {a.is_correct === true && <span className="tag-ok">{t.correctTag}</span>}
                      {a.is_correct === false && <span className="tag-bad">{t.wrongTag}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* skills-check answers */}
        {(detail?.assessment.length ?? 0) > 0 && (
          <>
            <div className="sectitle"><h3>{t.secAssessment}</h3></div>
            <div className="card">
              {detail!.assessment.map((ans) => {
                const q = aq.find((x) => x.idx === ans.question_idx);
                return (
                  <div className="adm-resp" key={ans.question_idx}>
                    <div className="adm-resp-q">{q?.text ?? `#${ans.question_idx + 1}`}</div>
                    <div className="adm-resp-a">
                      <span>{ans.value == null ? "—" : fmt(t.valueLabel, { n: ans.value })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* onboarding answers */}
        {(detail?.onboarding.length ?? 0) > 0 && (
          <>
            <div className="sectitle"><h3>{t.secOnboarding}</h3></div>
            <div className="card">
              {detail!.onboarding.map((ans) => {
                const q = oq.find((x) => x.idx === ans.question_idx);
                const choice = ans.answer_idx != null ? q?.options[ans.answer_idx] : null;
                return (
                  <div className="adm-resp" key={ans.question_idx}>
                    <div className="adm-resp-q">{q?.text ?? `#${ans.question_idx + 1}`}</div>
                    <div className="adm-resp-a">
                      <span>{choice ?? "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* time per module */}
        {(detail?.timeByModule.length ?? 0) > 0 && (
          <>
            <div className="sectitle"><h3>{t.secTime}</h3></div>
            <div className="card">
              {detail!.timeByModule.map((m) => (
                <div className="mtime-row" key={m.moduleId}>
                  <span className="mtime-lbl">{moduleLabel(m.moduleId)}</span>
                  <div className="track" style={{ flex: 1 }}>
                    <i className="acc" style={{ width: `${Math.round((m.ms / maxModuleMs) * 100)}%` }} />
                  </div>
                  <span className="mtime-val">{fmt(t.minutesUnit, { n: mins(m.ms) })}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* skipped sections */}
        <div className="sectitle"><h3>{t.secSkips}</h3></div>
        <div className="card">
          {(detail?.skips.length ?? 0) === 0 ? (
            <p className="ga-note">{t.noSkips}</p>
          ) : (
            <ul className="adm-skips">
              {detail!.skips.map((s, i) => (
                <li key={i}>
                  {s.moduleId ? `${moduleLabel(s.moduleId)} — ` : ""}
                  {fmt(t.screenLabel, { n: (s.screenIdx ?? 0) + 1 })}
                  {s.kind ? ` (${s.kind})` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* daily activity */}
        {(detail?.daily.length ?? 0) > 0 && (
          <>
            <div className="sectitle"><h3>{t.secDaily}</h3></div>
            <div className="card">
              <DayBars points={detail!.daily.map((d) => ({ date: d.date, value: mins(d.ms) }))} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
