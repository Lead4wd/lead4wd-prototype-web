"use client";

import { useParams } from "next/navigation";
import LessonView from "@/components/views/LessonView";

/** `/lesson/m8` — one named module, so a lesson can be linked to. */
export default function LessonModulePage() {
  const params = useParams<{ moduleId: string | string[] }>();
  const raw = params?.moduleId;
  const moduleId = Array.isArray(raw) ? raw[0] : raw;
  return <LessonView moduleId={moduleId} />;
}
