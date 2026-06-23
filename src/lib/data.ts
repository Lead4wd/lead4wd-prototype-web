// ============================================================================
// Lead4wd — Supabase data access (content + per-user state)
// ----------------------------------------------------------------------------
// Content (modules, clusters, questions) is fetched from the DB; per-user state
// (profile, answers, module progress, question attempts) is read/written here.
// The pure derivations stay in progress.ts.
// ============================================================================
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { DEFAULT_SCORES, SKILL_ORDER, type SkillId } from "@/data/content";
import type { ManagerModule, Screen } from "@/data/modules";
import type { Progress } from "@/lib/progress";

// Surface failed reads/writes in the console — supabase-js returns errors
// instead of throwing, so without this they vanish silently.
function logErr(op: string, error: { message: string } | null) {
  if (error) console.error(`[lead4wd] ${op}: ${error.message}`);
}

// ---------- content ----------
export async function fetchModules(): Promise<ManagerModule[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.from("modules").select("*").order("sort_order");
  logErr("fetchModules", error);
  if (error || !data) return [];
  return data.map((r) => ({
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
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.from("locked_clusters").select("name").order("sort_order");
  logErr("fetchLockedClusters", error);
  return (data ?? []).map((r) => r.name);
}

export type AssessmentQuestion = { idx: number; skill: SkillId; text: string };
export async function fetchAssessmentQuestions(lang: string): Promise<AssessmentQuestion[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.from("assessment_questions").select("*").order("idx");
  logErr("fetchAssessmentQuestions", error);
  return (data ?? []).map((r) => {
    const t = r.text_i18n as Record<string, string>;
    return { idx: r.idx, skill: r.skill as SkillId, text: t[lang] ?? t.en };
  });
}

export type OnboardingQuestion = { idx: number; text: string; options: string[] };
export async function fetchOnboardingQuestions(lang: string): Promise<OnboardingQuestion[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.from("onboarding_questions").select("*").order("idx");
  logErr("fetchOnboardingQuestions", error);
  return (data ?? []).map((r) => {
    const t = r.text_i18n as Record<string, string>;
    const o = r.options_i18n as Record<string, string[]>;
    return { idx: r.idx, text: t[lang] ?? t.en, options: o[lang] ?? o.en };
  });
}

// ---------- scoring (derive skill scores from raw answers) ----------
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

export async function loadProfile(userId: string): Promise<ProfileRow | null> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  logErr("loadProfile", error);
  return data
    ? {
        id: data.id,
        display_name: data.display_name,
        email: data.email,
        role: data.role,
        language: data.language,
        streak: data.streak,
        onboarded: data.onboarded,
        is_admin: data.is_admin,
      }
    : null;
}

export async function updateProfile(
  userId: string,
  patch: Partial<Pick<ProfileRow, "display_name" | "role" | "language" | "onboarded" | "streak">>
): Promise<void> {
  const sb = getSupabaseBrowserClient();
  // Upsert, not update: if the signup trigger ever failed to create the row,
  // a plain update would silently affect 0 rows (e.g. onboarded never sticks).
  const { error } = await sb
    .from("profiles")
    .upsert({ id: userId, ...patch, updated_at: new Date().toISOString() }, { onConflict: "id" });
  logErr("updateProfile", error);
}

// ---------- per-user progress ----------
/** Load the user's full Progress object (mirrors the legacy localStorage shape). */
export async function loadUserState(userId: string): Promise<Progress> {
  const sb = getSupabaseBrowserClient();
  const [profileR, modR, ansR, qR] = await Promise.all([
    sb.from("profiles").select("streak").eq("id", userId).maybeSingle(),
    sb.from("module_progress").select("*").eq("user_id", userId),
    sb.from("assessment_answers").select("question_idx, value").eq("user_id", userId),
    sb.from("assessment_questions").select("idx, skill"),
  ]);

  logErr("loadUserState/profile", profileR.error);
  logErr("loadUserState/module_progress", modR.error);
  logErr("loadUserState/assessment_answers", ansR.error);

  const mods = modR.data ?? [];
  const completedModules = mods.filter((m) => m.status === "completed").map((m) => m.module_id);
  const actionsTried = mods.filter((m) => (m.reflection ?? "").trim().length > 0).map((m) => m.module_id);
  const reflections: Record<string, string> = {};
  mods.forEach((m) => {
    if (m.reflection) reflections[m.module_id] = m.reflection;
  });

  const questions = (qR.data ?? []).map((q) => ({ idx: q.idx, skill: q.skill as SkillId }));
  const scores = computeScores(ansR.data ?? [], questions);

  return {
    completedModules,
    actionsTried,
    reflections,
    streak: profileR.data?.streak ?? 0,
    scores,
  };
}

export async function saveOnboardingAnswers(userId: string, answers: (number | null)[]): Promise<void> {
  const sb = getSupabaseBrowserClient();
  const rows = answers.map((answer_idx, question_idx) => ({ user_id: userId, question_idx, answer_idx }));
  const { error } = await sb.from("onboarding_answers").upsert(rows, { onConflict: "user_id,question_idx" });
  logErr("saveOnboardingAnswers", error);
}

export async function saveAssessmentAnswers(userId: string, answers: (number | null)[]): Promise<void> {
  const sb = getSupabaseBrowserClient();
  const rows = answers.map((value, question_idx) => ({ user_id: userId, question_idx, value }));
  const { error } = await sb.from("assessment_answers").upsert(rows, { onConflict: "user_id,question_idx" });
  logErr("saveAssessmentAnswers", error);
}

export type QuestionAttempt = {
  screen_idx: number;
  kind: string;
  prompt: string | null;
  response: string | null;
  is_correct: boolean | null;
};

/** Persist a completed module: aggregate progress + per-question attempts + streak bump. */
export async function saveModuleCompletion(
  userId: string,
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
  const sb = getSupabaseBrowserClient();
  const { error: progressErr } = await sb.from("module_progress").upsert(
    {
      user_id: userId,
      module_id: moduleId,
      status: "completed",
      quiz_correct: data.quizCorrect,
      quiz_total: data.quizTotal,
      score_pct: data.scorePct,
      reflection: data.reflection.trim() || null,
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_id" }
  );
  logErr("saveModuleCompletion/module_progress", progressErr);

  if (data.attempts.length) {
    // Replace prior attempts for this module so retakes overwrite cleanly.
    const { error: delErr } = await sb.from("question_attempts").delete().eq("user_id", userId).eq("module_id", moduleId);
    logErr("saveModuleCompletion/clear_attempts", delErr);
    const { error: insErr } = await sb.from("question_attempts").insert(
      data.attempts.map((a) => ({ ...a, user_id: userId, module_id: moduleId }))
    );
    logErr("saveModuleCompletion/insert_attempts", insErr);
  }

  if (!data.alreadyCompleted) {
    await updateProfile(userId, { streak: data.newStreak });
  }
}

// ============================================================================
// Engagement tracking (time-on-screen + skips) — feeds the analytics views.
// ============================================================================
export type EngagementKind = "screen_view" | "screen_skip" | "module_start" | "module_complete";

/** Log one engagement event. Fire-and-forget from callers; errors are logged. */
export async function track(
  userId: string,
  ev: {
    kind: EngagementKind;
    moduleId?: string | null;
    screenIdx?: number | null;
    durationMs?: number | null;
    meta?: Record<string, unknown> | null;
  }
): Promise<void> {
  const sb = getSupabaseBrowserClient();
  const { error } = await sb.from("engagement_events").insert({
    user_id: userId,
    kind: ev.kind,
    module_id: ev.moduleId ?? null,
    screen_idx: ev.screenIdx ?? null,
    duration_ms:
      ev.durationMs != null ? Math.min(Math.max(Math.round(ev.durationMs), 0), 86_400_000) : null,
    meta: (ev.meta ?? null) as never,
  });
  logErr("track", error);
}

// ---------- shared aggregation (pure) ----------
type RawEvent = {
  kind: string;
  module_id: string | null;
  screen_idx: number | null;
  duration_ms: number | null;
  created_at: string;
};

export type DailyPoint = { date: string; ms: number; events: number };
export type ModuleTime = { moduleId: string; ms: number };

function aggregateDaily(events: RawEvent[]): DailyPoint[] {
  const byDay = new Map<string, { ms: number; events: number }>();
  for (const e of events) {
    const date = e.created_at.slice(0, 10);
    const cur = byDay.get(date) ?? { ms: 0, events: 0 };
    cur.ms += e.duration_ms ?? 0;
    cur.events += 1;
    byDay.set(date, cur);
  }
  return [...byDay.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function aggregateByModule(events: RawEvent[]): ModuleTime[] {
  const byMod = new Map<string, number>();
  for (const e of events) {
    if (!e.module_id || !e.duration_ms) continue;
    byMod.set(e.module_id, (byMod.get(e.module_id) ?? 0) + e.duration_ms);
  }
  return [...byMod.entries()]
    .map(([moduleId, ms]) => ({ moduleId, ms }))
    .sort((a, b) => b.ms - a.ms);
}

const sumMs = (events: RawEvent[]) => events.reduce((a, e) => a + (e.duration_ms ?? 0), 0);

// ============================================================================
// User-facing analytics — the signed-in user's own stats (RLS: owner rows).
// ============================================================================
export type UserAnalytics = {
  totalTimeMs: number;
  activeDays: number;
  completed: number;
  started: number;
  skips: number;
  daily: DailyPoint[];
  timeByModule: ModuleTime[];
};

export async function loadUserAnalytics(userId: string): Promise<UserAnalytics> {
  const sb = getSupabaseBrowserClient();
  const [evR, modR] = await Promise.all([
    sb
      .from("engagement_events")
      .select("kind, module_id, screen_idx, duration_ms, created_at")
      .eq("user_id", userId),
    sb.from("module_progress").select("status").eq("user_id", userId),
  ]);
  logErr("loadUserAnalytics/events", evR.error);
  logErr("loadUserAnalytics/modules", modR.error);

  const events = (evR.data ?? []) as RawEvent[];
  const daily = aggregateDaily(events);
  const mods = modR.data ?? [];
  return {
    totalTimeMs: sumMs(events),
    activeDays: daily.length,
    completed: mods.filter((m) => m.status === "completed").length,
    started: mods.length,
    skips: events.filter((e) => e.kind === "screen_skip").length,
    daily,
    timeByModule: aggregateByModule(events),
  };
}

// ============================================================================
// Admin analytics — all users (RLS: private.is_admin() grants read on all rows).
// ============================================================================
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
  const sb = getSupabaseBrowserClient();
  const [profR, modR, evR] = await Promise.all([
    sb.from("profiles").select("id, display_name, email, is_admin, streak, onboarded, created_at"),
    sb.from("module_progress").select("user_id, status, updated_at"),
    sb.from("engagement_events").select("user_id, kind, duration_ms, created_at"),
  ]);
  logErr("fetchAdminOverview/profiles", profR.error);
  logErr("fetchAdminOverview/modules", modR.error);
  logErr("fetchAdminOverview/events", evR.error);

  const mods = modR.data ?? [];
  const evs = evR.data ?? [];

  const users: AdminUserSummary[] = (profR.data ?? []).map((p) => {
    const myMods = mods.filter((m) => m.user_id === p.id);
    const myEvs = evs.filter((e) => e.user_id === p.id);
    const lastEv = myEvs.reduce<string | null>((max, e) => (!max || e.created_at > max ? e.created_at : max), null);
    const lastMod = myMods.reduce<string | null>((max, m) => (!max || m.updated_at > max ? m.updated_at : max), null);
    const lastActive = [lastEv, lastMod].filter(Boolean).sort().pop() ?? null;
    return {
      id: p.id,
      displayName: p.display_name,
      email: p.email,
      isAdmin: p.is_admin,
      streak: p.streak,
      onboarded: p.onboarded,
      completed: myMods.filter((m) => m.status === "completed").length,
      started: myMods.length,
      skips: myEvs.filter((e) => e.kind === "screen_skip").length,
      totalTimeMs: myEvs.reduce((a, e) => a + (e.duration_ms ?? 0), 0),
      lastActive,
    };
  });
  // Most recently active first.
  users.sort((a, b) => (b.lastActive ?? "").localeCompare(a.lastActive ?? ""));

  return {
    users,
    totals: {
      users: users.length,
      onboarded: users.filter((u) => u.onboarded).length,
      completedModules: users.reduce((a, u) => a + u.completed, 0),
      totalTimeMs: users.reduce((a, u) => a + u.totalTimeMs, 0),
    },
  };
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

export async function fetchAdminUserDetail(userId: string): Promise<AdminUserDetail> {
  const sb = getSupabaseBrowserClient();
  const [modR, atR, asR, obR, evR] = await Promise.all([
    sb.from("module_progress").select("*").eq("user_id", userId),
    sb.from("question_attempts").select("*").eq("user_id", userId).order("answered_at"),
    sb.from("assessment_answers").select("question_idx, value").eq("user_id", userId).order("question_idx"),
    sb.from("onboarding_answers").select("question_idx, answer_idx").eq("user_id", userId).order("question_idx"),
    sb
      .from("engagement_events")
      .select("kind, module_id, screen_idx, duration_ms, created_at, meta")
      .eq("user_id", userId)
      .order("created_at"),
  ]);
  logErr("fetchAdminUserDetail/modules", modR.error);
  logErr("fetchAdminUserDetail/attempts", atR.error);
  logErr("fetchAdminUserDetail/assessment", asR.error);
  logErr("fetchAdminUserDetail/onboarding", obR.error);
  logErr("fetchAdminUserDetail/events", evR.error);

  const events = (evR.data ?? []) as (RawEvent & { meta: { kind?: string } | null })[];
  return {
    modules: (modR.data ?? []) as AdminModuleRow[],
    attempts: (atR.data ?? []).map((a) => ({
      screen_idx: a.screen_idx,
      kind: a.kind,
      prompt: a.prompt,
      response: a.response,
      is_correct: a.is_correct,
      module_id: a.module_id,
      answered_at: a.answered_at,
    })),
    assessment: asR.data ?? [],
    onboarding: obR.data ?? [],
    daily: aggregateDaily(events),
    timeByModule: aggregateByModule(events),
    skips: events
      .filter((e) => e.kind === "screen_skip")
      .map((e) => ({ moduleId: e.module_id, screenIdx: e.screen_idx, kind: e.meta?.kind ?? null, at: e.created_at })),
    totalTimeMs: sumMs(events),
  };
}

// ============================================================================
// Google Analytics aggregate (served by /api/ga/summary; server holds the key).
// ============================================================================
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
  try {
    const res = await fetch(`/api/ga/summary?scope=${scope}`, { credentials: "same-origin" });
    if (!res.ok) return { configured: false };
    return (await res.json()) as GaSummary;
  } catch {
    return { configured: false };
  }
}
