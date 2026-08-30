"use client";

import { useEffect, useRef, useState } from "react";
import type { Content } from "@/data/content";
import { streamCoachReply, fetchAiStatus, type CoachMessage } from "@/lib/data";

// AI coach chat. The reply streams in, so the assistant's last message is
// updated in place as deltas arrive. Chats are ephemeral (component state) —
// nothing is persisted server-side yet.
export default function AiCoach({ c }: { c: Content }) {
  const t = c.coach;
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  // Whether the user is parked at the bottom. If they have scrolled up to
  // re-read something, a streaming reply must not yank them back down.
  const stickRef = useRef(true);

  useEffect(() => {
    void fetchAiStatus().then(setAvailable);
    return () => abortRef.current?.abort();
  }, []);

  // Keep the newest message in view as it streams. The thread is its own
  // scroll container, so scroll it directly rather than the page.
  useEffect(() => {
    const el = threadRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const onThreadScroll = () => {
    const el = threadRef.current;
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;

    const next: CoachMessage[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError(null);
    stickRef.current = true; // they just sent — follow the reply down

    const controller = new AbortController();
    abortRef.current = controller;

    const res = await streamCoachReply(
      next,
      (delta) =>
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") copy[copy.length - 1] = { ...last, content: last.content + delta };
          return copy;
        }),
      controller.signal
    );

    if (!res.ok) {
      setError(res.error);
      // Drop the empty assistant bubble the failed turn left behind.
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return last?.role === "assistant" && !last.content ? prev.slice(0, -1) : prev;
      });
    }
    setBusy(false);
  };

  if (available === false) {
    return (
      <section className="view on">
        <div className="coach-wrap coach-wrap-plain">
          <h1>{t.title}</h1>
          <p className="sub" style={{ marginTop: 10 }}>
            {t.unavailable}
          </p>
        </div>
      </section>
    );
  }

  const empty = messages.length === 0;

  return (
    <section className="view on">
      <div className="coach-wrap">
        <div className="coach-head">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p className="sub">{t.lede}</p>
        </div>

        <div className="coach-thread" ref={threadRef} onScroll={onThreadScroll}>
          {empty && (
            <div className="coach-empty">
              <p>{t.emptyHint}</p>
              <div className="coach-suggestions">
                {t.suggestions.map((s, i) => (
                  <button key={i} className="coach-suggestion" onClick={() => void send(s)} disabled={busy}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`coach-msg ${m.role}`}>
              {m.role === "assistant" && <span className="coach-who">{t.coachLabel}</span>}
              <div className="coach-bubble">
                {m.content || <span className="coach-typing" aria-label={t.thinking} />}
              </div>
            </div>
          ))}

          {error && <p className="coach-error">{error}</p>}
        </div>

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
            {busy ? t.sending : t.send}
          </button>
        </form>

        <p className="coach-disclaimer">{t.disclaimer}</p>
      </div>
    </section>
  );
}
