"use client";

import Journey from "@/components/views/Journey";
import { useApp } from "@/app/providers";

export default function JourneyPage() {
  const { c, progress, modules, lockedClusters } = useApp();
  return <Journey c={c} progress={progress} modules={modules} lockedClusters={lockedClusters} />;
}
