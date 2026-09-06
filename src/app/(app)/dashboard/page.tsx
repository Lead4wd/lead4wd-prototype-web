"use client";

import Dashboard from "@/components/views/Dashboard";
import { useApp } from "@/app/providers";
import { useGo } from "@/lib/navigation";

export default function DashboardPage() {
  const { c, progress, modules, profile } = useApp();
  const go = useGo();
  if (!profile) return null;
  return (
    <Dashboard
      c={c}
      progress={progress}
      go={go}
      modules={modules}
      userName={profile.display_name?.trim() || c.profile.name}
    />
  );
}
