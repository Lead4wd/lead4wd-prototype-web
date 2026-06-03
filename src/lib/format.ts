import type { SkillLevel } from "@/data/content";

/** Fill `{key}` placeholders in a localised template string. */
export const fmt = (tpl: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), tpl);

/** Level → badge class suffix (`lv-str` / `lvt-str`, etc.). */
export const levelKey = (l: SkillLevel) =>
  l === "strength" ? "str" : l === "developing" ? "dev" : "focus";

/** Level → progress-bar fill class. Focus areas use the default primary fill. */
export const barClass = (l: SkillLevel) =>
  l === "strength" ? "good" : l === "developing" ? "acc" : "";
