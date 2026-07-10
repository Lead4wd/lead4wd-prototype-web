"use client";

import { useEffect, useRef, useState } from "react";
import type { Content } from "@/data/content";
import type { ManagerModule, Screen } from "@/data/modules";
import type { View } from "@/lib/progress";
import type { EngagementKind, QuestionAttempt } from "@/lib/data";
import { gaEvent } from "@/lib/ga";
import { fmt } from "@/lib/format";
import { ChevronLeft, Clock, Check } from "@/components/icons";

const PASS_PCT = 60;

export type ModuleResult = {
  reflection: string;
  quizCorrect: number;
  quizTotal: number;
  scorePct: number;
  attempts: QuestionAttempt[];
};

export type TrackEvent = {
  kind: EngagementKind;
  moduleId?: string | null;
  screenIdx?: number | null;
  durationMs?: number | null;
  meta?: Record<string, unknown> | null;
};

// ===========================================================================
// Module player — sequences a module's interactive screens, gates completion
// on the quiz score (>=60%), and records every answer for persistence.
// ===========================================================================
export default function ModulePlayer({
  c,
  module,
  go,
  onComplete,
  onTrack,
}: {
  c: Content;
  module: ManagerModule;
  go: (v: View) => void;
  onComplete: (result: ModuleResult) => void;
  onTrack?: (ev: TrackEvent) => void;
}) {
  const p = c.player;
  const screens = module.screens;
  const [idx, setIdx] = useState(0);
  const [reflection, setReflection] = useState("");
  const [quiz, setQuiz] = useState<{ correct: number; total: number } | null>(null);
  const [attempts, setAttempts] = useState<Record<string, QuestionAttempt>>({});

  const screen = screens[idx];
  const isLast = idx === screens.length - 1;
  const pctScreen = Math.round(((idx + 1) / screens.length) * 100);

  const quizTotal = screens.reduce((a, s) => (s.kind === "dragdrop" ? a + s.items.length : a), 0);
  const hasQuiz = quizTotal > 0;
  const dragIdx = screens.findIndex((s) => s.kind === "dragdrop");
  const attempted = quiz !== null;
  const scorePct = quiz && quiz.total > 0 ? Math.round((quiz.correct / quiz.total) * 100) : 0;
  const passed = !hasQuiz || (attempted && scorePct >= PASS_PCT);
  const gateActive = isLast && hasQuiz && !passed;

  const recordAttempt = (key: string, a: QuestionAttempt) =>
    setAttempts((prev) => ({ ...prev, [key]: a }));

  // ---- engagement tracking: time per screen + skip detection ----------------
  // Refs mirror current state so the unmount cleanup logs accurate values.
  const enterRef = useRef<{ idx: number; t: number }>({ idx: 0, t: 0 });
  const attemptsRef = useRef(attempts);
  const screensRef = useRef(screens);
  // Keep refs in sync after each render so the unmount cleanup logs latest values.
  useEffect(() => {
    attemptsRef.current = attempts;
    screensRef.current = screens;
  });

  const logLeave = (leavingIdx: number) => {
    const s = screensRef.current[leavingIdx];
    if (!s) return;
    onTrack?.({
      kind: "screen_view",
      moduleId: module.id,
      screenIdx: leavingIdx,
      durationMs: Date.now() - enterRef.current.t,
      meta: { kind: s.kind },
    });
    const interactive =
      s.kind === "dragdrop" || s.kind === "scenario" || s.kind === "selfcheck" || s.kind === "scenariopick";
    const answered = Object.keys(attemptsRef.current).some((k) => k.startsWith(`${leavingIdx}:`));
    if (interactive && !answered) {
      onTrack?.({ kind: "screen_skip", moduleId: module.id, screenIdx: leavingIdx, meta: { kind: s.kind } });
      gaEvent("screen_skipped", { module_id: module.id, screen_idx: leavingIdx });
    }
  };

  // Module start + log the final screen's time on unmount (also captures abandons).
  useEffect(() => {
    enterRef.current = { idx: 0, t: Date.now() };
    onTrack?.({ kind: "module_start", moduleId: module.id });
    gaEvent("module_started", { module_id: module.id });
    return () => logLeave(enterRef.current.idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On screen change, log time spent on the screen we just left.
  useEffect(() => {
    if (enterRef.current.idx === idx) return;
    logLeave(enterRef.current.idx);
    enterRef.current = { idx, t: Date.now() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const retake = () => {
    setIdx(0);
    setQuiz(null);
    setReflection("");
    setAttempts({});
  };

  const complete = () => {
    const finalPct = hasQuiz ? scorePct : 100;
    onTrack?.({ kind: "module_complete", moduleId: module.id, meta: { score_pct: finalPct } });
    gaEvent("module_completed", { module_id: module.id, score_pct: finalPct });
    onComplete({
      reflection,
      quizCorrect: quiz?.correct ?? 0,
      quizTotal: quiz?.total ?? 0,
      scorePct: finalPct,
      attempts: Object.values(attempts),
    });
  };

  return (
    <section className="view on">
      <div className="lesson">
        <div className="lbar">
          <button className="back" onClick={() => go("dashboard")}>
            <ChevronLeft />
            {p.back}
          </button>
          <div className="ltrack track">
            <i style={{ width: `${pctScreen}%` }} />
          </div>
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-faint)" }}>
            {fmt(p.counter, { n: idx + 1, total: screens.length })}
          </span>
        </div>

        <div className="mod-eyebrow">
          <span className="eyebrow">{module.cluster}</span>
          <span className="meta">
            <Clock />
            {fmt(c.common.minRead, { n: module.minutes })}
          </span>
        </div>

        <ScreenView
          key={idx}
          screen={screen}
          screenIdx={idx}
          p={p}
          reflection={reflection}
          setReflection={setReflection}
          onQuiz={(correct, total) => {
            setQuiz({ correct, total });
            gaEvent("quiz_scored", { module_id: module.id, correct, total });
          }}
          onAttempt={recordAttempt}
        />

        {gateActive && <div className="gate">{attempted ? fmt(p.retakeMsg, { pct: scorePct }) : p.lockedMsg}</div>}

        <div className="lesson-foot">
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-faint)" }}>
            {module.title}
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            {idx > 0 && (
              <button className="btn btn-soft" onClick={() => setIdx((i) => i - 1)}>
                {c.common.back}
              </button>
            )}
            {!isLast && (
              <button className="btn btn-pri" onClick={() => setIdx((i) => i + 1)}>
                {p.continue}
              </button>
            )}
            {isLast && passed && (
              <button className="btn btn-pri" onClick={complete}>
                {p.complete}
              </button>
            )}
            {isLast && !passed && !attempted && (
              <button className="btn btn-pri" onClick={() => setIdx(dragIdx >= 0 ? dragIdx : 0)}>
                {p.goToQuestions}
              </button>
            )}
            {isLast && !passed && attempted && (
              <button className="btn btn-pri" onClick={retake}>
                {p.retake}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function ScreenView({
  screen,
  screenIdx,
  p,
  reflection,
  setReflection,
  onQuiz,
  onAttempt,
}: {
  screen: Screen;
  screenIdx: number;
  p: Content["player"];
  reflection: string;
  setReflection: (s: string) => void;
  onQuiz: (correct: number, total: number) => void;
  onAttempt: (key: string, a: QuestionAttempt) => void;
}) {
  switch (screen.kind) {
    case "hook":
      return (
        <div className="screen">
          <h1>{screen.title}</h1>
          <div className="lbody">
            {screen.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      );

    case "compare":
      return (
        <div className="screen">
          <h2 className="screen-h">{screen.title}</h2>
          <div className="compare">
            <div className="compare-col">
              <span className="eyebrow">{screen.leftLabel}</span>
              {screen.left.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
            <div className="compare-col accent">
              <span className="eyebrow">{screen.rightLabel}</span>
              {screen.right.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </div>
          <p className="compare-highlight">{screen.highlight}</p>
        </div>
      );

    case "lesson":
      return (
        <div className="screen">
          <h2 className="screen-h">{screen.title}</h2>
          <div className="points">
            {screen.points.map((pt, i) => (
              <div className="point" key={i}>
                <span className="point-n">{i + 1}</span>
                <div>
                  <h4>{pt.h}</h4>
                  <p>{pt.p}</p>
                </div>
              </div>
            ))}
          </div>
          {screen.note && <p className="screen-note">{screen.note}</p>}
        </div>
      );

    case "dragdrop":
      return <ScreenDragDrop screen={screen} screenIdx={screenIdx} p={p} onResult={onQuiz} onAttempt={onAttempt} />;

    case "selfcheck":
      return <ScreenSelfCheck screen={screen} screenIdx={screenIdx} onAttempt={onAttempt} />;

    case "scenario":
      return <ScreenScenario screen={screen} screenIdx={screenIdx} p={p} onAttempt={onAttempt} />;

    case "action":
      return (
        <div className="screen">
          <div className="action-card">
            <span className="k">{screen.title}</span>
            <p style={{ color: "var(--on-dark)", marginTop: 10, fontSize: 15, lineHeight: 1.5 }}>{screen.intro}</p>
          </div>
          <div className="action-steps">
            {screen.steps.map((s, i) => (
              <div className="action-step" key={i}>
                <span className="point-n">{i + 1}</span>
                <p>{s}</p>
              </div>
            ))}
          </div>
          {screen.note && <p className="screen-note">{screen.note}</p>}
        </div>
      );

    case "reflect":
      return (
        <div className="screen">
          <h2 className="screen-h">{screen.title}</h2>
          <ScreenReflectScale options={screen.scaleOptions} question={screen.scaleQuestion} />
          <div className="reflect-card" style={{ marginTop: 18 }}>
            <h4>{screen.textPrompt}</h4>
            <textarea
              placeholder={screen.placeholder}
              maxLength={2000}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>
          <p className="screen-note">{screen.closing}</p>
        </div>
      );

    case "reveal":
      return <ScreenReveal screen={screen} p={p} />;

    case "scenariopick":
      return <ScreenScenarioPick screen={screen} screenIdx={screenIdx} p={p} onAttempt={onAttempt} />;

    case "scriptbuilder":
      return <ScreenScriptBuilder screen={screen} screenIdx={screenIdx} p={p} onAttempt={onAttempt} />;

    case "planbuilder":
      return <ScreenPlanBuilder screen={screen} screenIdx={screenIdx} p={p} onAttempt={onAttempt} />;

    case "commit":
      return <ScreenCommit screen={screen} screenIdx={screenIdx} onAttempt={onAttempt} />;

    case "stakeholdermap":
      return <ScreenStakeholderMap screen={screen} screenIdx={screenIdx} p={p} onAttempt={onAttempt} />;
  }
}

// ---------------------------------------------------------------------------
function ScreenDragDrop({
  screen,
  screenIdx,
  p,
  onResult,
  onAttempt,
}: {
  screen: Extract<Screen, { kind: "dragdrop" }>;
  screenIdx: number;
  p: Content["player"];
  onResult: (correct: number, total: number) => void;
  onAttempt: (key: string, a: QuestionAttempt) => void;
}) {
  const total = screen.items.length;
  const [picks, setPicks] = useState<Record<number, "left" | "right">>({});
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState(false);
  const correctCount = screen.items.filter((it, i) => picks[i] === it.side).length;

  const check = () => {
    setChecked(true);
    onResult(correctCount, total);
    screen.items.forEach((it, i) => {
      const side = picks[i];
      onAttempt(`${screenIdx}:${i}`, {
        screen_idx: screenIdx,
        kind: "dragdrop",
        prompt: it.text,
        response: side === "left" ? screen.leftLabel : screen.rightLabel,
        is_correct: side === it.side,
      });
    });
  };

  // After checking: show the full list with right/wrong + the score.
  if (checked) {
    return (
      <div className="screen">
        <h2 className="screen-h">{screen.title}</h2>
        <p className="screen-prompt">{screen.prompt}</p>
        <div className="sort-list">
          {screen.items.map((it, i) => {
            const right = picks[i] === it.side;
            return (
              <div key={i} className={`sort-item ${right ? "ok" : "bad"}`}>
                <span className="sort-text">{it.text}</span>
                <span className="sort-chosen">{picks[i] === "left" ? screen.leftLabel : screen.rightLabel}</span>
              </div>
            );
          })}
        </div>
        <p className="sort-summary">
          {p.correct}: {correctCount} / {total}
        </p>
      </div>
    );
  }

  // One statement at a time.
  const it = screen.items[step];
  const picked = picks[step];
  const isLastItem = step === total - 1;
  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      <p className="screen-prompt">{screen.prompt}</p>
      <div className="sort-progress mono">{fmt(p.counter, { n: step + 1, total })}</div>

      <div className="sort-item sort-single">
        <span className="sort-text">{it.text}</span>
        <div className="sort-btns">
          {(["left", "right"] as const).map((side) => (
            <button
              key={side}
              className={`sort-btn ${picked === side ? "on" : ""}`}
              onClick={() => setPicks((prev) => ({ ...prev, [step]: side }))}
            >
              {side === "left" ? screen.leftLabel : screen.rightLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="sort-nav">
        {!isLastItem ? (
          <button className="btn btn-pri sort-check" disabled={!picked} onClick={() => setStep((s) => s + 1)}>
            {p.continue}
          </button>
        ) : (
          <button className="btn btn-pri sort-check" disabled={!picked} onClick={check}>
            {p.check}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function ScreenSelfCheck({
  screen,
  screenIdx,
  onAttempt,
}: {
  screen: Extract<Screen, { kind: "selfcheck" }>;
  screenIdx: number;
  onAttempt: (key: string, a: QuestionAttempt) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      {screen.prompt && <p className="screen-prompt">{screen.prompt}</p>}
      <div className="opts">
        {screen.options.map((o, i) => (
          <button
            key={i}
            className={`opt ${pick === i ? "on" : ""}`}
            onClick={() => {
              setPick(i);
              onAttempt(`${screenIdx}:0`, {
                screen_idx: screenIdx,
                kind: "selfcheck",
                prompt: screen.prompt ?? screen.title,
                response: o.text,
                is_correct: null,
              });
            }}
          >
            {o.text}
          </button>
        ))}
      </div>
      {pick !== null && <p className="opt-response">{screen.options[pick].response}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
function ScreenScenario({
  screen,
  screenIdx,
  p,
  onAttempt,
}: {
  screen: Extract<Screen, { kind: "scenario" }>;
  screenIdx: number;
  p: Content["player"];
  onAttempt: (key: string, a: QuestionAttempt) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      <p className="scenario-setup">{screen.setup}</p>
      <p className="screen-prompt">{screen.question}</p>
      <div className="opts">
        {screen.choices.map((ch, i) => (
          <button
            key={i}
            className={`opt ${pick === i ? "on" : ""}`}
            onClick={() => {
              setPick(i);
              onAttempt(`${screenIdx}:0`, {
                screen_idx: screenIdx,
                kind: "scenario",
                prompt: screen.question,
                response: ch.text,
                is_correct: !!ch.best,
              });
            }}
          >
            <span>{ch.text}</span>
            {pick === i && ch.best && (
              <span className="best-badge">
                <Check /> {p.bestMove}
              </span>
            )}
          </button>
        ))}
      </div>
      {pick !== null && <p className="opt-response">{screen.choices[pick].feedback}</p>}
      {pick !== null && screen.followUp && <p className="screen-note">{screen.followUp}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
function ScreenReflectScale({ options, question }: { options: string[]; question: string }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="scale-block">
      <p className="screen-prompt">{question}</p>
      <div className="scale-chips">
        {options.map((o, i) => (
          <button key={i} className={`scale-chip ${pick === i ? "on" : ""}`} onClick={() => setPick(i)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tap-to-reveal: flip each card from the trap to the better move. No answer.
function ScreenReveal({ screen, p }: { screen: Extract<Screen, { kind: "reveal" }>; p: Content["player"] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      {screen.intro && <p className="screen-prompt">{screen.intro}</p>}
      <div className="reveal-list">
        {screen.items.map((it, i) => {
          const shown = !!open[i];
          return (
            <div key={i} className={`reveal-card ${shown ? "open" : ""}`}>
              <span className="reveal-label">{it.label}</span>
              <div className="reveal-front">
                <span className="reveal-tag">{screen.frontLabel}</span>
                <p>{it.front}</p>
              </div>
              {shown ? (
                <div className="reveal-back">
                  <span className="reveal-tag good">{screen.backLabel}</span>
                  <p>{it.back}</p>
                </div>
              ) : (
                <button className="btn btn-soft reveal-btn" onClick={() => setOpen((o) => ({ ...o, [i]: true }))}>
                  {p.reveal}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {screen.note && <p className="screen-note">{screen.note}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scenario-picker: choose a pattern, then answer that pattern's scenario.
function ScreenScenarioPick({
  screen,
  screenIdx,
  p,
  onAttempt,
}: {
  screen: Extract<Screen, { kind: "scenariopick" }>;
  screenIdx: number;
  p: Content["player"];
  onAttempt: (key: string, a: QuestionAttempt) => void;
}) {
  const [path, setPath] = useState<number | null>(null);
  const [pick, setPick] = useState<number | null>(null);
  const cur = path !== null ? screen.paths[path] : null;
  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      <p className="screen-prompt">{screen.prompt}</p>
      <div className="pick-tabs">
        {screen.paths.map((pt, i) => (
          <button
            key={i}
            className={`pick-tab ${path === i ? "on" : ""}`}
            onClick={() => {
              setPath(i);
              setPick(null);
            }}
          >
            {pt.label}
          </button>
        ))}
      </div>
      {cur && (
        <>
          <p className="scenario-setup">{cur.setup}</p>
          <p className="screen-prompt">{cur.question}</p>
          <div className="opts">
            {cur.choices.map((ch, i) => (
              <button
                key={i}
                className={`opt ${pick === i ? "on" : ""}`}
                onClick={() => {
                  setPick(i);
                  onAttempt(`${screenIdx}:0`, {
                    screen_idx: screenIdx,
                    kind: "scenario",
                    prompt: `${cur.label}: ${cur.question}`,
                    response: ch.text,
                    is_correct: !!ch.best,
                  });
                }}
              >
                <span>{ch.text}</span>
                {pick === i && ch.best && (
                  <span className="best-badge">
                    <Check /> {p.bestMove}
                  </span>
                )}
              </button>
            ))}
          </div>
          {pick !== null && <p className="opt-response">{cur.choices[pick].feedback}</p>}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Guided free-text builder: prompted fields captured as the user's own words.
function ScreenScriptBuilder({
  screen,
  screenIdx,
  p,
  onAttempt,
}: {
  screen: Extract<Screen, { kind: "scriptbuilder" }>;
  screenIdx: number;
  p: Content["player"];
  onAttempt: (key: string, a: QuestionAttempt) => void;
}) {
  const [vals, setVals] = useState<Record<number, string>>({});
  const any = Object.values(vals).some((v) => v.trim().length > 0);
  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      <p className="screen-prompt">{screen.intro}</p>
      <div className="builder">
        {screen.fields.map((f, i) => (
          <div className="builder-field" key={i}>
            <h4>{f.label}</h4>
            <p className="builder-hint">{f.hint}</p>
            <textarea
              placeholder={f.placeholder}
              maxLength={600}
              value={vals[i] ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setVals((prev) => ({ ...prev, [i]: v }));
                onAttempt(`${screenIdx}:${i}`, {
                  screen_idx: screenIdx,
                  kind: "scriptbuilder",
                  prompt: f.label,
                  response: v,
                  is_correct: null,
                });
              }}
            />
          </div>
        ))}
      </div>
      {any && <span className="saved-chip">{p.saved}</span>}
      {screen.note && <p className="screen-note">{screen.note}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 30-day plan builder: up to N focus areas, each a micro-habit + a support.
function ScreenPlanBuilder({
  screen,
  screenIdx,
  p,
  onAttempt,
}: {
  screen: Extract<Screen, { kind: "planbuilder" }>;
  screenIdx: number;
  p: Content["player"];
  onAttempt: (key: string, a: QuestionAttempt) => void;
}) {
  type Row = { area: string; habit: string; support: string };
  const [rows, setRows] = useState<Row[]>([{ area: "", habit: "", support: "" }]);
  const hintFor = (area: string) => screen.habitHints.find((h) => h.area === area)?.hint ?? "";
  const update = (i: number, patch: Partial<Row>) =>
    setRows((prev) => {
      const next = prev.map((r, j) => (j === i ? { ...r, ...patch } : r));
      const r = next[i];
      if (r.area) {
        onAttempt(`${screenIdx}:${i}`, {
          screen_idx: screenIdx,
          kind: "planbuilder",
          prompt: r.area,
          response: `${r.habit}${r.support ? ` — ${r.support}` : ""}`,
          is_correct: null,
        });
      }
      return next;
    });
  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      <p className="screen-prompt">{screen.intro}</p>
      <div className="builder">
        {rows.map((r, i) => {
          const taken = rows.filter((_, j) => j !== i).map((x) => x.area);
          return (
            <div className="plan-row" key={i}>
              <select className="plan-select" value={r.area} onChange={(e) => update(i, { area: e.target.value })}>
                <option value="">{p.choosePlaceholder}</option>
                {screen.areaOptions
                  .filter((a) => !taken.includes(a))
                  .map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
              </select>
              {r.area && (
                <>
                  <label className="builder-label">{screen.habitPrompt}</label>
                  <textarea
                    className="plan-habit"
                    placeholder={hintFor(r.area)}
                    maxLength={300}
                    value={r.habit}
                    onChange={(e) => update(i, { habit: e.target.value })}
                  />
                  <label className="builder-label">{screen.supportPrompt}</label>
                  <textarea
                    className="plan-support"
                    maxLength={300}
                    value={r.support}
                    onChange={(e) => update(i, { support: e.target.value })}
                  />
                </>
              )}
              {rows.length > 1 && (
                <button className="link-btn" onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}>
                  {p.remove}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {rows.length < screen.maxRows && (
        <button
          className="btn btn-soft"
          onClick={() => setRows((prev) => [...prev, { area: "", habit: "", support: "" }])}
        >
          {p.addItem}
        </button>
      )}
      {screen.note && <p className="screen-note">{screen.note}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Commitment: one choice (e.g. check-in cadence) that closes the plan.
function ScreenCommit({
  screen,
  screenIdx,
  onAttempt,
}: {
  screen: Extract<Screen, { kind: "commit" }>;
  screenIdx: number;
  onAttempt: (key: string, a: QuestionAttempt) => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      <p className="screen-prompt">{screen.intro}</p>
      <p className="screen-prompt" style={{ fontWeight: 600 }}>
        {screen.question}
      </p>
      <div className="opts">
        {screen.options.map((o, i) => (
          <button
            key={i}
            className={`opt ${pick === i ? "on" : ""}`}
            onClick={() => {
              setPick(i);
              onAttempt(`${screenIdx}:0`, {
                screen_idx: screenIdx,
                kind: "commit",
                prompt: screen.question,
                response: o,
                is_correct: null,
              });
            }}
          >
            {o}
          </button>
        ))}
      </div>
      {pick !== null && <p className="screen-note">{screen.closing}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stakeholder map + power/interest grid: rows tagged to a plain classification.
function ScreenStakeholderMap({
  screen,
  screenIdx,
  p,
  onAttempt,
}: {
  screen: Extract<Screen, { kind: "stakeholdermap" }>;
  screenIdx: number;
  p: Content["player"];
  onAttempt: (key: string, a: QuestionAttempt) => void;
}) {
  type Row = { name: string; rel: string; power: string; interest: string };
  const empty: Row = { name: "", rel: "", power: "", interest: "" };
  const [rows, setRows] = useState<Row[]>([{ ...empty }]);
  const levels = [p.levelLow, p.levelMedium, p.levelHigh];
  const classify = (r: Row) => {
    if (!r.power || !r.interest) return "";
    const ph = r.power === p.levelHigh;
    const ih = r.interest === p.levelHigh;
    const c = screen.classifications;
    return ph && ih ? c.highHigh : ph ? c.highLow : ih ? c.lowHigh : c.lowLow;
  };
  const update = (i: number, patch: Partial<Row>) =>
    setRows((prev) => {
      const next = prev.map((r, j) => (j === i ? { ...r, ...patch } : r));
      const r = next[i];
      if (r.name) {
        const cls = classify(r);
        onAttempt(`${screenIdx}:${i}`, {
          screen_idx: screenIdx,
          kind: "stakeholder",
          prompt: r.name,
          response:
            `${r.rel}${r.power ? ` · ${p.power}: ${r.power}` : ""}` +
            `${r.interest ? ` · ${p.interest}: ${r.interest}` : ""}${cls ? ` → ${cls}` : ""}`,
          is_correct: null,
        });
      }
      return next;
    });
  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      <p className="screen-prompt">{screen.prompt}</p>
      {screen.hint && <p className="builder-hint">{screen.hint}</p>}
      <div className="builder">
        {rows.map((r, i) => {
          const cls = classify(r);
          return (
            <div className="stake-row" key={i}>
              <input
                className="stake-name"
                placeholder={p.namePlaceholder}
                maxLength={80}
                value={r.name}
                onChange={(e) => update(i, { name: e.target.value })}
              />
              <div className="stake-tags">
                <select value={r.rel} onChange={(e) => update(i, { rel: e.target.value })}>
                  <option value="">{p.relationship}</option>
                  {screen.relationshipOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <select value={r.power} onChange={(e) => update(i, { power: e.target.value })}>
                  <option value="">{p.power}</option>
                  {levels.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <select value={r.interest} onChange={(e) => update(i, { interest: e.target.value })}>
                  <option value="">{p.interest}</option>
                  {levels.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              {cls && <p className="stake-class">{cls}</p>}
              {rows.length > 1 && (
                <button className="link-btn" onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}>
                  {p.remove}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {rows.length < 5 && (
        <button className="btn btn-soft" onClick={() => setRows((prev) => [...prev, { ...empty }])}>
          {p.addItem}
        </button>
      )}
      {screen.note && <p className="screen-note">{screen.note}</p>}
    </div>
  );
}
