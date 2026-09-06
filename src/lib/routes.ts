// The one place a View and a URL are tied together.
// ---------------------------------------------------------------------------
// Views used to be a value in React state, so "where am I" and "what does the
// URL say" could not disagree — there was only one of them. Now that each view
// is a real route they can, so the mapping lives here rather than being spelled
// out at each call site.
import type { View } from "@/lib/progress";

export const VIEW_PATH: Record<View, string> = {
  dashboard: "/dashboard",
  journey: "/journey",
  lesson: "/lesson",
  results: "/results",
  team: "/team",
  assessment: "/assessment",
  analytics: "/analytics",
  coach: "/coach",
  practice: "/practice",
  admin: "/admin",
};

/** `/lesson` follows the journey; `/lesson/m8` opens one module by name. */
export const lessonPath = (moduleId?: string): string =>
  moduleId ? `/lesson/${encodeURIComponent(moduleId)}` : "/lesson";

const PATH_VIEW = Object.entries(VIEW_PATH).map(([view, path]) => [path, view as View] as const);

/**
 * Which view a URL is showing. Matches on the first segment so that
 * `/lesson/m8` still counts as the lesson view for the page title and the
 * highlighted nav item.
 */
export function viewFromPathname(pathname: string): View {
  const first = "/" + (pathname.split("/")[1] ?? "");
  return PATH_VIEW.find(([path]) => path === first)?.[1] ?? "dashboard";
}
