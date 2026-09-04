"use client";

import { useEffect, useRef, useState } from "react";
import type { Content } from "@/data/content";
import { fetchAiStatus, streamCoachReply, type CoachArtifact } from "@/lib/data";

// Reflection partner — the in-lesson half of the AI coach.
//
// Sits under a reflect / scriptbuilder / planbuilder screen and responds to what
// the manager has just written: a sharpening question, a tighter line they could
// say out loud, or a pressure-test of their plan. Deliberately opt-in: it costs a
// model call, and an unrequested response while someone is still typing would
// interrupt the thinking the screen exists to provoke.
//
// The reply starts a saved conversation, so they can carry it on later in the
// full coach view rather than losing it when the lesson ends.
export default function ReflectionPartner({
  c,
  draft,
  artifact,
  minChars = 40,
}: {
  c: Content;
  /** What they have written so far, already joined into one block of text. */
  draft: string;
  artifact: CoachArtifact;
  /** Below this, there isn't enough to react to. */
  minChars?: number;
}) {
  const t = c.coach.partner;
  const [available, setAvailable] = useState(false);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    void fetchAiStatus().then(setAvailable);
    return () => abortRef.current?.abort();
  }, []);

  const trimmed = draft.trim();
  const ready = trimmed.length >= minChars;

  const ask = async () => {
    if (!ready || busy) return;
    setBusy(true);
    setError(null);
    setReply("");
    setDone(false);

    const controller = new AbortController();
    abortRef.current = controller;

    const res = await streamCoachReply(trimmed, {
      artifact,
      signal: controller.signal,
      onDelta: (delta) => setReply((prev) => prev + delta),
    });

    if (!res.ok) setError(res.error);
    else setDone(true);
    setBusy(false);
  };

  // Nothing to offer if the coach isn't configured — stay out of the way rather
  // than showing a button that always fails.
  if (!available) return null;

  return (
    <div className="partner">
      <div className="partner-head">
        <span className="partner-badge">{c.coach.coachLabel}</span>
        <p className="partner-lede">{t.lede}</p>
      </div>

      {!reply && !busy && (
        <>
          <button className="btn btn-soft partner-ask" onClick={() => void ask()} disabled={!ready}>
            {t.ask}
          </button>
          {!ready && <p className="partner-hint">{t.needMore}</p>}
        </>
      )}

      {(busy || reply) && (
        <div className="partner-reply">
          {reply || <span className="coach-typing" aria-label={c.coach.thinking} />}
        </div>
      )}

      {error && <p className="coach-error">{error}</p>}

      {done && (
        <div className="partner-foot">
          <p className="partner-hint">{t.savedNote}</p>
          <button className="btn btn-soft partner-again" onClick={() => void ask()} disabled={busy}>
            {t.again}
          </button>
        </div>
      )}
    </div>
  );
}
