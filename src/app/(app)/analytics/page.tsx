"use client";

import Analytics from "@/components/views/Analytics";
import { useApp } from "@/app/providers";

export default function AnalyticsPage() {
  const { c, modules } = useApp();
  return <Analytics c={c} modules={modules} />;
}
