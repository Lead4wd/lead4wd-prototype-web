"use client";

import RolePlay from "@/components/views/RolePlay";
import { useApp } from "@/app/providers";

export default function PracticePage() {
  return <RolePlay c={useApp().c} />;
}
