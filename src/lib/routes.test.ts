import { describe, expect, it } from "vitest";
import { VIEW_PATH, lessonPath, viewFromPathname } from "@/lib/routes";
import type { View } from "@/lib/progress";

const VIEWS = Object.keys(VIEW_PATH) as View[];

describe("routes", () => {
  it("gives every view a distinct path", () => {
    const paths = Object.values(VIEW_PATH);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("round-trips every view through its own path", () => {
    for (const view of VIEWS) {
      expect(viewFromPathname(VIEW_PATH[view])).toBe(view);
    }
  });

  it("treats a module URL as the lesson view", () => {
    // This is what keeps the page title and the highlighted nav item right
    // while a specific lesson is open.
    expect(viewFromPathname("/lesson/m8")).toBe("lesson");
    expect(viewFromPathname(lessonPath("m14"))).toBe("lesson");
  });

  it("falls back to the dashboard for anything unrecognised", () => {
    expect(viewFromPathname("/")).toBe("dashboard");
    expect(viewFromPathname("/nonsense")).toBe("dashboard");
  });

  it("builds lesson paths, escaping the id", () => {
    expect(lessonPath()).toBe("/lesson");
    expect(lessonPath("m8")).toBe("/lesson/m8");
    expect(lessonPath("a b")).toBe("/lesson/a%20b");
  });
});
