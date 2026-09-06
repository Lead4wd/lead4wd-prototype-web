"use client";

// The signed-in shell.
//
// Wraps every routed view in the sidebar/topbar chrome and guards them: a
// signed-out visitor typing /coach into the address bar is sent back to the
// gate rather than shown an empty frame. This is a layout, so the chrome and
// all the state above it survive navigation between views.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../providers";
import AppShell from "@/components/AppShell";
import LoadError from "@/components/LoadError";
import Splash from "@/components/Splash";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { phase, profile, c, contentFailed, retryContent } = useApp();

  // `loading` is not a redirect: we do not yet know whether they are signed in,
  // and bouncing them to the gate would flash the intro at a returning user on
  // every refresh.
  useEffect(() => {
    if (phase !== "loading" && phase !== "app") router.replace("/");
  }, [phase, router]);

  if (phase !== "app" || !profile) return <Splash />;

  return (
    <AppShell>
      {/* Without the curriculum the journey and every lesson are empty, which
          looks like a broken account rather than a failed request. Say which. */}
      {contentFailed && <LoadError c={c} onRetry={retryContent} />}
      {children}
    </AppShell>
  );
}
