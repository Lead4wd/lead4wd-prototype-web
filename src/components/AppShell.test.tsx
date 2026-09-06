import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CONTENT } from "@/data/content";
import { emptyProgress } from "@/lib/progress";
import type { ProfileRow } from "@/lib/data";

// The shell reads the current route to decide what is highlighted, so the
// pathname is the input under test.
let pathname = "/dashboard";
vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

const profile: ProfileRow = {
  id: "u1",
  display_name: "Asha",
  email: "asha@example.com",
  role: "Team lead",
  language: "en",
  streak: 3,
  onboarded: true,
  is_admin: false,
};

let app = {
  c: CONTENT.en,
  language: "en" as const,
  languages: [{ code: "en" as const, label: "English" }],
  changeLanguage: vi.fn(),
  progress: emptyProgress(),
  profile,
  modules: [
    { id: "m8", skill: "delegation", cluster: "Foundations", title: "Delegation", summary: "s", minutes: 4, screens: [] },
  ],
  recoveryMode: false,
  profileUpdated: vi.fn(),
};

vi.mock("@/app/providers", () => ({ useApp: () => app }));

// Imported after the mocks so the component picks them up.
const { default: AppShell } = await import("@/components/AppShell");

const nav = (label: string) => screen.getByRole("link", { name: label });

describe("AppShell", () => {
  beforeEach(() => {
    pathname = "/dashboard";
    app = { ...app, profile };
  });

  it("renders the nav as real links, not click handlers", () => {
    render(<AppShell>content</AppShell>);
    // The whole point of the routing work: these are anchors with hrefs, so
    // they can be opened in a new tab, and the browser Back button works.
    expect(nav(CONTENT.en.nav.home)).toHaveAttribute("href", "/dashboard");
    expect(nav(CONTENT.en.nav.journey)).toHaveAttribute("href", "/journey");
    expect(nav(CONTENT.en.nav.coach)).toHaveAttribute("href", "/coach");
    expect(nav(CONTENT.en.nav.practice)).toHaveAttribute("href", "/practice");
  });

  it("marks the current route as the active page", () => {
    pathname = "/practice";
    render(<AppShell>content</AppShell>);
    expect(nav(CONTENT.en.nav.practice)).toHaveAttribute("aria-current", "page");
    expect(nav(CONTENT.en.nav.home)).not.toHaveAttribute("aria-current");
  });

  it("keeps the lesson tab active while a specific module is open", () => {
    pathname = "/lesson/m8";
    render(<AppShell>content</AppShell>);
    expect(nav(CONTENT.en.nav.lesson)).toHaveAttribute("aria-current", "page");
    expect(screen.getByText(CONTENT.en.pageTitles.lesson)).toBeInTheDocument();
  });

  it("titles the page from the route", () => {
    pathname = "/coach";
    render(<AppShell>content</AppShell>);
    expect(screen.getByText(CONTENT.en.pageTitles.coach)).toBeInTheDocument();
  });

  it("renders the routed view as its children", () => {
    render(
      <AppShell>
        <p>the view</p>
      </AppShell>
    );
    expect(screen.getByText("the view")).toBeInTheDocument();
  });

  it("hides the admin link from non-admins", () => {
    render(<AppShell>content</AppShell>);
    expect(screen.queryByRole("link", { name: CONTENT.en.nav.adminPanel })).toBeNull();
  });

  it("shows the admin link to admins", () => {
    app = { ...app, profile: { ...profile, is_admin: true } };
    render(<AppShell>content</AppShell>);
    expect(nav(CONTENT.en.nav.adminPanel)).toHaveAttribute("href", "/admin");
  });
});
