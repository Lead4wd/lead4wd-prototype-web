"use client";

// Navigation helper for the views.
//
// The views take a `go(view)` callback and always have. It used to set a piece
// of React state; now it pushes a route. Keeping the same shape means the views
// themselves did not have to learn about the router.
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { View } from "@/lib/progress";
import { VIEW_PATH } from "@/lib/routes";

export function useGo(): (v: View) => void {
  const router = useRouter();
  return useCallback((v: View) => router.push(VIEW_PATH[v]), [router]);
}
