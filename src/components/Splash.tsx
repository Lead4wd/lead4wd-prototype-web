// Shown while we work out whether there is a session. Deliberately wordless —
// it is on screen for a few hundred milliseconds and any copy would flash.
// Shared, because both the entry gate and the app routes can land on it.
export default function Splash() {
  return (
    <div className="entry">
      <div className="entry-card">
        <div className="entry-brand">
          <span className="arr">→</span>Lead4wd
        </div>
        <p className="lede">…</p>
      </div>
    </div>
  );
}
