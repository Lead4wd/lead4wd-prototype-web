// Seed generator: emits the SQL that loads the static content (modules, locked
// clusters, assessment + onboarding questions) into Supabase. The app reads this
// content from the DB at runtime; src/data keeps the data only as the seed source.
//
//   npx tsx scripts/dump-content.ts > supabase/seed.sql
//
// Then run supabase/seed.sql once in the Supabase SQL Editor (privileged, RLS-safe).
import { MODULES, LOCKED_CLUSTERS } from "../src/data/modules";
import { CONTENT } from "../src/data/content";

const Q = "$L4W$"; // dollar-quote tag (content never contains this)
const dq = (s: string) => Q + s + Q;
const jb = (v: unknown) => Q + JSON.stringify(v) + Q + "::jsonb";

const out: string[] = [];

MODULES.forEach((m, i) => {
  out.push(
    `insert into public.modules (id, skill, cluster, title, summary, minutes, sort_order, screens) values (` +
      `${dq(m.id)}, ${dq(m.skill)}, ${dq(m.cluster)}, ${dq(m.title)}, ${dq(m.summary)}, ${m.minutes}, ${i + 1}, ${jb(m.screens)}) ` +
      `on conflict (id) do update set skill=excluded.skill, cluster=excluded.cluster, title=excluded.title, ` +
      `summary=excluded.summary, minutes=excluded.minutes, sort_order=excluded.sort_order, screens=excluded.screens;`
  );
});

LOCKED_CLUSTERS.forEach((name, i) => {
  out.push(`insert into public.locked_clusters (name, sort_order) values (${dq(name)}, ${i + 1});`);
});

CONTENT.en.assessment.questions.forEach((q, i) => {
  const text_i18n = {
    en: q.text,
    hi: CONTENT.hi.assessment.questions[i].text,
    te: CONTENT.te.assessment.questions[i].text,
  };
  out.push(
    `insert into public.assessment_questions (idx, skill, text_i18n) values (${i}, ${dq(q.skill)}, ${jb(text_i18n)}) ` +
      `on conflict (idx) do update set skill=excluded.skill, text_i18n=excluded.text_i18n;`
  );
});

CONTENT.en.onboarding.questions.forEach((q, i) => {
  const text_i18n = {
    en: q.text,
    hi: CONTENT.hi.onboarding.questions[i].text,
    te: CONTENT.te.onboarding.questions[i].text,
  };
  const options_i18n = {
    en: q.options,
    hi: CONTENT.hi.onboarding.questions[i].options,
    te: CONTENT.te.onboarding.questions[i].options,
  };
  out.push(
    `insert into public.onboarding_questions (idx, text_i18n, options_i18n) values (${i}, ${jb(text_i18n)}, ${jb(options_i18n)}) ` +
      `on conflict (idx) do update set text_i18n=excluded.text_i18n, options_i18n=excluded.options_i18n;`
  );
});

process.stdout.write(out.join("\n") + "\n");
