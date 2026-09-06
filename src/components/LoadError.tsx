"use client";

import type { Content } from "@/data/content";

// "We couldn't load this", as opposed to "there is nothing here".
//
// Every fetch in the data layer resolves to null on failure and most callers
// substitute an empty value, so a dropped request and a genuinely empty account
// used to look identical. That is the worst possible ambiguity for a learning
// app: it reads as "my progress is gone".
export default function LoadError({ c, onRetry }: { c: Content; onRetry?: () => void }) {
  return (
    <div className="loaderr" role="status">
      <p>{c.common.loadFailed}</p>
      {onRetry && (
        <button className="btn btn-soft" onClick={onRetry}>
          {c.common.retry}
        </button>
      )}
    </div>
  );
}
