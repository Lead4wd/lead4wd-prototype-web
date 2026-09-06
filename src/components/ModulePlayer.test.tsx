import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CONTENT } from "@/data/content";
import type { ManagerModule } from "@/data/modules";
import type { LessonDraft, QuestionAttempt } from "@/lib/data";

const fetchLessonDraft = vi.fn<() => Promise<LessonDraft | null>>();
const saveLessonDraft = vi.fn<(id: string, d: LessonDraft) => Promise<void>>();

vi.mock("@/lib/data", () => ({
  fetchLessonDraft: (...a: unknown[]) => fetchLessonDraft(...(a as [])),
  saveLessonDraft: (...a: unknown[]) => saveLessonDraft(...(a as [string, LessonDraft])),
  // The reflect screen mounts the reflection partner, which asks whether the
  // coach is switched on. It is not what is under test here.
  fetchAiStatus: () => Promise.resolve(false),
  streamCoachReply: () => Promise.resolve({ ok: true }),
}));

const { default: ModulePlayer } = await import("@/components/ModulePlayer");

const module_: ManagerModule = {
  id: "m1",
  skill: "delegation",
  cluster: "Foundations",
  title: "Test module",
  summary: "s",
  minutes: 4,
  screens: [
    { kind: "hook", title: "Screen one", body: ["a"] },
    {
      kind: "selfcheck",
      title: "Screen two",
      prompt: "Pick one",
      options: [
        { text: "First option", response: "ok" },
        { text: "Second option", response: "also ok" },
      ],
    },
    { kind: "hook", title: "Screen three", body: ["c"] },
    { kind: "hook", title: "Screen four", body: ["d"] },
  ],
};

const draw = () => render(<ModulePlayer c={CONTENT.en} module={module_} go={vi.fn()} onComplete={vi.fn()} />);

describe("ModulePlayer resume", () => {
  beforeEach(() => {
    fetchLessonDraft.mockReset();
    saveLessonDraft.mockReset();
    saveLessonDraft.mockResolvedValue(undefined);
  });

  it("starts at the beginning when there is nothing to resume", async () => {
    fetchLessonDraft.mockResolvedValue(null);
    draw();
    expect(await screen.findByText("Screen one")).toBeInTheDocument();
  });

  it("reopens on the screen they left", async () => {
    fetchLessonDraft.mockResolvedValue({ screenIdx: 2, reflection: "", attempts: [] });
    draw();
    expect(await screen.findByText("Screen three")).toBeInTheDocument();
    expect(screen.queryByText("Screen one")).toBeNull();
  });

  it("clamps a stored position past the end of a re-authored module", async () => {
    // The module can be edited shorter between the save and the return; landing
    // on screens[99] would render nothing at all.
    fetchLessonDraft.mockResolvedValue({ screenIdx: 99, reflection: "", attempts: [] });
    draw();
    expect(await screen.findByText("Screen four")).toBeInTheDocument();
  });

  it("does not save over the draft before it has been restored", async () => {
    // A save fired on first render would overwrite screen 7 with screen 1.
    let release: (d: LessonDraft | null) => void = () => {};
    fetchLessonDraft.mockReturnValue(new Promise((r) => (release = r)));
    draw();
    expect(saveLessonDraft).not.toHaveBeenCalled();
    release({ screenIdx: 2, reflection: "", attempts: [] });
    expect(await screen.findByText("Screen three")).toBeInTheDocument();
  });

  it("saves the new position when they move on", async () => {
    fetchLessonDraft.mockResolvedValue(null);
    draw();
    await screen.findByText("Screen one");
    await userEvent.click(screen.getByRole("button", { name: CONTENT.en.player.continue }));

    await waitFor(() => expect(saveLessonDraft).toHaveBeenCalled());
    const [id, draft] = saveLessonDraft.mock.calls.at(-1)!;
    expect(id).toBe("m1");
    expect(draft.screenIdx).toBe(1);
  });

  it("saves the answer that moved them, not the state before it", async () => {
    // Choice screens advance the moment an option is tapped. Saving from the
    // handler's own closure would persist the screen before the answer existed.
    fetchLessonDraft.mockResolvedValue({ screenIdx: 1, reflection: "", attempts: [] });
    draw();
    await screen.findByText("Screen two");
    await userEvent.click(screen.getByRole("button", { name: "Second option" }));

    await waitFor(() => {
      const draft = saveLessonDraft.mock.calls.at(-1)![1];
      expect(draft.screenIdx).toBe(2);
      expect(draft.attempts).toHaveLength(1);
      expect(draft.attempts[0].response).toBe("Second option");
    });
  });

  it("round-trips an answer's key so editing replaces rather than duplicates", async () => {
    fetchLessonDraft.mockResolvedValue({
      screenIdx: 1,
      reflection: "",
      attempts: [
        { key: "1:0", screen_idx: 1, kind: "selfcheck", prompt: "Pick one", response: "First option", is_correct: null },
      ],
    });
    draw();
    await screen.findByText("Screen two");
    await userEvent.click(screen.getByRole("button", { name: "Second option" }));

    await waitFor(() => {
      const draft = saveLessonDraft.mock.calls.at(-1)![1];
      // Same key, so the earlier answer was replaced, not joined by a second.
      expect(draft.attempts).toHaveLength(1);
      expect(draft.attempts[0].key).toBe("1:0");
      expect(draft.attempts[0].response).toBe("Second option");
    });
  });

  it("keeps the player's key out of the completion payload", async () => {
    // /complete rejects unknown fields, and `key` is client-side bookkeeping.
    const onComplete = vi.fn();
    fetchLessonDraft.mockResolvedValue({
      screenIdx: 3,
      reflection: "written earlier",
      attempts: [
        { key: "1:0", screen_idx: 1, kind: "selfcheck", prompt: "Pick one", response: "First option", is_correct: null },
      ],
    });
    render(<ModulePlayer c={CONTENT.en} module={module_} go={vi.fn()} onComplete={onComplete} />);
    await screen.findByText("Screen four");
    await userEvent.click(screen.getByRole("button", { name: CONTENT.en.player.complete }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    const result = onComplete.mock.calls[0][0] as { attempts: QuestionAttempt[]; reflection: string };
    expect(result.reflection).toBe("written earlier");
    expect(result.attempts).toHaveLength(1);
    expect(result.attempts[0]).not.toHaveProperty("key");
  });

  it("does not write a draft after the module is completed", async () => {
    // The completion clears the stored draft; a late save from the unmount
    // would race it and put the lesson back to "started".
    fetchLessonDraft.mockResolvedValue({ screenIdx: 3, reflection: "", attempts: [] });
    const { unmount } = draw();
    await screen.findByText("Screen four");
    await userEvent.click(screen.getByRole("button", { name: CONTENT.en.player.complete }));
    saveLessonDraft.mockClear();
    unmount();
    expect(saveLessonDraft).not.toHaveBeenCalled();
  });

  it("saves on the way out of an unfinished lesson", async () => {
    fetchLessonDraft.mockResolvedValue({ screenIdx: 2, reflection: "", attempts: [] });
    const { unmount } = draw();
    await screen.findByText("Screen three");
    saveLessonDraft.mockClear();
    unmount();
    expect(saveLessonDraft).toHaveBeenCalledTimes(1);
    expect(saveLessonDraft.mock.calls[0][1].screenIdx).toBe(2);
  });
});
