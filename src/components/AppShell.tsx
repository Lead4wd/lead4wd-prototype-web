"use client";

import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SKILL_ORDER, type Content, type LanguageCode } from "@/data/content";
import type { ManagerModule } from "@/data/modules";
import type { View } from "@/lib/progress";
import { VIEW_PATH, viewFromPathname } from "@/lib/routes";
import { fmt } from "@/lib/format";
import { Chevron, Check, Search, Menu } from "@/components/icons";
import AccountSettings from "@/components/AccountSettings";
import CookieConsent from "@/components/CookieConsent";
import { useApp } from "@/app/providers";

type NavSection = {
  group: "coaching" | "insight";
  items: { view: View; key: keyof Content["nav"]; icon: React.ReactNode }[];
};

const NAV: NavSection[] = [
  {
    group: "coaching",
    items: [
      {
        view: "dashboard",
        key: "home",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9v11h14V9" />
          </svg>
        ),
      },
      {
        view: "journey",
        key: "journey",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3" />
          </svg>
        ),
      },
      {
        view: "lesson",
        key: "lesson",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 5a2 2 0 0 1 2-2h11v18H6a2 2 0 0 1-2-2z" />
            <path d="M9 7h5M9 11h5" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "insight",
    items: [
      {
        view: "results",
        key: "results",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 3v18h18" />
            <path d="M7 14l4-4 3 3 5-6" />
          </svg>
        ),
      },
      {
        view: "team",
        key: "team",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3.5 20c0-3.4 2.6-5.2 5.5-5.2s5.5 1.8 5.5 5.2" />
            <path d="M16 5.2a3.2 3.2 0 0 1 0 6" />
            <path d="M19.5 20c0-2.6-1.2-4.2-3.2-4.9" />
          </svg>
        ),
      },
      {
        view: "assessment",
        key: "assessment",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        ),
      },
      {
        view: "analytics",
        key: "analytics",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 19V5" />
            <path d="M4 15l4-4 3 3 5-7 4 5" />
          </svg>
        ),
      },
      {
        view: "coach",
        key: "coach",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 15a3 3 0 0 1-3 3H9l-4 3v-3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" />
            <path d="M9 10h6M9 13h4" />
          </svg>
        ),
      },
      {
        view: "practice",
        key: "practice",
        // Two speech bubbles facing each other — a rehearsal, not a monologue.
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7l-4 3z" />
            <path d="M17 10h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v3l-3-3h-2" />
          </svg>
        ),
      },
    ],
  },
];

const ADMIN_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" />
    <path d="M19 4l1 1.6L21.8 6l-1.3 1.2.3 1.8-1.8-.9-1.8.9.3-1.8L16.2 6l1.8-.4z" />
  </svg>
);

// Build the searchable index (pages + skills + every module) for a language.
function searchIndex(c: Content, modules: ManagerModule[]): { label: string; href: string; tag: string }[] {
  const pages = [
    { label: c.nav.home, href: VIEW_PATH.dashboard, tag: c.nav.coaching },
    { label: c.nav.journey, href: VIEW_PATH.journey, tag: c.nav.coaching },
    { label: c.nav.lesson, href: VIEW_PATH.lesson, tag: c.nav.coaching },
    { label: c.nav.results, href: VIEW_PATH.results, tag: c.nav.insight },
    { label: c.nav.team, href: VIEW_PATH.team, tag: c.nav.insight },
    { label: c.nav.assessment, href: VIEW_PATH.assessment, tag: c.nav.insight },
    { label: c.nav.analytics, href: VIEW_PATH.analytics, tag: c.nav.insight },
    { label: c.nav.coach, href: VIEW_PATH.coach, tag: c.nav.insight },
    { label: c.nav.practice, href: VIEW_PATH.practice, tag: c.nav.insight },
  ];
  const skills = SKILL_ORDER.map((id) => ({
    label: c.skillNames[id],
    href: VIEW_PATH.results,
    tag: c.nav.results,
  }));
  // Modules are searchable by name and now open directly, rather than dropping
  // the user on the journey to find the one they just typed.
  const mods = modules.map((m) => ({ label: m.title, href: `/lesson/${m.id}`, tag: m.cluster }));
  return [...pages, ...skills, ...mods];
}

/**
 * The signed-in chrome: sidebar, topbar, account modal. The routed view renders
 * as `children`.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { c, language, languages, changeLanguage, progress, profile, modules, recoveryMode, profileUpdated } = useApp();
  const pathname = usePathname();
  const view = viewFromPathname(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(recoveryMode);

  // Password-recovery links land mid-session — surface the settings modal so
  // the user can set a new password.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (recoveryMode) setAccountOpen(true);
  }, [recoveryMode]);

  // Close the mobile sidebar and any popover once a navigation lands.
  useEffect(() => {
    setSidebarOpen(false);
    setLangOpen(false);
    setSearchOpen(false);
    setSearch("");
  }, [pathname]);

  // Close popovers on any outside click.
  useEffect(() => {
    if (!langOpen && !searchOpen) return;
    const close = () => {
      setLangOpen(false);
      setSearchOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [langOpen, searchOpen]);

  if (!profile) return null;

  const displayName = profile.display_name?.trim() || c.profile.name;

  const query = search.trim().toLowerCase();
  const results = query
    ? searchIndex(c, modules)
        .filter((r) => r.label.toLowerCase().includes(query))
        .slice(0, 8)
    : [];

  return (
    <>
      <div className={`scrim ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

      <div className="app">
        {/* ---------------- Sidebar ---------------- */}
        <aside className={`side ${sidebarOpen ? "open" : ""}`}>
          <div className="brand">
            <span className="arr">→</span>Lead4wd
          </div>

          {NAV.map((section) => (
            <Fragment key={section.group}>
              <div className="navlbl">{c.nav[section.group]}</div>
              {section.items.map((item) => (
                <Link
                  key={item.view}
                  href={VIEW_PATH[item.view]}
                  className={`navlink ${view === item.view ? "on" : ""}`}
                  aria-current={view === item.view ? "page" : undefined}
                >
                  {item.icon}
                  {c.nav[item.key]}
                </Link>
              ))}
            </Fragment>
          ))}

          {profile.is_admin && (
            <Fragment>
              <div className="navlbl">{c.nav.admin}</div>
              <Link
                href={VIEW_PATH.admin}
                className={`navlink ${view === "admin" ? "on" : ""}`}
                aria-current={view === "admin" ? "page" : undefined}
              >
                {ADMIN_ICON}
                {c.nav.adminPanel}
              </Link>
            </Fragment>
          )}

          <div className="spacer" />
          <button className="profile" onClick={() => setAccountOpen(true)} aria-label={c.account.title}>
            <div className="pf">{displayName.charAt(0).toUpperCase()}</div>
            <div>
              <div className="pn">{displayName}</div>
              <div className="pp">{profile.role}</div>
            </div>
          </button>
        </aside>

        {/* ---------------- Main ---------------- */}
        <div className="main">
          <header className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="menu-toggle" aria-label="Menu" onClick={() => setSidebarOpen((s) => !s)}>
                <Menu />
              </button>
              <div className="pagetitle">{c.pageTitles[view]}</div>
            </div>

            <div className="tools">
              {/* search */}
              <div className="searchwrap" onClick={(e) => e.stopPropagation()}>
                <div className="search">
                  <Search />
                  <input
                    value={search}
                    placeholder={c.topbar.search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                  />
                </div>
                {searchOpen && query && (
                  <div className="searchmenu">
                    {results.length > 0 ? (
                      results.map((r, i) => (
                        <Link key={i} href={r.href}>
                          <span>{r.label}</span>
                          <span className="stype">{r.tag}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="empty">—</div>
                    )}
                  </div>
                )}
              </div>

              <div className="streakpill">🔥 {fmt(c.topbar.streakLabel, { n: progress.streak })}</div>

              {/* language */}
              <div className="langwrap" onClick={(e) => e.stopPropagation()}>
                <button className="langsel" onClick={() => setLangOpen((o) => !o)}>
                  {language.toUpperCase()}
                  <Chevron />
                </button>
                {langOpen && (
                  <div className="langmenu">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        className={language === l.code ? "on" : ""}
                        onClick={() => {
                          changeLanguage(l.code as LanguageCode);
                          setLangOpen(false);
                        }}
                      >
                        {l.label}
                        {language === l.code && <Check />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="content">{children}</div>
        </div>
      </div>

      {accountOpen && (
        <AccountSettings
          c={c}
          profile={profile}
          languages={languages}
          onClose={() => setAccountOpen(false)}
          onUpdated={profileUpdated}
        />
      )}

      <CookieConsent c={c} />
    </>
  );
}
