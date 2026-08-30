"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Content } from "@/data/content";
import {
  deleteConversation,
  fetchAiStatus,
  fetchConversation,
  fetchConversations,
  streamCoachReply,
  type CoachConversation,
  type CoachMessage,
} from "@/lib/data";

// AI coach chat. The reply streams in, so the assistant's last message is
// updated in place as deltas arrive. Conversations are persisted server-side:
// only the new message is sent, the API replays the stored history, and the most
// recent chat is restored on mount so a refresh loses nothing.
export default function AiCoach({ c }: { c: Content }) {
  const t = c.coach;
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [conversations, setConversations] = useState<CoachConversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  // Whether the user is parked at the bottom. If they have scrolled up to
  // re-read something, a streaming reply must not yank them back down.
  const stickRef = useRef(true);

  // Restore the most recent chat on mount, so a refresh continues where they
  // left off rather than dropping them into an empty one.
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const ok = await fetchAiStatus();
      if (cancelled) return;
      setAvailable(ok);
      if (!ok) return;

      const list = await fetchConversations();
      if (cancelled) return;
      setConversations(list);

      const latest = list[0];
      if (!latest) return;
      const msgs = await fetchConversation(latest.id);
      if (cancelled) return;
      setConversationId(latest.id);
      setMessages(msgs);
    })();

    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
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

  const openChat = useCallback(
    async (id: string) => {
      if (busy || id === conversationId) return;
      abortRef.current?.abort();
      setError(null);
      const msgs = await fetchConversation(id);
      setConversationId(id);
      setMessages(msgs);
      stickRef.current = true;
    },
    [busy, conversationId]
  );

  const startNewChat = () => {
    if (busy) return;
    abortRef.current?.abort();
    setConversationId(null);
    setMessages([]);
    setError(null);
    setInput("");
  };

  const removeChat = async (id: string) => {
    if (busy) return;
    await deleteConversation(id);
    setConversations((prev) => prev.filter((x) => x.id !== id));
    if (id === conversationId) startNewChat();
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;

    setMessages((prev) => [...prev, { role: "user", content }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError(null);
    stickRef.current = true; // they just sent — follow the reply down

    const controller = new AbortController();
    abortRef.current = controller;

    // A brand-new chat gets its id on the first SSE frame; capture it so the
    // follow-up message continues the same conversation.
    let activeId = conversationId;

    const res = await streamCoachReply(content, {
      conversationId: conversationId ?? undefined,
      signal: controller.signal,
      onConversation: (id) => {
        activeId = id;
        setConversationId(id);
      },
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
      // Drop the empty assistant bubble the failed turn left behind.
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return last?.role === "assistant" && !last.content ? prev.slice(0, -1) : prev;
      });
    }
    setBusy(false);

    // Refresh the list so a new chat appears and titles/order stay current.
    if (activeId) void fetchConversations().then(setConversations);
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
          <div className="coach-headrow">
            <div>
              <span className="eyebrow">{t.eyebrow}</span>
              <h1>{t.title}</h1>
            </div>
            <button className="btn btn-soft coach-new" onClick={startNewChat} disabled={busy || (empty && !conversationId)}>
              {t.newChat}
            </button>
          </div>
          <p className="sub">{t.lede}</p>

          {conversations.length > 0 && (
            <div className="coach-history">
              <span className="coach-history-label">{t.history}</span>
              <div className="coach-history-list">
                {conversations.map((conv) => (
                  <span key={conv.id} className={`coach-chip ${conv.id === conversationId ? "on" : ""}`}>
                    <button className="coach-chip-open" onClick={() => void openChat(conv.id)} disabled={busy}>
                      {conv.title}
                    </button>
                    <button
                      className="coach-chip-del"
                      onClick={() => void removeChat(conv.id)}
                      disabled={busy}
                      aria-label={t.deleteChat}
                      title={t.deleteChat}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
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
