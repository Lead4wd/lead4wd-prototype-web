// Thin wrapper over gtag. Safe no-op when GA isn't loaded (consent declined or
// no Measurement ID), so callers can fire events unconditionally.
type Gtag = (...args: unknown[]) => void;

export function gaEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag };
  try {
    w.gtag?.("event", name, params ?? {});
  } catch {
    /* ignore */
  }
}
