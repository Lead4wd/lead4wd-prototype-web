// Direct content loader (run by a maintainer, not the app).
// Uses the SERVICE-ROLE key + the PostgREST endpoint to upsert content past RLS.
// The key is read from .env.local (gitignored) and never leaves your machine.
//
//   npx tsx scripts/seed.ts
//
// Loads: modules (English) + locked clusters + assessment/onboarding questions
// (questions are trilingual EN/HI/TE; module lesson text is English for now).
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { MODULES, LOCKED_CLUSTERS } from "../src/data/modules";
import { CONTENT } from "../src/data/content";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing env. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Settings → API → service_role key)."
  );
  process.exit(1);
}

const base = `${url}/rest/v1`;
const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

async function upsert(table: string, rows: unknown[], onConflict?: string) {
  const qs = onConflict ? `?on_conflict=${onConflict}` : "";
  const res = await fetch(`${base}/${table}${qs}`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows),
  });
  console.log(`${table}:`, res.ok ? `OK ${rows.length}` : `ERR ${res.status} ${await res.text()}`);
}

async function clear(table: string) {
  await fetch(`${base}/${table}?id=neq.-1`, {
    method: "DELETE",
    headers: { ...headers, Prefer: "return=minimal" },
  });
}

async function main() {
  await upsert(
    "modules",
    MODULES.map((m, i) => ({
      id: m.id,
      skill: m.skill,
      cluster: m.cluster,
      title: m.title,
      summary: m.summary,
      minutes: m.minutes,
      sort_order: i + 1,
      screens: m.screens,
    })),
    "id"
  );

  await clear("locked_clusters");
  await upsert(
    "locked_clusters",
    LOCKED_CLUSTERS.map((name, i) => ({ name, sort_order: i + 1 }))
  );

  await upsert(
    "assessment_questions",
    CONTENT.en.assessment.questions.map((q, i) => ({
      idx: i,
      skill: q.skill,
      text_i18n: {
        en: q.text,
        hi: CONTENT.hi.assessment.questions[i].text,
        te: CONTENT.te.assessment.questions[i].text,
      },
    })),
    "idx"
  );

  await upsert(
    "onboarding_questions",
    CONTENT.en.onboarding.questions.map((q, i) => ({
      idx: i,
      text_i18n: {
        en: q.text,
        hi: CONTENT.hi.onboarding.questions[i].text,
        te: CONTENT.te.onboarding.questions[i].text,
      },
      options_i18n: {
        en: q.options,
        hi: CONTENT.hi.onboarding.questions[i].options,
        te: CONTENT.te.onboarding.questions[i].options,
      },
    })),
    "idx"
  );

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
