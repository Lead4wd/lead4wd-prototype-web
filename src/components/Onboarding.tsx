import type { Content } from "@/data/content";

// Pre-auth welcome card. The onboarding *questions* now run post-signup in
// FirstRun (so answers attach to the user); this is just the intro → Auth.
export default function Onboarding({ c, onDone }: { c: Content; onDone: () => void }) {
  const o = c.onboarding;
  return (
    <div className="entry">
      <div className="entry-card">
        <div className="entry-brand">
          <span className="arr">→</span>Lead4wd
        </div>
        <span className="eyebrow">{o.eyebrow}</span>
        <h1>{o.title}</h1>
        <p className="lede">{o.sub}</p>
        <button className="btn btn-pri" onClick={onDone}>
          {o.next}
        </button>
      </div>
    </div>
  );
}
