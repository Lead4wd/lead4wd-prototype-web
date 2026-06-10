"use client";

import { useState } from "react";
import type { Content } from "@/data/content";
import type { ManagerModule, Screen } from "@/data/modules";
import type { View } from "@/lib/progress";
import type { QuestionAttempt } from "@/lib/data";
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

// ===========================================================================
// Module player — sequences a module's interactive screens, gates completion
// on the quiz score (>=60%), and records every answer for persistence.
// ===========================================================================
export default function ModulePlayer({
  c,
  module,
  go,
  onComplete,
}: {
  c: Content;
  module: ManagerModule;
  go: (v: View) => void;
  onComplete: (result: ModuleResult) => void;
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

  const retake = () => {
    setIdx(0);
    setQuiz(null);
    setReflection("");
    setAttempts({});
  };

  const complete = () => {
    onComplete({
      reflection,
      quizCorrect: quiz?.correct ?? 0,
      quizTotal: quiz?.total ?? 0,
      scorePct: hasQuiz ? scorePct : 100,
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
          onQuiz={(correct, total) => setQuiz({ correct, total })}
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
  const [picks, setPicks] = useState<Record<number, "left" | "right">>({});
  const [checked, setChecked] = useState(false);
  const allPicked = screen.items.every((_, i) => picks[i]);
  const correctCount = screen.items.filter((it, i) => picks[i] === it.side).length;

  const check = () => {
    setChecked(true);
    onResult(correctCount, screen.items.length);
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

  return (
    <div className="screen">
      <h2 className="screen-h">{screen.title}</h2>
      <p className="screen-prompt">{screen.prompt}</p>

      <div className="sort-list">
        {screen.items.map((it, i) => {
          const pick = picks[i];
          const right = pick === it.side;
          return (
            <div key={i} className={`sort-item ${checked ? (right ? "ok" : "bad") : ""}`}>
              <span className="sort-text">{it.text}</span>
              <div className="sort-btns">
                {(["left", "right"] as const).map((side) => (
                  <button
                    key={side}
                    className={`sort-btn ${pick === side ? "on" : ""}`}
                    disabled={checked}
                    onClick={() => setPicks((prev) => ({ ...prev, [i]: side }))}
                  >
                    {side === "left" ? screen.leftLabel : screen.rightLabel}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button className="btn btn-soft sort-check" disabled={!allPicked} onClick={check}>
          {p.check}
        </button>
      ) : (
        <p className="sort-summary">
          {p.correct}: {correctCount} / {screen.items.length}
        </p>
      )}
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
