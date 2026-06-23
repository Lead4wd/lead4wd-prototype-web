"use client";

import { useEffect, useState } from "react";
import type { Content } from "@/data/content";
import { getConsent, setConsent } from "@/lib/consent";

// Consent banner for the optional Google Analytics layer. Essential auth cookies
// always apply; Analytics loads only on Accept. Choice is remembered.
export default function CookieConsent({ c }: { c: Content }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(getConsent() === "unset");
  }, []);

  if (!show) return null;

  const choose = (v: "accepted" | "declined") => {
    setConsent(v);
    setShow(false);
  };

  return (
    <div className="cookie-bar">
      <span>{c.cookie.message}</span>
      <div className="cookie-actions">
        <button className="btn btn-ghost" onClick={() => choose("declined")}>
          {c.cookie.decline}
        </button>
        <button className="btn btn-pri" onClick={() => choose("accepted")}>
          {c.cookie.accept}
        </button>
      </div>
    </div>
  );
}
