"use client";

import { useState } from "react";
import type { Content } from "@/data/content";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Real email/password auth. Routing on success is handled by page.tsx's
// onAuthStateChange listener; this screen owns the form + error/loading state.
export default function Auth({ c }: { c: Content }) {
  const a = c.auth;
  const sb = getSupabaseBrowserClient();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    if (!email || !password) return;
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: { data: { display_name: name.trim() || email.split("@")[0] } },
        });
        if (error) {
          setMsg(error.message);
        } else if (!data.session) {
          // No session → email confirmation is still enabled. Surface a clear message.
          const { error: e2 } = await sb.auth.signInWithPassword({ email, password });
          if (e2) setMsg(e2.message);
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) setMsg(error.message);
      }
    } catch {
      setMsg(a.error);
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!email) {
      setMsg(a.forgotPrompt);
      return;
    }
    setBusy(true);
    setMsg(null);
    const { error } = await sb.auth.resetPasswordForEmail(email);
    setMsg(error ? error.message : a.forgotSent);
    setBusy(false);
  };

  const isSignup = mode === "signup";

  return (
    <div className="entry">
      <div className="entry-card">
        <div className="entry-brand">
          <span className="arr">→</span>Lead4wd
        </div>
        <span className="eyebrow">{a.eyebrow}</span>
        <h1>{isSignup ? a.signupTitle : a.title}</h1>
        <p className="lede">{isSignup ? a.signupSub : a.sub}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          {isSignup && (
            <input
              className="field"
              type="text"
              placeholder={a.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className="field"
            type="email"
            autoComplete="email"
            placeholder={a.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="field"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder={a.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isSignup && (
            <div className="authrow">
              <label className="check">
                <input type="checkbox" defaultChecked /> {a.remember}
              </label>
              <button type="button" className="linkbtn" onClick={() => void forgot()}>
                {a.forgot}
              </button>
            </div>
          )}

          <button className="btn btn-pri" type="submit" disabled={busy}>
            {busy ? a.working : isSignup ? a.createAccount : a.login}
          </button>
        </form>

        {msg && <p className="dummy-msg">{msg}</p>}

        <p className="dim">
          {isSignup ? a.haveAccount : a.noAccount}{" "}
          <button
            className="linkbtn"
            onClick={() => {
              setMode(isSignup ? "login" : "signup");
              setMsg(null);
            }}
          >
            {isSignup ? a.login : a.signUp}
          </button>
        </p>
      </div>
    </div>
  );
}
