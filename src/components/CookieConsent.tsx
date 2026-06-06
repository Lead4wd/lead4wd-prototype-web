"use client";

import { useEffect, useState } from "react";
import type { Content } from "@/data/content";

const KEY = "lead4wd_cookie_ok";

// Lightweight consent notice for the essential auth cookies that keep users
// signed in. Dismissal is remembered in localStorage.
export default function CookieConsent({ c }: { c: Content }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      setShow(localStorage.getItem(KEY) !== "1");
    } catch {
      setShow(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!show) return null;

  return (
    <div className="cookie-bar">
      <span>{c.cookie.message}</span>
      <button
        className="btn btn-pri"
        onClick={() => {
          try {
            localStorage.setItem(KEY, "1");
          } catch {
            /* ignore */
          }
          setShow(false);
        }}
      >
        {c.cookie.accept}
      </button>
    </div>
  );
}
