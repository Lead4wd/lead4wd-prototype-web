// ============================================================================
// Lead4wd — data access via the REST API layer (lead4wd-api).
// ----------------------------------------------------------------------------
// The browser no longer talks to Supabase for DATA — it calls the API, which
// validates the Supabase JWT and forwards it (RLS still applies). Auth itself
// (login/signup/session) still uses the Supabase browser client; we read its
// access token here to authorize API calls.
// ============================================================================
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { DEFAULT_SCORES, SKILL_ORDER, type SkillId } from "@/data/content";
import type { ManagerModule, Screen } from "@/data/modules";
import type { Progress } from "@/lib/progress";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

function logErr(op: string, detail: unknown) {
  console.error(`[lead4wd] ${op}:`, detail);
}

async function authHeaders(): Promise<Record<string, string>> {
  try {
    const { data } = await getSupabaseBrowserClient().auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: await authHeaders() });
    if (!res.ok) {
      logErr(`GET ${path}`, res.status);
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    logErr(`GET ${path}`, e);
    return null;
  }
}

async function apiSend(method: "POST" | "PUT" | "PATCH" | "DELETE", path: string, body?: unknown): Promise<boolean> {
  try {
    // Only set a JSON content-type when there's actually a body — otherwise a
    // bodyless DELETE trips the server's "empty JSON body" guard.
    const headers = await authHeaders();
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      logErr(`${method} ${path}`, res.status);
      return false;
    }
    return true;
  } catch (e) {
    logErr(`${method} ${path}`, e);
    return false;
  }
}

// ---------- content ----------
export async function fetchModules(): Promise<ManagerModule[]> {
  const data = await apiGet<Array<Omit<ManagerModule, "screens"> & { screens: unknown }>>("/modules");
  return (data ?? []).map((r) => ({
    id: r.id,
    skill: r.skill as SkillId,
    cluster: r.cluster,
    title: r.title,
    summary: r.summary,
    minutes: r.minutes,
    screens: (r.screens as unknown as Screen[]) ?? [],
  }));
}

export async function fetchLockedClusters(): Promise<string[]> {
  return (await apiGet<string[]>("/locked-clusters")) ?? [];
}

export type AssessmentQuestion = { idx: number; skill: SkillId; text: string };
export async function fetchAssessmentQuestions(lang: string): Promise<AssessmentQuestion[]> {
  return (await apiGet<AssessmentQuestion[]>(`/questions/assessment?lang=${encodeURIComponent(lang)}`)) ?? [];
}

export type OnboardingQuestion = { idx: number; text: string; options: string[] };
export async function fetchOnboardingQuestions(lang: string): Promise<OnboardingQuestion[]> {
  return (await apiGet<OnboardingQuestion[]>(`/questions/onboarding?lang=${encodeURIComponent(lang)}`)) ?? [];
}

// ---------- scoring (pure — also used client-side for immediate results) ------
export function computeScores(
  answers: { question_idx: number; value: number | null }[],
  questions: { idx: number; skill: SkillId }[]
): Record<SkillId, number> {
  const skillOf = new Map(questions.map((q) => [q.idx, q.skill]));
  const sum: Record<string, { t: number; n: number }> = {};
  SKILL_ORDER.forEach((s) => (sum[s] = { t: 0, n: 0 }));
  answers.forEach((a) => {
    const sk = skillOf.get(a.question_idx);
    if (sk && a.value != null) {
      sum[sk].t += a.value;
      sum[sk].n += 1;
    }
  });
  const res = {} as Record<SkillId, number>;
  SKILL_ORDER.forEach((s) => (res[s] = sum[s].n ? Math.round((sum[s].t / sum[s].n) * 10) / 10 : DEFAULT_SCORES[s]));
  return res;
}

// ---------- profile ----------
export type ProfileRow = {
  id: string;
  display_name: string | null;
  email: string | null;
  role: string;
  language: string;
  streak: number;
  onboarded: boolean;
  is_admin: boolean;
};

export async function loadProfile(_userId: string): Promise<ProfileRow | null> {
  return apiGet<ProfileRow>("/me/profile");
}

export async function updateProfile(
  _userId: string,
  patch: Partial<Pick<ProfileRow, "display_name" | "role" | "language" | "onboarded" | "streak">>
): Promise<void> {
  await apiSend("PATCH", "/me/profile", patch);
}

// ---------- per-user progress ----------
export async function loadUserState(_userId: string): Promise<Progress> {
  const data = await apiGet<Progress>("/me/state");
  return (
    data ?? {
      completedModules: [],
      actionsTried: [],
      reflections: {},
      streak: 0,
      scores: computeScores([], []),
    }
  );
}

export async function saveOnboardingAnswers(_userId: string, answers: (number | null)[]): Promise<void> {
  await apiSend("PUT", "/me/onboarding-answers", { answers });
}

export async function saveAssessmentAnswers(_userId: string, answers: (number | null)[]): Promise<void> {
  await apiSend("PUT", "/me/assessment-answers", { answers });
}

export type QuestionAttempt = {
  screen_idx: number;
  kind: string;
  prompt: string | null;
  response: string | null;
  is_correct: boolean | null;
};

export async function saveModuleCompletion(
  _userId: string,
  moduleId: string,
  data: {
    quizCorrect: number;
    quizTotal: number;
    scorePct: number;
    reflection: string;
    attempts: QuestionAttempt[];
    newStreak: number;
    alreadyCompleted: boolean;
  }
): Promise<void> {
  await apiSend("POST", `/me/modules/${encodeURIComponent(moduleId)}/complete`, data);
}

export async function deleteAccount(): Promise<boolean> {
  return apiSend("DELETE", "/me/account");
}

// ---------- engagement tracking ----------
export type EngagementKind = "screen_view" | "screen_skip" | "module_start" | "module_complete";

export async function track(
  _userId: string,
  ev: {
    kind: EngagementKind;
    moduleId?: string | null;
    screenIdx?: number | null;
    durationMs?: number | null;
    meta?: Record<string, unknown> | null;
  }
): Promise<void> {
  await apiSend("POST", "/me/events", {
    kind: ev.kind,
    moduleId: ev.moduleId ?? null,
    screenIdx: ev.screenIdx ?? null,
    durationMs: ev.durationMs ?? null,
    meta: ev.meta ?? null,
  });
}

// ---------- analytics (shapes returned ready-to-render by the API) ------------
export type DailyPoint = { date: string; ms: number; events: number };
export type ModuleTime = { moduleId: string; ms: number };

export type UserAnalytics = {
  totalTimeMs: number;
  activeDays: number;
  completed: number;
  started: number;
  skips: number;
  daily: DailyPoint[];
  timeByModule: ModuleTime[];
};

const EMPTY_ANALYTICS: UserAnalytics = {
  totalTimeMs: 0,
  activeDays: 0,
  completed: 0,
  started: 0,
  skips: 0,
  daily: [],
  timeByModule: [],
};

export async function loadUserAnalytics(_userId: string): Promise<UserAnalytics> {
  return (await apiGet<UserAnalytics>("/me/analytics")) ?? EMPTY_ANALYTICS;
}

export type AdminUserSummary = {
  id: string;
  displayName: string | null;
  email: string | null;
  isAdmin: boolean;
  streak: number;
  onboarded: boolean;
  completed: number;
  started: number;
  skips: number;
  totalTimeMs: number;
  lastActive: string | null;
};

export type AdminOverview = {
  users: AdminUserSummary[];
  totals: { users: number; onboarded: number; completedModules: number; totalTimeMs: number };
};

export async function fetchAdminOverview(): Promise<AdminOverview> {
  return (
    (await apiGet<AdminOverview>("/admin/overview")) ?? {
      users: [],
      totals: { users: 0, onboarded: 0, completedModules: 0, totalTimeMs: 0 },
    }
  );
}

export type AdminModuleRow = {
  module_id: string;
  status: string;
  quiz_correct: number;
  quiz_total: number;
  score_pct: number;
  reflection: string | null;
  completed_at: string | null;
  updated_at: string;
};

export type AdminUserDetail = {
  modules: AdminModuleRow[];
  attempts: (QuestionAttempt & { module_id: string; answered_at: string })[];
  assessment: { question_idx: number; value: number | null }[];
  onboarding: { question_idx: number; answer_idx: number | null }[];
  daily: DailyPoint[];
  timeByModule: ModuleTime[];
  skips: { moduleId: string | null; screenIdx: number | null; kind: string | null; at: string }[];
  totalTimeMs: number;
};

const EMPTY_DETAIL: AdminUserDetail = {
  modules: [],
  attempts: [],
  assessment: [],
  onboarding: [],
  daily: [],
  timeByModule: [],
  skips: [],
  totalTimeMs: 0,
};

export async function fetchAdminUserDetail(userId: string): Promise<AdminUserDetail> {
  return (await apiGet<AdminUserDetail>(`/admin/users/${encodeURIComponent(userId)}`)) ?? EMPTY_DETAIL;
}

// ---------- Google Analytics aggregate ----------
export type GaSummary =
  | { configured: false }
  | {
      configured: true;
      range: string;
      activeUsers: number;
      newUsers: number;
      sessions: number;
      avgEngagementSec: number;
      topEvents: { name: string; count: number }[];
      daily: { date: string; activeUsers: number }[];
    };

export async function fetchGaSummary(scope: "user" | "admin"): Promise<GaSummary> {
  return (await apiGet<GaSummary>(`/analytics/ga?scope=${scope}`)) ?? { configured: false };
}
