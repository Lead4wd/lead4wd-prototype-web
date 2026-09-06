"use client";

// The lesson route's body, shared by `/lesson` and `/lesson/[moduleId]`.
//
// `/lesson` follows the journey — it opens whichever module is next. A module
// id opens that one specifically, which is what makes a lesson linkable: from
// search, from the journey, and from anywhere outside the app later.
import { useRouter } from "next/navigation";
import ModulePlayer from "@/components/ModulePlayer";
import { currentModuleId } from "@/lib/progress";
import { useApp } from "@/app/providers";
import { useGo } from "@/lib/navigation";

export default function LessonView({ moduleId }: { moduleId?: string }) {
  const router = useRouter();
  const go = useGo();
  const { c, progress, modules, completeModuleRun, trackEvent } = useApp();

  // Modules arrive asynchronously; until they do we cannot tell "no such
  // module" from "not loaded yet", so say nothing rather than flashing an
  // error at someone who followed a perfectly good link.
  if (modules.length === 0) return null;

  const moduleIds = modules.map((m) => m.id);
  const current = moduleId ?? currentModuleId(progress.completedModules, moduleIds);
  const module = modules.find((m) => m.id === current) ?? null;

  // Either they have finished everything, or the URL names a module that does
  // not exist. Both land here, and the journey is the useful place to be.
  if (!module) {
    return (
      <section className="view on">
        <div className="lesson">
          <span className="eyebrow">{c.nav.lesson}</span>
          <h1 style={{ marginTop: 10 }}>{c.dashboard.caughtUpTitle}</h1>
          <p className="sub" style={{ marginTop: 10 }}>
            {c.dashboard.caughtUpDesc}
          </p>
          <button className="btn btn-pri" style={{ marginTop: 22 }} onClick={() => go("journey")}>
            {c.nav.journey}
          </button>
        </div>
      </section>
    );
  }

  return (
    <ModulePlayer
      key={module.id}
      c={c}
      module={module}
      go={go}
      onComplete={(result) => {
        void completeModuleRun(module.id, result);
        router.push("/dashboard");
      }}
      onTrack={trackEvent}
    />
  );
}
