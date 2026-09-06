"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "@/components/views/AdminPanel";
import { useApp } from "@/app/providers";

export default function AdminPage() {
  const router = useRouter();
  const { c, modules, profile } = useApp();

  // The API is the real boundary — every admin route checks is_admin and 403s.
  // This only stops a non-admin who typed the URL from staring at an empty
  // panel wondering what is broken.
  useEffect(() => {
    if (profile && !profile.is_admin) router.replace("/dashboard");
  }, [profile, router]);

  if (!profile?.is_admin) return null;
  return <AdminPanel c={c} modules={modules} />;
}
