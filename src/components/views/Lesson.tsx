import { useState } from "react";
import type { Content } from "@/data/content";
import { currentLessonId, type Progress, type View } from "@/lib/progress";
import { fmt } from "@/lib/format";
import { Clock, Bolt, ChevronLeft } from "@/components/icons";

export default function Lesson({
  c,
  progress,
  go,
  onComplete,
}: {
  c: Content;
  progress: Progress;
  go: (v: View) => void;
  onComplete: (reflection: string) => void;
}) {
  const l = c.lesson;
  const nowId = currentLessonId(progress.completedLessons);
  const caughtUp = nowId === null;
  const [reflection, setReflection] = useState(nowId ? progress.reflections[nowId] ?? "" : "");

  // Locate the current lesson in the journey so the header (eyebrow / title /
  // counter / progress / foot) matches where the user actually is — not a
  // hardcoded "Lesson 2". The teaching body below is a shared sample.
  let meta: { weekLabel: string; weekTitle: string; lessonTitle: string; idx: number; count: number } | null = null;
  if (nowId) {
    for (const phase of c.journey.phases) {
      const w = phase.weeks.find((wk) => wk.lessons.some((ls) => ls.id === nowId));
      if (w) {
        const idx = w.lessons.findIndex((ls) => ls.id === nowId);
        meta = { weekLabel: w.label, weekTitle: w.title, lessonTitle: w.lessons[idx].title, idx, count: w.lessons.length };
        break;
      }
    }
  }

  const eyebrow = meta ? `${meta.weekTitle} · ${fmt(l.lessonLabel, { n: meta.idx + 1 })}` : l.eyebrow;
  const title = meta ? meta.lessonTitle : l.title;
  const counter = meta ? `${meta.idx + 1} / ${meta.count}` : l.progress;
  const barWidth = meta ? `${Math.round(((meta.idx + 1) / meta.count) * 100)}%` : "100%";
  const foot = meta
    ? fmt(l.footTemplate, { n: meta.idx + 1, total: meta.count, week: meta.weekLabel })
    : l.allCaughtUp;

  return (
    <section className="view on">
      <div className="lesson">
        <div className="lbar">
          <button className="back" onClick={() => go("dashboard")}>
            <ChevronLeft />
            {c.common.back}
          </button>
          <div className="ltrack track">
            <i style={{ width: barWidth }} />
          </div>
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-faint)" }}>
            {counter}
          </span>
        </div>

        <div className="lhead">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <div className="lmeta">
            <span>
              <Clock />
              {fmt(c.common.minRead, { n: l.minutes })}
            </span>
            <span>
              <Bolt />
              {c.common.endsAction}
            </span>
          </div>
        </div>

        <div className="lbody">
          <p>{l.body[0]}</p>
          <p className="quote">{l.quote}</p>
          {l.body.slice(1).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="action-card">
          <span className="k">{l.actionKicker}</span>
          <h3>{l.actionText}</h3>
        </div>

        <div className="reflect-card">
          <h4>{l.reflectHeading}</h4>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 12, fontWeight: 500 }}>
            {l.reflectPrompt}
          </p>
          <textarea
            placeholder={l.reflectPlaceholder}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
        </div>

        <div className="lesson-foot">
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-faint)" }}>
            {foot}
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-soft" onClick={() => go("journey")}>
              {l.saveForLater}
            </button>
            <button className="btn btn-pri" disabled={caughtUp} onClick={() => onComplete(reflection)}>
              {l.markComplete}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
