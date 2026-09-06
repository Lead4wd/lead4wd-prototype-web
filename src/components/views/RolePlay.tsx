"use client";

import { useEffect, useRef, useState } from "react";
import type { Content } from "@/data/content";
import {
  fetchAiStatus,
  fetchRolePlays,
  streamCoachReply,
  type CoachMessage,
  type RolePlayScenario,
} from "@/lib/data";

// Practice — rehearse a difficult conversation against the model playing the
// other person, then get a debrief on how it actually went.
//
// Two phases share one conversation: in character, then coaching. Once the
// debrief has run the rehearsal is over — replying again would mean the coach
// answering as the employee, so the composer closes and the only way on is to
// run it again or pick another scenario.
type Phase = "picking" | "playing" | "debriefed";

export default function RolePlay({ c }: { c: Content }) {
  const t = c.practice;
  const [available, setAvailable] = useState<boolean | null>(null);
  const [scenarios, setScenarios] = useState<RolePlayScenario[]>([]);
  const [scenario, setScenario] = useState<RolePlayScenario | null>(null);
  const [phase, setPhase] = useState<Phase>("picking");
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const stickRef = useRef(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ok = await fetchAiStatus();
      if (cancelled) return;
      setAvailable(ok);
      if (ok) setScenarios(await fetchRolePlays());
    })();
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const onThreadScroll = () => {
    const el = threadRef.current;
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  // One turn of the rehearsal, or the debrief. Both stream into the last bubble.
  const send = async (text: string, debrief = false) => {
    const content = text.trim();
    if (!content || busy || !scenario) return;

    setMessages((prev) => [...prev, { role: "user", content }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError(null);
    stickRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;

    const res = await streamCoachReply(content, {
      conversationId,
      roleplay: { scenarioId: scenario.id, phase: debrief ? "debrief" : "play" },
      signal: controller.signal,
      onConversation: setConversationId,
      onDelta: (delta) =>
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") copy[copy.length - 1] = { ...last, content: last.content + delta };
          return copy;
        }),
    });

    if (!res.ok) {
      setError(res.error);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return last?.role === "assistant" && !last.content ? prev.slice(0, -1) : prev;
      });
    } else if (debrief) {
      setPhase("debriefed");
    }
    setBusy(false);
  };

  const start = (s: RolePlayScenario) => {
    abortRef.current?.abort();
    setScenario(s);
    setPhase("playing");
    setMessages([]);
    setConversationId(undefined);
    setInput("");
    setError(null);
  };

  const reset = () => {
    abortRef.current?.abort();
    setScenario(null);
    setPhase("picking");
    setMessages([]);
    setConversationId(undefined);
    setError(null);
  };

  if (available === false) {
    return (
      <section className="view on">
        <div className="coach-wrap coach-wrap-plain">
          <h1>{t.title}</h1>
          <p className="sub" style={{ marginTop: 10 }}>
            {c.coach.unavailable}
          </p>
        </div>
      </section>
    );
  }

  // ---- scenario picker ----------------------------------------------------
  if (phase === "picking" || !scenario) {
    return (
      <section className="view on">
        <div className="coach-wrap coach-wrap-plain">
          <div className="coach-head">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p className="sub">{t.lede}</p>
          </div>

          {scenarios.length === 0 ? (
            <p className="sub">{t.none}</p>
          ) : (
            <div className="rp-list">
              {scenarios.map((s) => (
                <button key={s.id} className="rp-card" onClick={() => start(s)}>
                  <span className="rp-card-label">{s.label}</span>
                  <span className="rp-card-module">{s.moduleTitle}</span>
                  <span className="rp-card-setup">{s.setup}</span>
                  <span className="rp-card-go">{t.start}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // ---- the rehearsal itself ------------------------------------------------
  const canDebrief = messages.some((m) => m.role === "user") && phase === "playing";

  return (
    <section className="view on">
      <div className="coach-wrap">
        <div className="coach-head">
          <div className="coach-headrow">
            <div>
              <span className="eyebrow">{t.eyebrow}</span>
              <h1>{scenario.label}</h1>
            </div>
            <button className="btn btn-soft coach-new" onClick={reset} disabled={busy}>
              {t.change}
            </button>
          </div>
          <p className="rp-setup">{scenario.setup}</p>
        </div>

        <div className="coach-thread" ref={threadRef} onScroll={onThreadScroll}>
          {messages.length === 0 && <div className="coach-empty">{t.openingHint}</div>}

          {messages.map((m, i) => (
            <div key={i} className={`coach-msg ${m.role}`}>
              {m.role === "assistant" && (
                <span className="coach-who">{phase === "debriefed" && i === messages.length - 1 ? c.coach.coachLabel : t.themLabel}</span>
              )}
              <div className="coach-bubble">
                {m.content || <span className="coach-typing" aria-label={c.coach.thinking} />}
              </div>
            </div>
          ))}

          {error && <p className="coach-error">{error}</p>}
        </div>

        {phase === "debriefed" ? (
          <div className="rp-done">
            <p className="partner-hint">{t.doneNote}</p>
            <button className="btn btn-pri" onClick={() => start(scenario)} disabled={busy}>
              {t.again}
            </button>
          </div>
        ) : (
          <>
            <form
              className="coach-composer"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                maxLength={4000}
                disabled={busy}
                aria-label={t.placeholder}
              />
              <button className="btn btn-pri" type="submit" disabled={busy || !input.trim()}>
                {busy ? c.coach.sending : c.coach.send}
              </button>
            </form>
            <div className="rp-actions">
              <button className="btn btn-soft" onClick={() => void send(t.debriefAsk, true)} disabled={!canDebrief || busy}>
                {t.debrief}
              </button>
            </div>
          </>
        )}

        <p className="coach-disclaimer">{t.disclaimer}</p>
      </div>
    </section>
  );
}
