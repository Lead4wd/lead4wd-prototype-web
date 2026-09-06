"use client";

import TeamPulse from "@/components/views/TeamPulse";
import { useApp } from "@/app/providers";

export default function TeamPage() {
  return <TeamPulse c={useApp().c} />;
}
