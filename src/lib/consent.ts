// Cookie-consent state for the optional Google Analytics layer. Stored in
// localStorage; changes broadcast on a window event so the GA loader reacts live.
export const CONSENT_KEY = "lead4wd_cookie_ok"; // "1" accepted · "0" declined
export const CONSENT_EVENT = "lead4wd-consent";

export type Consent = "accepted" | "declined" | "unset";

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "1" ? "accepted" : v === "0" ? "declined" : "unset";
  } catch {
    return "unset";
  }
}

export function setConsent(v: "accepted" | "declined"): void {
  try {
    localStorage.setItem(CONSENT_KEY, v === "accepted" ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: v }));
  }
}
