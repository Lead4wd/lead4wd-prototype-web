"use client";

import { useEffect, useRef, useState } from "react";
import type { Content } from "@/data/content";
import { fetchCheckIn, streamCoachReply, type CheckInState, type CoachMessage } from "@/lib/data";

// Proactive check-in — the coach following up, unprompted, on the plan the
// manager committed to in a lesson.
//
// There is no push channel in the prototype, so "proactive" means the nudge is
// waiting on the dashboard the next time they open the app. It only appears when
// the API says one is due; the server decides that, not this component.
//
// Opening it costs a model call, so nothing is sent until they choose to open —
// a nudge that silently bills on every dashboard load would be the wrong trade.
export default function CheckIn({ c }: { c: Content }) {
  const t = c.checkin;
  const [state, setState] = useState<CheckInState | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    void fetchCheckIn().then(setState);
    return () => abortRef.current?.abort();
  }, []);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;

    // The opening turn is the coach's, so only show a user bubble once they reply.
    const first = messages.length === 0;
    setMessages((prev) => [
      ...prev,
      ...(first ? [] : [{ role: "user" as const, content }]),
      { role: "assistant" as const, content: "" },
    ]);
    setInput("");
    setBusy(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    const res = await streamCoachReply(content, {
      conversationId,
      checkin: true,
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
    }
    setBusy(false);
  };

  const start = () => {
    setOpen(true);
    void send(t.opener);
  };

  if (dismissed || !state?.due || state.commitments.length === 0) return null;

  return (
    <div className="checkin">
      <div className="checkin-head">
        <span className="partner-badge">{c.coach.coachLabel}</span>
        <span className="checkin-when">{t.daysAgo.replace("{n}", String(state.daysSince))}</span>
        {!open && (
          <button className="checkin-dismiss" onClick={() => setDismissed(true)} aria-label={t.dismiss}>
            ×
          </button>
        )}
      </div>

      <p className="checkin-lede">{t.lede}</p>

      {/* Their own words, so the nudge is visibly about something real. */}
      <ul className="checkin-commitments">
        {state.commitments.map((cm, i) => (
          <li key={i}>
            <span className="checkin-area">{cm.area}</span>
            {cm.detail}
          </li>
        ))}
      </ul>

      {!open ? (
        <button className="btn btn-pri checkin-cta" onClick={start}>
          {t.cta}
        </button>
      ) : (
        <div className="checkin-thread">
          {messages.map((m, i) => (
            <div key={i} className={`coach-msg ${m.role}`}>
              {m.role === "assistant" && <span className="coach-who">{c.coach.coachLabel}</span>}
              <div className="coach-bubble">
                {m.content || <span className="coach-typing" aria-label={c.coach.thinking} />}
              </div>
            </div>
          ))}

          {error && <p className="coach-error">{error}</p>}

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
        </div>
      )}
    </div>
  );
}
