"use client";

import AiCoach from "@/components/views/AiCoach";
import { useApp } from "@/app/providers";

export default function CoachPage() {
  return <AiCoach c={useApp().c} />;
}
