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

// ---------- content ----------
export async function fetchModules(): Promise<ManagerModule[]> {
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.from("modules").select("*").order("sort_order");
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
  const { data } = await sb.from("locked_clusters").select("name").order("sort_order");
  return (data ?? []).map((r) => r.name);
}

export type AssessmentQuestion = { idx: number; skill: SkillId; text: string };
export async function fetchAssessmentQuestions(lang: string): Promise<AssessmentQuestion[]> {
  const sb = getSupabaseBrowserClient();
  const { data } = await sb.from("assessment_questions").select("*").order("idx");
  return (data ?? []).map((r) => {
    const t = r.text_i18n as Record<string, string>;
    return { idx: r.idx, skill: r.skill as SkillId, text: t[lang] ?? t.en };
  });
}

export type OnboardingQuestion = { idx: number; text: string; options: string[] };
export async function fetchOnboardingQuestions(lang: string): Promise<OnboardingQuestion[]> {
  const sb = getSupabaseBrowserClient();
  const { data } = await sb.from("onboarding_questions").select("*").order("idx");
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
  role: string;
  language: string;
  streak: number;
  onboarded: boolean;
};

export async function loadProfile(userId: string): Promise<ProfileRow | null> {
  const sb = getSupabaseBrowserClient();
  const { data } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data
    ? {
        id: data.id,
        display_name: data.display_name,
        role: data.role,
        language: data.language,
        streak: data.streak,
        onboarded: data.onboarded,
      }
    : null;
}

export async function updateProfile(
  userId: string,
  patch: Partial<Pick<ProfileRow, "display_name" | "role" | "language" | "onboarded" | "streak">>
): Promise<void> {
  const sb = getSupabaseBrowserClient();
  await sb.from("profiles").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", userId);
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
  await sb.from("onboarding_answers").upsert(rows, { onConflict: "user_id,question_idx" });
}

export async function saveAssessmentAnswers(userId: string, answers: (number | null)[]): Promise<void> {
  const sb = getSupabaseBrowserClient();
  const rows = answers.map((value, question_idx) => ({ user_id: userId, question_idx, value }));
  await sb.from("assessment_answers").upsert(rows, { onConflict: "user_id,question_idx" });
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
  await sb.from("module_progress").upsert(
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

  if (data.attempts.length) {
    // Replace prior attempts for this module so retakes overwrite cleanly.
    await sb.from("question_attempts").delete().eq("user_id", userId).eq("module_id", moduleId);
    await sb.from("question_attempts").insert(
      data.attempts.map((a) => ({ ...a, user_id: userId, module_id: moduleId }))
    );
  }

  if (!data.alreadyCompleted) {
    await updateProfile(userId, { streak: data.newStreak });
  }
}
