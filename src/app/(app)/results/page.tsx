"use client";

import SkillsProfile from "@/components/views/SkillsProfile";
import { useApp } from "@/app/providers";
import { useGo } from "@/lib/navigation";

export default function ResultsPage() {
  const { c, progress } = useApp();
  const go = useGo();
  return <SkillsProfile c={c} scores={progress.scores} go={go} onRetake={() => go("assessment")} />;
}
