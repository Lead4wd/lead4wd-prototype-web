import { useState } from "react";
import type { Content } from "@/data/content";

export default function Auth({ c, onLogin }: { c: Content; onLogin: () => void }) {
  const a = c.auth;
  const [dummy, setDummy] = useState(false);

  return (
    <div className="entry">
      <div className="entry-card">
        <div className="entry-brand">
          <span className="arr">→</span>Lead4wd
        </div>
        <span className="eyebrow">{a.eyebrow}</span>
        <h1>{a.title}</h1>
        <p className="lede">{a.sub}</p>

        <input className="field" type="text" placeholder={a.emailPlaceholder} />
        <input className="field" type="password" placeholder={a.passwordPlaceholder} />

        <div className="authrow">
          <label className="check">
            <input type="checkbox" /> {a.remember}
          </label>
          <button className="linkbtn" onClick={() => setDummy(true)}>
            {a.forgot}
          </button>
        </div>

        <button className="btn btn-pri" onClick={onLogin}>
          {a.login}
        </button>
        <div style={{ height: 10 }} />
        <button className="btn btn-soft" onClick={() => setDummy(true)}>
          {a.google}
        </button>

        <p className="dim">
          {a.noAccount}{" "}
          <button className="linkbtn" onClick={() => setDummy(true)}>
            {a.signUp}
          </button>
        </p>
        {dummy && <p className="dummy-msg">{a.dummy}</p>}
      </div>
    </div>
  );
}
