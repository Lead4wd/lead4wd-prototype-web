import { Fragment, useEffect, useState } from "react";
import type { Content, LanguageCode, SkillId } from "@/data/content";
import { computeStreak, type Progress, type View } from "@/lib/progress";
import { fmt } from "@/lib/format";
import { Chevron, Check, Search, Menu } from "@/components/icons";
import Dashboard from "@/components/views/Dashboard";
import Journey from "@/components/views/Journey";
import Lesson from "@/components/views/Lesson";
import Assessment from "@/components/views/Assessment";
import SkillsProfile from "@/components/views/SkillsProfile";
import TeamPulse from "@/components/views/TeamPulse";

type NavSection = {
  group: "coaching" | "insight";
  items: { view: View; key: keyof Content["nav"]; badge?: boolean; icon: React.ReactNode }[];
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
        badge: true,
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
    ],
  },
];

export default function AppShell({
  c,
  language,
  languages,
  onChangeLanguage,
  progress,
  onCompleteLesson,
  onSubmitAssessment,
}: {
  c: Content;
  language: LanguageCode;
  languages: { code: LanguageCode; label: string }[];
  onChangeLanguage: (l: LanguageCode) => void;
  progress: Progress;
  onCompleteLesson: (reflection: string) => void;
  onSubmitAssessment: (scores: Record<SkillId, number>) => void;
}) {
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Close the language menu on any outside click.
  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [langOpen]);

  const go = (v: View) => {
    setView(v);
    setSidebarOpen(false);
    setLangOpen(false);
  };

  const streak = computeStreak(progress.activeDates);

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
                <button
                  key={item.view}
                  className={`navlink ${view === item.view ? "on" : ""}`}
                  onClick={() => go(item.view)}
                >
                  {item.icon}
                  {c.nav[item.key]}
                  {item.badge && <span className="badge">{c.nav.journeyBadge}</span>}
                </button>
              ))}
            </Fragment>
          ))}

          <div className="spacer" />
          <div className="profile">
            <div className="pf">{c.profile.name.charAt(0)}</div>
            <div>
              <div className="pn">{c.profile.name}</div>
              <div className="pp">{c.profile.role}</div>
            </div>
          </div>
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
              <div className="search">
                <Search />
                {c.topbar.search}
              </div>
              <div className="streakpill">🔥 {fmt(c.topbar.streakLabel, { n: streak })}</div>
              <div className="langwrap">
                <button
                  className="langsel"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLangOpen((o) => !o);
                  }}
                >
                  {language.toUpperCase()}
                  <Chevron />
                </button>
                {langOpen && (
                  <div className="langmenu" onClick={(e) => e.stopPropagation()}>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        className={language === l.code ? "on" : ""}
                        onClick={() => onChangeLanguage(l.code)}
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

          <div className="content">
            {view === "dashboard" && <Dashboard c={c} progress={progress} go={go} />}
            {view === "journey" && <Journey c={c} progress={progress} go={go} />}
            {view === "lesson" && (
              <Lesson
                c={c}
                progress={progress}
                go={go}
                onComplete={(reflection) => {
                  onCompleteLesson(reflection);
                  go("dashboard");
                }}
              />
            )}
            {view === "results" && (
              <SkillsProfile c={c} scores={progress.scores} go={go} onRetake={() => go("assessment")} />
            )}
            {view === "team" && <TeamPulse c={c} />}
            {view === "assessment" && (
              <Assessment
                c={c}
                onExit={() => go("dashboard")}
                onComplete={(scores) => {
                  onSubmitAssessment(scores);
                  go("results");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
