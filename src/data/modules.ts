// ============================================================================
// Lead4wd — module curriculum (ported from the product doc)
// ----------------------------------------------------------------------------
// The 6 Foundation modules, each as a sequence of interactive screens:
//   hook → lesson/compare → drag-and-drop → micro self-check → scenario →
//   micro-action → reflection.
// English-first (the app chrome stays trilingual; module screen text is English
// for now and can be batch-translated later). Screen text lives here; the player
// CHROME labels (Back/Continue/Check…) are localised in content.ts → `player`.
// ============================================================================

import type { SkillId } from "@/data/content";

export type Screen =
  | { kind: "hook"; title: string; body: string[] }
  | {
      kind: "compare";
      title: string;
      leftLabel: string;
      rightLabel: string;
      left: string[];
      right: string[];
      highlight: string;
    }
  | { kind: "lesson"; title: string; points: { h: string; p: string }[]; note?: string }
  | {
      kind: "dragdrop";
      title: string;
      prompt: string;
      leftLabel: string;
      rightLabel: string;
      items: { text: string; side: "left" | "right" }[];
    }
  | { kind: "selfcheck"; title: string; prompt?: string; options: { text: string; response: string }[] }
  | {
      kind: "scenario";
      title: string;
      setup: string;
      question: string;
      choices: { text: string; feedback: string; best?: boolean }[];
      followUp?: string;
    }
  | { kind: "action"; title: string; intro: string; steps: string[]; note?: string }
  | {
      kind: "reflect";
      title: string;
      scaleQuestion: string;
      scaleOptions: string[];
      textPrompt: string;
      placeholder: string;
      closing: string;
    }
  // Tap-to-reveal: cards that flip from a "front" (e.g. an unhelpful move) to a
  // "back" (a better move / the reason). Purely informational — no answer.
  | {
      kind: "reveal";
      title: string;
      intro?: string;
      frontLabel: string;
      backLabel: string;
      items: { label: string; front: string; back: string }[];
      note?: string;
    }
  // Scenario-picker: choose a pattern, then branch into that pattern's scenario.
  | {
      kind: "scenariopick";
      title: string;
      prompt: string;
      paths: {
        label: string;
        setup: string;
        question: string;
        choices: { text: string; feedback: string; best?: boolean }[];
      }[];
    }
  // Guided free-text builder: a few prompted fields the user fills to draft a
  // short script/plan (saved as their own words).
  | {
      kind: "scriptbuilder";
      title: string;
      intro: string;
      fields: { label: string; hint: string; placeholder: string }[];
      note?: string;
    }
  // 30-day plan builder: pick up to N focus areas, each with a micro-habit and a
  // support/reminder. Area-specific hints guide the habit text.
  | {
      kind: "planbuilder";
      title: string;
      intro: string;
      areaOptions: string[];
      habitHints: { area: string; hint: string }[];
      habitPrompt: string;
      supportPrompt: string;
      maxRows: number;
      note?: string;
    }
  // Commitment: a single choice (e.g. check-in cadence) that closes a plan.
  | {
      kind: "commit";
      title: string;
      intro: string;
      question: string;
      options: string[];
      closing: string;
    }
  // Stakeholder map + power/interest grid: repeatable rows (name + relationship),
  // each tagged with power/interest to yield a plain-language classification.
  | {
      kind: "stakeholdermap";
      title: string;
      prompt: string;
      hint?: string;
      relationshipOptions: string[];
      classifications: { highHigh: string; highLow: string; lowHigh: string; lowLow: string };
      note?: string;
    };

export type ManagerModule = {
  id: string;
  skill: SkillId;
  cluster: string;
  title: string;
  summary: string;
  minutes: number;
  screens: Screen[];
};

export const MODULES: ManagerModule[] = [
  // ---------------------------------------------------------------- Module 1
  {
    id: "m1",
    skill: "delegation",
    cluster: "Foundations",
    title: "From individual contributor to people manager",
    summary: "What changes when you stop doing and start enabling.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "From individual contributor to people manager",
        body: [
          "You used to be rewarded for getting your own work done. Now your success depends on how well your team performs.",
          "If you keep working the way you did as an IC, you'll feel overloaded — and your team won't grow.",
        ],
      },
      {
        kind: "compare",
        title: "Your job has changed (even if nobody said it clearly)",
        leftLabel: "Individual contributor",
        rightLabel: "People manager",
        left: ["I finish my tasks.", "I'm the expert with the answers.", "My success = my personal output."],
        right: ["My team hits our goals.", "I create clarity and remove blockers.", "My success = our collective output."],
        highlight: "You're moving from 'How can I do more?' to 'How can we do better?'",
      },
      {
        kind: "dragdrop",
        title: "Are these IC or manager behaviours?",
        prompt: "Drag each statement into the bucket where it mostly belongs today. Go with your first instinct.",
        leftLabel: "Individual contributor",
        rightLabel: "People manager",
        items: [
          { text: "I fix problems myself so it's faster.", side: "left" },
          { text: "I ask what they think before I share my view.", side: "right" },
          { text: "I stay late to finish other people's tasks.", side: "left" },
          { text: "I define what success looks like, then let the team find the 'how'.", side: "right" },
          { text: "I redo work if it's not exactly my style.", side: "left" },
          { text: "I plan 1:1s and feedback conversations each week.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Which trap sounds most like you right now?",
        prompt: "Most new managers get stuck in at least one. Pick the closest.",
        options: [
          { text: "I keep jumping in to fix everything (still the hero).", response: "Great self-awareness. We'll help you move from hero to coach." },
          { text: "I'm juggling a full IC workload plus managing on the side.", response: "You're not alone. Time and focus are big challenges in year one." },
          { text: "I avoid tough conversations and hope things improve.", response: "Very common. We'll practise small, safe steps into tough talks." },
          { text: "I don't want to upset my old peers, so I hold back.", response: "Leading former peers is tricky. We'll work on boundaries and clarity." },
        ],
      },
      {
        kind: "lesson",
        title: "The manager mindset: 3 shifts",
        points: [
          { h: "From doing to enabling", p: "From 'How can I fix this?' to 'How do I set things up so my team can handle it well?'" },
          { h: "From answers to questions", p: "Instead of giving the solution, start with 'What do you think we should do?'" },
          { h: "From short-term fixes to long-term growth", p: "Still hit today's deadlines, but invest in coaching, feedback, and better processes." },
        ],
        note: "These aren't personality traits. They're learnable skills — we'll practise them in tiny steps.",
      },
      {
        kind: "scenario",
        title: "Scenario: what do you do?",
        setup: "A team member pings you: 'This client email is tricky — can you tell me exactly what to reply?' You're busy and want it done quickly.",
        question: "What do you do most often today (be honest)?",
        choices: [
          { text: "Quickly write the reply for them so it's correct.", feedback: "Still hero mode. Fast short-term, but they stay dependent on you." },
          { text: "Ignore it until later, then rush it yourself.", feedback: "Understandable when overloaded, but it grows your stress and not your team." },
          { text: "Ask them to draft a reply, then review it together.", feedback: "A classic manager move: you enable, coach, and still protect quality.", best: true },
        ],
        followUp: "Over this journey we'll help you reach the third option more often — without slowing everything down.",
      },
      {
        kind: "action",
        title: "Today's action: one small shift",
        intro: "In the next 24 hours, when a team member asks for help, try this:",
        steps: [
          "Instead of answering, ask: 'Before I share my view, what do you think we should do?'",
          "Listen fully. Ask one follow-up question.",
          "Decide together on the final approach.",
        ],
        note: "You're practising two shifts at once: doing → enabling, and answers → questions.",
      },
      {
        kind: "reflect",
        title: "How did your first shift feel?",
        scaleQuestion: "How hard was it not to jump in with the answer?",
        scaleOptions: ["Very hard", "Hard", "Okay", "Easy", "Very easy"],
        textPrompt: "What surprised you about your team member's idea?",
        placeholder: "They suggested…",
        closing: "Every time you do this, you build your manager muscle. Small reps, big change.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 2
  {
    id: "m2",
    skill: "listening",
    cluster: "Foundations",
    title: "Manager mindset & emotional intelligence",
    summary: "Manage your own reactions before you manage others.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Your first tool as a manager: your emotions",
        body: [
          "As an IC you were judged on your skills and output.",
          "As a manager, your emotional reactions — your tone, your calm, your empathy — can build or break trust in seconds.",
          "Emotional intelligence is the quiet superpower of great managers.",
        ],
      },
      {
        kind: "lesson",
        title: "Emotional intelligence in your day-to-day",
        points: [
          { h: "Self-awareness", p: "Noticing what you feel and how you come across — especially when stressed." },
          { h: "Self-regulation", p: "Choosing your response instead of reacting on autopilot." },
          { h: "Empathy", p: "Understanding what your team might be feeling, even when unspoken." },
        ],
        note: "You can't control everything that happens, but you can control how you show up.",
      },
      {
        kind: "dragdrop",
        title: "Reacting or responding?",
        prompt: "React = fast and emotional. Respond = calm and intentional. Sort each one.",
        leftLabel: "Reacting",
        rightLabel: "Responding",
        items: [
          { text: "Firing off a sharp message in chat the moment you see a mistake.", side: "left" },
          { text: "Taking a breath and asking 'What happened here?' before commenting.", side: "right" },
          { text: "'We've talked about this — why are you still getting it wrong?'", side: "left" },
          { text: "'Let's walk through what made this hard and what support you need.'", side: "right" },
          { text: "Going silent and avoiding the person for days.", side: "left" },
          { text: "Booking a short 1:1 to share impact, listen, and agree next steps.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "When you're under pressure, you tend to…",
        options: [
          { text: "Get sharp or impatient — people feel my frustration.", response: "You care a lot. We'll protect people from the rough edges of that." },
          { text: "Shut down or go quiet — I avoid conversations.", response: "Silence can feel scary to others too. We'll practise safe ways to speak up." },
          { text: "Over-control — micromanage, double-check, take work back.", response: "You want things to go well. We'll help you trust and coach more." },
          { text: "Stay mostly calm — but it takes effort.", response: "Great. We'll still sharpen your awareness and empathy." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the missed deadline",
        setup: "A key report your team promised another department is late. They're upset and copying your boss. You feel a rush of stress.",
        question: "What do you do in the first 2 minutes?",
        choices: [
          { text: "Send a tough message: 'This is unacceptable. We're making the whole group look bad.'", feedback: "A reaction. It releases your stress but creates fear — and less honesty next time." },
          { text: "Say nothing, take the report on yourself, stay late, and resent the team.", feedback: "Another reaction — shut down and rescue. Work gets done, nobody learns, your stress grows." },
          { text: "Pause, notice what you feel, then: 'Let's jump on a quick call to understand what happened.'", feedback: "A response — still addressing it, but with curiosity and respect.", best: true },
        ],
        followUp: "EI doesn't mean pretending you're not upset. It means not letting your first emotion choose your next move.",
      },
      {
        kind: "action",
        title: "Today's action: the 10-second pause",
        intro: "Today, when something triggers you — a mistake, a comment, an email — try this:",
        steps: [
          "Pause for one deep breath.",
          "Name your feeling silently: 'I'm frustrated / anxious.'",
          "Choose one manager question: 'Can you walk me through what happened?'",
        ],
        note: "You're training your brain to respond like a manager, not react like a stressed IC.",
      },
      {
        kind: "reflect",
        title: "How did your 10-second pause go?",
        scaleQuestion: "How often did you pause before reacting yesterday?",
        scaleOptions: ["0 times", "1 time", "2–3 times", "4+ times"],
        textPrompt: "What changed in the conversation when you paused first?",
        placeholder: "When I paused…",
        closing: "Every pause builds your self-awareness and self-control. That's EI in action.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 3
  {
    id: "m3",
    skill: "conflict",
    cluster: "Foundations",
    title: "Trust, psychological safety & inclusion",
    summary: "Make it safe to speak up, disagree, and admit mistakes.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "If they don't feel safe, they won't tell you the truth",
        body: [
          "Your team can only fix problems they're willing to talk about.",
          "If people fear being judged, blamed, or ignored, they hide issues, ideas, and mistakes.",
          "Your daily behaviour decides: 'Is it safe to speak up here?'",
        ],
      },
      {
        kind: "lesson",
        title: "Psychological safety, in real language",
        points: [
          { h: "Ask without fear", p: "People can ask questions without feeling stupid." },
          { h: "Admit mistakes", p: "People can own mistakes without being shamed." },
          { h: "Share concerns", p: "People can raise ideas or risks without fear of payback." },
        ],
        note: "It doesn't mean everyone is always comfortable. It means it's safe to be honest.",
      },
      {
        kind: "dragdrop",
        title: "Do these build or break safety?",
        prompt: "Sort each behaviour into the right bucket.",
        leftLabel: "Builds safety",
        rightLabel: "Breaks safety",
        items: [
          { text: "Laughing when someone asks a basic question in a meeting.", side: "right" },
          { text: "'Thank you for raising this' when someone shares a risk.", side: "left" },
          { text: "In front of others: 'Why can't you get this right?'", side: "right" },
          { text: "Sharing one of your own past mistakes and what you learned.", side: "left" },
          { text: "Ignoring a concern because a quieter person raised it.", side: "right" },
          { text: "Inviting quieter people by name: 'I'd love your view on this.'", side: "left" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Right now, my team would say…",
        prompt: "How safe is it to speak honestly to me about problems?",
        options: [
          { text: "Very safe — they tell me almost everything.", response: "Great. We'll keep reinforcing the behaviours that created this." },
          { text: "Mostly safe — they tell me many things.", response: "Good base. Small changes can unlock even more honesty." },
          { text: "Mixed — some things are left unsaid.", response: "Awareness is the first step. We'll start with one small change this week." },
          { text: "Not very safe — they often hold back.", response: "Awareness is the first step. We'll start with one small change this week." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the public mistake",
        setup: "In a team meeting, someone shares a report with a clear mistake. Another department is on the call. You feel embarrassed and frustrated.",
        question: "What do you say or do?",
        choices: [
          { text: "In front of everyone: 'This is wrong. We can't present work like this.'", feedback: "A common reaction — but it breaks safety. People learn to hide mistakes, not surface them." },
          { text: "Say nothing in the meeting, then send a long angry message later.", feedback: "Kinder in public, but private anger still creates fear of bringing you unfinished work." },
          { text: "'Thanks for putting this together. There's a mistake — let's fix it and talk after about what made it hard.'", feedback: "Addresses the issue and protects safety. You separate the person from the problem.", best: true },
        ],
        followUp: "Psychological safety isn't ignoring mistakes. It's how you respond when they happen.",
      },
      {
        kind: "action",
        title: "Today's action: reward the risk of speaking up",
        intro: "In your next meeting or 1:1, do one of these:",
        steps: [
          "When someone shares a concern: 'Thank you for raising this. Let's look at it together.'",
          "Ask a quieter person by name: 'I'd really like to hear your thoughts.'",
          "Share one small mistake you've made and what you learned.",
        ],
        note: "People repeat what gets rewarded, not punished.",
      },
      {
        kind: "reflect",
        title: "What changed when you rewarded honesty?",
        scaleQuestion: "How did your team react when you thanked them or invited their view?",
        scaleOptions: ["Shut down", "Neutral", "A bit more open", "Clearly more open"],
        textPrompt: "What did you notice about the energy in the conversation?",
        placeholder: "I noticed…",
        closing: "Every time you reward speaking up, you invest in trust. Over time, that becomes your team's culture.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 4
  {
    id: "m4",
    skill: "communication",
    cluster: "Communication & listening",
    title: "Communication foundations",
    summary: "Be clear: outcome, context, and a check-back.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Saying it once ≠ clear communication",
        body: [
          "Most new managers say: 'But I told them what to do.'",
          "If your message isn't clear, specific, and checked for understanding, your team will guess — and you'll be disappointed.",
          "Your job isn't just to talk. It's to make sure the message lands.",
        ],
      },
      {
        kind: "lesson",
        title: "Clear communication = 3 ingredients",
        points: [
          { h: "Outcome", p: "What does 'done' look like? 'A one-page summary with 3 options by Friday', not 'fix the deck'." },
          { h: "Context", p: "Why does it matter? 'This is for a client decision; they care about cost and risk.'" },
          { h: "Check-back", p: "'Can you tell me in your own words what you'll deliver and by when?'" },
        ],
        note: "If any of these are missing, your team is guessing.",
      },
      {
        kind: "dragdrop",
        title: "Clarity or confusion?",
        prompt: "Sort each statement into the right bucket.",
        leftLabel: "Builds clarity",
        rightLabel: "Creates confusion",
        items: [
          { text: "'Just get this to me ASAP.'", side: "right" },
          { text: "'Send a one-page summary of the top 3 risks by Thursday 3pm.'", side: "left" },
          { text: "'You know what I mean, right?'", side: "right" },
          { text: "'This is for leadership — keep it high-level, focused on impact.'", side: "left" },
          { text: "'Sort it out with the others.'", side: "right" },
          { text: "'You own the first draft; I'll review once before it goes out.'", side: "left" },
        ],
      },
      {
        kind: "selfcheck",
        title: "When I assign tasks, I usually…",
        options: [
          { text: "Say what I need roughly and expect them to figure it out.", response: "Fast short-term, but it leads to rework. We'll start upgrading this." },
          { text: "Give some detail but rarely check what they understood.", response: "On the right path — adding a check-back will level this up." },
          { text: "Explain the outcome and context, and ask them to repeat the plan.", response: "Great foundation. We'll make this consistent and efficient." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: handing off an important task",
        setup: "You need a team member to prepare a quick update for leadership on a customer issue. They're busy, you're busy, but it's important.",
        question: "What do you actually say most often?",
        choices: [
          { text: "'Can you put something together for leadership about the issue?'", feedback: "Better than nothing, but still vague. 'Something' means different things to each of you." },
          { text: "'Can you handle the leadership update?' (no details)", feedback: "Maximum confusion — they might not know format, level, or deadline." },
          { text: "'Send a 3–4 slide update by 11am tomorrow: what happened, impact, recommended next step.'", feedback: "Clear outcome, structure, and deadline. Add a check-back and you're solid.", best: true },
        ],
        followUp: "Add one line to make it complete: 'Can you recap what you'll send and when?'",
      },
      {
        kind: "action",
        title: "Today's action: define 'done' clearly once",
        intro: "Pick one task you'll assign today. Include these 3 pieces:",
        steps: [
          "Outcome: 'This is what done looks like…'",
          "Deadline: 'I need it by…'",
          "Check-back: 'Can you tell me in your own words what you'll deliver and by when?'",
        ],
        note: "You don't need to talk more. You need to talk more clearly about what matters.",
      },
      {
        kind: "reflect",
        title: "Did your clear ask change anything?",
        scaleQuestion: "How clear did your task feel to them this time?",
        scaleOptions: ["Still lots of questions", "Somewhat clearer", "Clear", "Very clear, almost no follow-ups"],
        textPrompt: "What did you notice about their questions or the quality of their work?",
        placeholder: "I noticed…",
        closing: "Every time you define 'done' clearly, you save time later and build trust that you're a clear, reliable leader.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 5
  {
    id: "m5",
    skill: "listening",
    cluster: "Communication & listening",
    title: "Active listening & better questions",
    summary: "Listen to understand, and ask before you advise.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Listening is your most underrated power",
        body: [
          "Managers spend much of the day in conversations — but few are trained to listen well.",
          "When you listen actively, people feel safe and honest. You spot problems earlier and build trust faster.",
          "Listening well is often more powerful than the perfect advice.",
        ],
      },
      {
        kind: "lesson",
        title: "Active listening = 3 moves",
        points: [
          { h: "Presence", p: "Remove distractions, make eye contact, give full attention." },
          { h: "Reflect & clarify", p: "Reflect key points: 'So you're saying…' and ask clarifying questions." },
          { h: "Curious questions", p: "Ask 'What happened next?' or 'How did that feel?' instead of jumping to solutions." },
        ],
        note: "Your goal isn't to talk less. It's to understand more before you speak.",
      },
      {
        kind: "dragdrop",
        title: "Listening or pretending?",
        prompt: "Sort each behaviour into the right bucket.",
        leftLabel: "Active listening",
        rightLabel: "Pretending to listen",
        items: [
          { text: "Checking your phone while someone is talking.", side: "right" },
          { text: "'Tell me more about that' — then staying quiet.", side: "left" },
          { text: "Formulating your reply while they're still speaking.", side: "right" },
          { text: "'If I heard you right, the main issue is…'", side: "left" },
          { text: "Cutting in with 'Yeah, yeah, I get it, here's what to do…'", side: "right" },
          { text: "'What was the hardest part of that for you?'", side: "left" },
        ],
      },
      {
        kind: "selfcheck",
        title: "In most 1:1s, I tend to…",
        options: [
          { text: "Talk more than I listen — explaining, advising, updating.", response: "Very common for new managers. We'll help you flip this gradually." },
          { text: "Listen at first, then jump in quickly with my opinions.", response: "Partway there — adding 1–2 good questions will unlock a lot." },
          { text: "Let them talk, reflect back, and ask follow-up questions.", response: "Great habit. We'll sharpen your questions even more." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: your team member shares a concern",
        setup: "In a 1:1, your team member says: 'Honestly, I've been feeling overwhelmed and I'm not sure I'm doing a good job.'",
        question: "What do you say first?",
        choices: [
          { text: "'Don't worry, you're doing fine. Anyway, here are our priorities…'", feedback: "Comes from a good place, but shuts the door. They learn not to bring early signals to you." },
          { text: "'Why are you overwhelmed? We all have a lot on our plates.'", feedback: "'Why' can feel like judgement. They may get defensive instead of opening up." },
          { text: "'Thanks for telling me. Can you tell me more about what's felt overwhelming lately?'", feedback: "An active-listening response. You acknowledge their courage and invite more without judging.", best: true },
        ],
        followUp: "Good follow-ups start with 'what' or 'how', not 'why': 'What's been the toughest part?'",
      },
      {
        kind: "action",
        title: "Today's action: the 70/30 rule",
        intro: "In your next 1:1 or meaningful conversation, try this:",
        steps: [
          "Remove distractions for 10–15 minutes (no phone).",
          "Aim for them to talk ~70% of the time, you 30%.",
          "Ask one open question: 'What's been most challenging this week?'",
        ],
        note: "You're practising two skills at once: full attention, and better questions.",
      },
      {
        kind: "reflect",
        title: "Did your listening change the conversation?",
        scaleQuestion: "In that 1:1, who talked more?",
        scaleOptions: ["I talked most", "About 50/50", "They talked more"],
        textPrompt: "What did you hear this time that you might have missed before?",
        placeholder: "I heard…",
        closing: "When people feel truly heard, they're more honest and more committed. That's the real power of listening.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 6
  {
    id: "m6",
    skill: "communication",
    cluster: "Communication & listening",
    title: "Communicating in digital & hybrid teams",
    summary: "Clear, calm, human — across chat and calls.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Most of your leadership now happens in chat and calls",
        body: [
          "In modern teams, your messages and calls are often the only way people experience you as a manager.",
          "A rushed or unclear message can create confusion or anxiety faster than you think.",
          "Good digital communication = clear, calm, and human.",
        ],
      },
      {
        kind: "lesson",
        title: "Three rules for digital comms",
        points: [
          { h: "Assume low context", p: "People can't see your face or hear your tone. Be explicit." },
          { h: "Slow down reactions", p: "Don't fire off emotional messages. Use digital for clarity, not venting." },
          { h: "Add a touch of human", p: "A 'thanks' or 'how are you doing?' goes a long way in chat." },
        ],
        note: "Write like someone will read it after a long day.",
      },
      {
        kind: "dragdrop",
        title: "Do these messages help or hurt?",
        prompt: "Sort each message into the right bucket.",
        leftLabel: "Helps clarity & trust",
        rightLabel: "Creates confusion or stress",
        items: [
          { text: "'We need to talk. Call me.' (no context)", side: "right" },
          { text: "'Quick sync at 3pm to review the client issue? Nothing urgent, just want to align.'", side: "left" },
          { text: "'???' (sent after a delay)", side: "right" },
          { text: "'Thanks for sending this. I've added comments — let's finalise by tomorrow.'", side: "left" },
          { text: "'This is wrong.' (in a public channel)", side: "right" },
          { text: "'Let's fix this together. I'll DM you to understand what happened.'", side: "left" },
        ],
      },
      {
        kind: "selfcheck",
        title: "My typical digital style is…",
        options: [
          { text: "Very short, often no context — I just send what's on my mind.", response: "Fast, but risky. Tiny tweaks to context reduce a lot of stress." },
          { text: "Sometimes clear, but when stressed I send rushed or sharp messages.", response: "You're aware of stress leaks. We'll add one pause step." },
          { text: "Mostly clear and polite, but I could be more explicit about expectations.", response: "Good base. We'll sharpen your clarity and warmth." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the late-night message",
        setup: "It's 11pm. You remember a problem with tomorrow's client meeting and grab your phone to message the project channel.",
        question: "What do you actually send?",
        choices: [
          { text: "'This deck is not good. We need to fix it before tomorrow.'", feedback: "High stress, low clarity. People may panic, work late, and still not know what to fix." },
          { text: "'We have issues with tomorrow's deck. Fix it before the meeting.'", feedback: "Slightly clearer, but still invites a late-night scramble and anxiety." },
          { text: "'Noticed a few issues with tomorrow's deck. Please don't work late — we'll review together at 9am. I'll add notes in the doc.'", feedback: "Balances urgency, clarity, and care. You give a plan and protect boundaries.", best: true },
        ],
        followUp: "Before you send, ask: is it clear on what and when? Am I creating unnecessary stress in how I say it?",
      },
      {
        kind: "action",
        title: "Today's action: add context + care",
        intro: "For your next important message (email, Slack, WhatsApp), do this:",
        steps: [
          "Start with context: 'Quick update about [topic]…'",
          "Add a clear ask: 'What I need from you is…'",
          "Add time framing: 'By [day], not urgent before then.'",
          "Add a human line: 'Thanks for jumping on this.'",
        ],
        note: "You're making your messages feel like a calm leader, not a random alert.",
      },
      {
        kind: "reflect",
        title: "How did your clearer message land?",
        scaleQuestion: "How did people respond to your message?",
        scaleOptions: ["Confused / many questions", "Understood but stressed", "Understood and calm", "Appreciation or quick alignment"],
        textPrompt: "What did you change in your wording compared to usual?",
        placeholder: "I changed…",
        closing: "In hybrid teams, people mostly see you through your words on a screen. Each clear, calm message builds your reputation.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 7
  {
    id: "m7",
    skill: "communication",
    cluster: "Expectations, delegation & time",
    title: "Setting expectations & direction",
    summary: "Define what 'good' looks like — and align it with the bigger picture.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "People can't meet expectations they can't see",
        body: [
          "Most underperformance isn't laziness — it's unclear expectations.",
          "If your team is guessing what 'good' looks like, they'll aim at the wrong target and you'll both be frustrated.",
          "Your job is to make the target obvious, and tie it to why it matters.",
        ],
      },
      {
        kind: "lesson",
        title: "Clear direction = 3 layers",
        points: [
          { h: "Role clarity", p: "What this person owns, decides, and is accountable for — not just today's tasks." },
          { h: "'Good' defined", p: "A concrete picture of done: quality, format, and standard, not a vague 'do your best'." },
          { h: "Line of sight", p: "How their work connects to the team's goal and the business — so it has meaning." },
        ],
        note: "Expectations set once and never revisited quietly drift. Repeat them more than feels necessary.",
      },
      {
        kind: "dragdrop",
        title: "Clear expectation or vague hope?",
        prompt: "Sort each statement into the right bucket.",
        leftLabel: "Clear expectation",
        rightLabel: "Vague hope",
        items: [
          { text: "'Own the weekly report; it's accurate and out by Monday 10am.'", side: "left" },
          { text: "'Just keep an eye on quality.'", side: "right" },
          { text: "'You decide on refunds under ₹5,000 without checking with me.'", side: "left" },
          { text: "'Be more proactive.'", side: "right" },
          { text: "'For this client, success = renewed contract and a reference call.'", side: "left" },
          { text: "'Handle the project well.'", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "When you hand over responsibility, you usually…",
        prompt: "Pick the closest.",
        options: [
          { text: "Describe the task but rarely the decision rights.", response: "Common gap. We'll make 'what you can decide' explicit." },
          { text: "Explain the 'what' but skip the 'why'.", response: "Adding line-of-sight turns compliance into ownership." },
          { text: "Set a clear outcome, decision rights, and the why.", response: "Strong. We'll keep this consistent across your team." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the drifting project",
        setup: "Two weeks in, a project is heading the wrong way. When you ask, your team member says: 'I thought this is what you wanted.'",
        question: "What's the most useful response?",
        choices: [
          { text: "'I shouldn't have to spell out every detail.'", feedback: "Blames the person for an expectations gap you co-own. They'll hide drift next time." },
          { text: "Quietly take the work back and fix it yourself.", feedback: "Solves today, but teaches them that unclear = you rescue. Nothing improves." },
          { text: "'That's on me — let me re-define what good looks like, then you tell me the plan.'", feedback: "Owns the clarity gap and resets expectations without blame. That builds trust.", best: true },
        ],
        followUp: "When work drifts, check the expectation before you judge the effort.",
      },
      {
        kind: "action",
        title: "Today's action: write one 'definition of done'",
        intro: "Pick one ongoing responsibility a team member holds. Write down:",
        steps: [
          "Outcome: 'This is what good looks like…'",
          "Decision rights: 'You can decide ___ without me; check with me on ___.'",
          "Why it matters: 'This connects to ___.'",
        ],
        note: "Share it, then ask them to play it back in their own words.",
      },
      {
        kind: "reflect",
        title: "Did clearer direction change anything?",
        scaleQuestion: "How aligned did you and your team member feel afterwards?",
        scaleOptions: ["Still misaligned", "A little clearer", "Mostly aligned", "Fully aligned"],
        textPrompt: "What expectation had you assumed was obvious but wasn't?",
        placeholder: "I assumed…",
        closing: "Clarity up front saves a dozen corrections later. It's the cheapest investment you'll make.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 8
  {
    id: "m8",
    skill: "delegation",
    cluster: "Expectations, delegation & time",
    title: "Delegation without micromanaging",
    summary: "Hand over outcomes, not just tasks — and resist taking them back.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "If everything needs you, nothing can scale",
        body: [
          "New managers often delegate tasks but keep all the thinking — so work still bottlenecks on them.",
          "Real delegation hands over the outcome and the decisions, then supports without hovering.",
          "Done well, it grows your people and frees your time. Done badly, it's just dumping or micromanaging.",
        ],
      },
      {
        kind: "compare",
        title: "Dumping vs. micromanaging vs. delegating",
        leftLabel: "What it's not",
        rightLabel: "Real delegation",
        left: ["Throw the task over the wall and disappear.", "Assign it, then check every step and redo it.", "Keep all decisions for yourself."],
        right: ["Agree the outcome and why it matters.", "Set check-in points, then let them work.", "Hand over the decisions that fit their level."],
        highlight: "Delegation = clear outcome + the right level of decision rights + agreed follow-up.",
      },
      {
        kind: "dragdrop",
        title: "Delegate it or keep it?",
        prompt: "For a growing team member, sort what you'd hand over vs. hold.",
        leftLabel: "Good to delegate",
        rightLabel: "Keep (for now)",
        items: [
          { text: "Drafting the monthly status report.", side: "left" },
          { text: "Running a recurring stakeholder update.", side: "left" },
          { text: "A confidential decision about someone's pay.", side: "right" },
          { text: "Choosing the vendor from a shortlist you approved.", side: "left" },
          { text: "Handling a serious complaint about a teammate.", side: "right" },
          { text: "Owning the team's onboarding checklist.", side: "left" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Your delegation default is…",
        options: [
          { text: "I hold on to most things — faster if I just do it.", response: "Short-term true, long-term costly. We'll start handing over safely." },
          { text: "I delegate, but then hover and correct constantly.", response: "That's micromanaging in disguise. We'll add trust + check-ins instead." },
          { text: "I delegate outcomes and check in at agreed points.", response: "Great. We'll sharpen how you match tasks to people." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: it's not how you'd do it",
        setup: "You delegated a client deck. It's good and on-message — but structured differently from how you'd do it. The meeting is tomorrow.",
        question: "What do you do?",
        choices: [
          { text: "Rework it overnight into your preferred structure.", feedback: "You signal that their way is never enough. They stop trying — and you're exhausted." },
          { text: "Send a long list of style changes to 'fix' it.", feedback: "Micromanaging the form, not the outcome. It works but ownership evaporates." },
          { text: "Check it meets the goal, give one or two high-impact notes, and let the rest stand.", feedback: "Protects quality and ownership. 'Different from mine' isn't 'wrong'.", best: true },
        ],
        followUp: "Ask: does this actually affect the outcome, or just my preference?",
      },
      {
        kind: "action",
        title: "Today's action: delegate one outcome",
        intro: "Pick one thing only you currently do. Hand it over like this:",
        steps: [
          "Name the outcome: 'What I need is ___ by ___.'",
          "Set decision rights: 'You can decide ___; loop me in on ___.'",
          "Agree one check-in — then don't hover in between.",
        ],
        note: "Expect it to be ~80% of your version at first. That's a win, not a problem.",
      },
      {
        kind: "reflect",
        title: "How did letting go feel?",
        scaleQuestion: "How hard was it to not step in before the check-in?",
        scaleOptions: ["Very hard", "Hard", "Okay", "Easy"],
        textPrompt: "What did they do well that you might not have done the same way?",
        placeholder: "They…",
        closing: "Every outcome you delegate well multiplies your team's capacity — and your own time.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 9
  {
    id: "m9",
    skill: "delegation",
    cluster: "Expectations, delegation & time",
    title: "Time & priority management for managers",
    summary: "Shift your calendar from doing the work to enabling it.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Your calendar is your real job description",
        body: [
          "As an IC, a full calendar of 'doing' felt productive. As a manager, that same calendar means your team is waiting on you.",
          "Manager time goes to 1:1s, reviews, unblocking, and thinking — work that multiplies others.",
          "If you don't protect that time, urgent tasks will eat all of it.",
        ],
      },
      {
        kind: "lesson",
        title: "Three priority moves",
        points: [
          { h: "Important over urgent", p: "Urgent shouts; important whispers. Schedule the important (1:1s, planning) before the day fills up." },
          { h: "Protect manager blocks", p: "Block time for coaching, review, and thinking — and treat it as unmovable as a client meeting." },
          { h: "Decide what not to do", p: "Saying yes to everything means doing everything yourself. Prioritising is mostly choosing what to drop." },
        ],
        note: "A calendar full of others' urgencies is a sign of weak priorities, not hard work.",
      },
      {
        kind: "dragdrop",
        title: "Manager time or doer time?",
        prompt: "Sort how a manager should mostly spend their week.",
        leftLabel: "Multiplier time",
        rightLabel: "Doer time (delegate/limit)",
        items: [
          { text: "Weekly 1:1s with each team member.", side: "left" },
          { text: "Personally formatting every report.", side: "right" },
          { text: "30 minutes of weekly planning + review.", side: "left" },
          { text: "Answering every Slack ping the second it arrives.", side: "right" },
          { text: "Unblocking a stuck team member.", side: "left" },
          { text: "Redoing tasks you already delegated.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Right now, most of your week goes to…",
        options: [
          { text: "Firefighting — reacting to whatever's loudest.", response: "Very common in year one. We'll carve out protected blocks." },
          { text: "Doing IC work, with managing squeezed into gaps.", response: "Your team needs your manager time. We'll start reclaiming it." },
          { text: "A mix, with some protected coaching/planning time.", response: "Good base. We'll make the important time non-negotiable." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the calendar collision",
        setup: "Your weekly 1:1 with a team member clashes with an 'urgent' task your boss dropped on you 20 minutes ago.",
        question: "What's the strongest move?",
        choices: [
          { text: "Cancel the 1:1 — the urgent task wins, again.", feedback: "Understandable once. As a habit, it tells your team they come last." },
          { text: "Do both badly — half-listen in the 1:1 while working.", feedback: "Neither gets your real attention; your team member feels it." },
          { text: "Keep the 1:1, and ask your boss what can move or who else can help.", feedback: "Protects the multiplier time and renegotiates the 'urgent'. Most urgencies have flex.", best: true },
        ],
        followUp: "Not everything labelled urgent actually is. Ask before you sacrifice your priorities.",
      },
      {
        kind: "action",
        title: "Today's action: protect one block",
        intro: "Open your calendar and do this now:",
        steps: [
          "Block 30 minutes this week for planning/review — name it and make it recurring.",
          "Pick one recurring 'doer' task to delegate or drop.",
          "Turn off notifications for one focus hour and tell your team why.",
        ],
        note: "You're shifting from reacting to your day to designing it.",
      },
      {
        kind: "reflect",
        title: "Did protecting time change your week?",
        scaleQuestion: "How well did you hold your protected block?",
        scaleOptions: ["Lost it entirely", "Partly held it", "Mostly held it", "Fully held it"],
        textPrompt: "What did you choose NOT to do this week, and what happened?",
        placeholder: "I stopped…",
        closing: "Managers who protect their priorities lead calmer, more capable teams. Your calendar is a leadership tool.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 10
  {
    id: "m10",
    skill: "feedback",
    cluster: "Feedback, coaching & performance",
    title: "Giving constructive feedback",
    summary: "Make feedback specific, timely, and about behaviour — not the person.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Vague feedback helps no one",
        body: [
          "'Be more proactive' or 'great job' tells people nothing they can act on.",
          "Useful feedback is specific, well-timed, and focused on behaviour and impact — not character.",
          "Done regularly and kindly, it's the fastest way your team improves.",
        ],
      },
      {
        kind: "lesson",
        title: "A simple model: Situation · Behaviour · Impact",
        points: [
          { h: "Situation", p: "Anchor it: 'In this morning's client call…' — not 'you always'." },
          { h: "Behaviour", p: "Describe what you observed, factually: 'you interrupted the client twice'." },
          { h: "Impact", p: "Name the effect: '…and they didn't get to finish their concern'." },
        ],
        note: "End with a question or a request, not a verdict: 'What's your read?' or 'Next time, can we…?'",
      },
      {
        kind: "dragdrop",
        title: "Useful feedback or not?",
        prompt: "Sort each statement into the right bucket.",
        leftLabel: "Specific & usable",
        rightLabel: "Vague or personal",
        items: [
          { text: "'In standup you cut Priya off mid-sentence; she stopped sharing.'", side: "left" },
          { text: "'You're just not a team player.'", side: "right" },
          { text: "'The report had 3 data errors that reached the client.'", side: "left" },
          { text: "'Be more professional.'", side: "right" },
          { text: "'Great work' (and nothing else).", side: "right" },
          { text: "'Your clear agenda kept the meeting to 20 minutes — do that again.'", side: "left" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Your feedback habit right now is…",
        options: [
          { text: "I avoid it until the annual review.", response: "Feedback ages badly. We'll make it small and frequent." },
          { text: "I give it, but it comes out vague or emotional.", response: "The S-B-I model will make it land cleanly." },
          { text: "I give specific feedback close to the moment.", response: "Great. We'll balance it with equally specific praise." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the recurring slip",
        setup: "A team member has missed two internal deadlines this week. You're frustrated and about to message them.",
        question: "What's the most constructive opener?",
        choices: [
          { text: "'You keep missing deadlines. This can't continue.'", feedback: "A verdict about the person. It triggers defensiveness, not problem-solving." },
          { text: "Say nothing and silently lower your trust in them.", feedback: "Avoidance. The behaviour continues and resentment grows on both sides." },
          { text: "'The last two internal deadlines slipped, which pushed others' work. Can we look at what's getting in the way?'", feedback: "Specific behaviour + impact + a door into the cause. That's how change starts.", best: true },
        ],
        followUp: "Curiosity ('what's getting in the way?') usually surfaces a fixable cause.",
      },
      {
        kind: "action",
        title: "Today's action: give one S-B-I",
        intro: "Pick one recent moment — positive or developmental — and say it like this:",
        steps: [
          "Situation: 'In ___…'",
          "Behaviour: 'I noticed you ___.'",
          "Impact: '…and the effect was ___.' Then ask one question.",
        ],
        note: "Aim for more specific praise than criticism. People repeat what gets noticed.",
      },
      {
        kind: "reflect",
        title: "How did the feedback land?",
        scaleQuestion: "How open was the person to your feedback?",
        scaleOptions: ["Defensive", "Neutral", "Receptive", "Grateful"],
        textPrompt: "What made it easier or harder to say than you expected?",
        placeholder: "It was…",
        closing: "Specific, kind, frequent feedback is a gift. Each rep makes the next one easier.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 11
  {
    id: "m11",
    skill: "feedback",
    cluster: "Feedback, coaching & performance",
    title: "Coaching conversations & career growth",
    summary: "Grow people by asking, not telling — and make development concrete.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "The best managers grow people, not just output",
        body: [
          "Telling gives a fast answer once. Coaching builds someone who can find the answer every time.",
          "You don't need to be a certified coach — just curious, and willing to let people think.",
          "Small coaching moments, repeated, compound into real growth.",
        ],
      },
      {
        kind: "compare",
        title: "Telling vs. coaching",
        leftLabel: "Telling",
        rightLabel: "Coaching",
        left: ["'Here's exactly what to do.'", "I own the thinking.", "Fast now, dependent later."],
        right: ["'What options do you see?'", "They own the thinking.", "Slower now, capable later."],
        highlight: "Coach when there's time to grow; tell when it's truly urgent. Most managers tell far too often.",
      },
      {
        kind: "dragdrop",
        title: "Coaching question or disguised advice?",
        prompt: "Sort each line into the right bucket.",
        leftLabel: "Real coaching question",
        rightLabel: "Advice in disguise",
        items: [
          { text: "'What outcome do you actually want here?'", side: "left" },
          { text: "'Don't you think you should just escalate it?'", side: "right" },
          { text: "'What have you already tried?'", side: "left" },
          { text: "'Why wouldn't you just do what I did last time?'", side: "right" },
          { text: "'What's one option you haven't considered yet?'", side: "left" },
          { text: "'Wouldn't it be smarter to do it my way?'", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "In growth conversations, you mostly…",
        options: [
          { text: "Jump straight to advice — it's quicker.", response: "Quick, but they stay dependent. We'll add a few questions first." },
          { text: "Ask a bit, then take over with my solution.", response: "Close — hold the space a little longer before advising." },
          { text: "Ask questions and let them reach their own plan.", response: "Strong coaching instinct. We'll make development concrete too." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: 'I'm stuck on this'",
        setup: "A team member comes to you stuck on a problem. You can see a reasonable answer in about five seconds.",
        question: "What's the most developmental response?",
        choices: [
          { text: "Give them your answer immediately so they can move on.", feedback: "Efficient today, but they'll be back next time with the next problem." },
          { text: "'Figure it out, that's your job.'", feedback: "Abandonment, not coaching. They feel unsupported and may disengage." },
          { text: "'What have you tried, and what feels like the real blocker?' — then guide from there.", feedback: "You build their problem-solving while staying available. Coach first, tell if needed.", best: true },
        ],
        followUp: "If they're truly stuck after a couple of questions, then offer a suggestion — as one option, not the answer.",
      },
      {
        kind: "action",
        title: "Today's action: one growth question",
        intro: "In your next 1:1, spend five minutes on growth, not tasks:",
        steps: [
          "Ask: 'What's one skill you'd like to get better at this quarter?'",
          "Ask: 'What's one small step you could take this week?'",
          "Agree to check in on it — written down somewhere you'll both see.",
        ],
        note: "Development that isn't written down rarely happens.",
      },
      {
        kind: "reflect",
        title: "Did coaching shift the conversation?",
        scaleQuestion: "How much of the thinking did they do (vs. you)?",
        scaleOptions: ["I did it all", "Mostly me", "Shared", "Mostly them"],
        textPrompt: "What did they come up with that you wouldn't have suggested?",
        placeholder: "They thought of…",
        closing: "Every question you ask instead of answering is an investment in someone who needs you less over time.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 12
  {
    id: "m12",
    skill: "feedback",
    cluster: "Feedback, coaching & performance",
    title: "Performance management basics",
    summary: "Set goals, track honestly, and address slipping performance early.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Performance problems grow in silence",
        body: [
          "Most managers wait far too long to address under-performance — hoping it fixes itself.",
          "It rarely does. Early, honest, specific conversations are kinder than a sudden crisis later.",
          "Good performance management is mostly clarity + regular check-ins, not annual paperwork.",
        ],
      },
      {
        kind: "lesson",
        title: "The cycle: agree · track · address",
        points: [
          { h: "Agree goals", p: "A few clear, outcome-based goals everyone understands — not a vague wishlist." },
          { h: "Track honestly", p: "Check progress regularly, with facts, not vibes. No surprises at review time." },
          { h: "Address early", p: "When something slips, name it quickly and specifically, and agree a plan." },
        ],
        note: "Nobody should be shocked by their performance review. If they are, the tracking failed.",
      },
      {
        kind: "dragdrop",
        title: "Strong goal or weak goal?",
        prompt: "Sort each goal into the right bucket.",
        leftLabel: "Clear, trackable goal",
        rightLabel: "Vague goal",
        items: [
          { text: "'Cut average ticket response time to under 4 hours this quarter.'", side: "left" },
          { text: "'Be better at customer service.'", side: "right" },
          { text: "'Ship the onboarding flow by end of March, < 2% error rate.'", side: "left" },
          { text: "'Work harder on quality.'", side: "right" },
          { text: "'Run all 6 client reviews this quarter with a written summary each.'", side: "left" },
          { text: "'Improve, generally.'", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "When someone's performance slips, you…",
        options: [
          { text: "Wait and hope it improves on its own.", response: "The most common — and most costly — choice. We'll act earlier." },
          { text: "Get frustrated, then vent it all at once later.", response: "Bottled-up feedback lands as an ambush. We'll keep it timely." },
          { text: "Name it early, specifically, and agree next steps.", response: "Exactly right. We'll make sure it's documented and fair." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the slow slide",
        setup: "A normally-solid team member's work has dipped for three weeks — later, sloppier. It's noticeable but not a disaster yet.",
        question: "What do you do?",
        choices: [
          { text: "Nothing yet — wait until it's clearly a pattern at review time.", feedback: "By review it'll be entrenched and they'll feel blindsided. Earlier is kinder." },
          { text: "Quietly redistribute their work to others.", feedback: "You hide the problem and overload the team. The person never gets a chance to recover." },
          { text: "Book a supportive 1:1: name what you've seen, ask what's going on, agree a plan.", feedback: "Early, specific, and curious. Often there's a fixable cause — and they feel cared for.", best: true },
        ],
        followUp: "Address the dip while it's still a conversation, not yet a crisis.",
      },
      {
        kind: "action",
        title: "Today's action: a no-surprises check",
        intro: "Pick one team member and do a quick performance pulse:",
        steps: [
          "List their 2–3 current goals — are they still clear and right?",
          "Note one thing going well and one thing to watch, with a specific example.",
          "Raise the 'watch' item in your next 1:1, early and kindly.",
        ],
        note: "Regular small check-ins make the big reviews effortless and fair.",
      },
      {
        kind: "reflect",
        title: "How did addressing it early go?",
        scaleQuestion: "How early did you raise the issue compared to your usual?",
        scaleOptions: ["Same as always (late)", "A bit earlier", "Much earlier", "Right away"],
        textPrompt: "What did you learn about the cause once you actually asked?",
        placeholder: "I found out…",
        closing: "Clear goals plus early, honest conversations make performance management fair — and far less scary for everyone.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 13
  {
    id: "m13",
    skill: "conflict",
    cluster: "Conflict, difficult people & well-being",
    title: "Handling difficult conversations & conflict",
    summary: "Prepare, stay calm, and aim at the problem — not the person.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Avoided conversations don't disappear — they grow",
        body: [
          "The talk you're dreading rarely gets easier by waiting. Small issues become big ones.",
          "Hard conversations go better when you prepare, stay calm, and focus on a shared problem to solve.",
          "You can be kind and direct at the same time.",
        ],
      },
      {
        kind: "lesson",
        title: "Structure a hard conversation",
        points: [
          { h: "Prepare the facts", p: "Know the specific behaviour and impact before you start. Drop the story you've built." },
          { h: "Open without blame", p: "'I'd like to talk about X. Here's what I've seen…' — then pause and listen." },
          { h: "Move to solutions", p: "Once both sides are understood, agree concrete next steps together." },
        ],
        note: "Stay curious about their side. You may be missing context that changes everything.",
      },
      {
        kind: "dragdrop",
        title: "Calms it or escalates it?",
        prompt: "Sort each move into the right bucket.",
        leftLabel: "De-escalates",
        rightLabel: "Escalates",
        items: [
          { text: "'Help me understand what happened from your side.'", side: "left" },
          { text: "'You always do this.'", side: "right" },
          { text: "Lowering your voice and slowing down.", side: "left" },
          { text: "Bringing up five past grievances at once.", side: "right" },
          { text: "'Here's the impact I saw; what's your read?'", side: "left" },
          { text: "Sarcasm or eye-rolling.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Your conflict default is…",
        options: [
          { text: "Avoid — I hope it resolves itself.", response: "Avoidance lets issues fester. We'll make starting feel safer." },
          { text: "Attack — I get sharp and it gets heated.", response: "You care, but heat shuts people down. We'll add structure and calm." },
          { text: "Address it calmly, focused on the problem.", response: "Great. We'll sharpen your prep and listening under pressure." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: two team members clash",
        setup: "Two of your people are openly tense — snippy in meetings, undermining each other. It's affecting the team.",
        question: "What's your best first move?",
        choices: [
          { text: "Tell them both to 'just be professional' and move on.", feedback: "Surface-level. The underlying conflict stays and resurfaces louder." },
          { text: "Pick the one you think is right and back them publicly.", feedback: "Now it's you vs. someone. Trust and fairness both take a hit." },
          { text: "Speak to each privately to understand, then bring them together on shared goals.", feedback: "You gather the real picture, stay neutral, and rebuild a working relationship.", best: true },
        ],
        followUp: "Understand each side privately before any joint conversation — context usually softens the story.",
      },
      {
        kind: "action",
        title: "Today's action: prepare one hard talk",
        intro: "Pick a conversation you've been avoiding. Before it, write:",
        steps: [
          "The specific behaviour + impact (facts, not story).",
          "Your one-line, blame-free opener.",
          "The outcome you want from the conversation.",
        ],
        note: "Then have it — or at least book it. Preparation turns dread into a plan.",
      },
      {
        kind: "reflect",
        title: "How did the conversation go?",
        scaleQuestion: "How calm did you manage to stay?",
        scaleOptions: ["Lost my cool", "Tense", "Mostly calm", "Calm throughout"],
        textPrompt: "What did you learn from their side that you hadn't expected?",
        placeholder: "I learned…",
        closing: "Each hard conversation you handle well makes the next one less scary — and your team more honest.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 14
  {
    id: "m14",
    skill: "conflict",
    cluster: "Conflict, difficult people & well-being",
    title: "Dealing with difficult behaviours",
    summary: "Respond to defensive, disengaged, or dominating behaviour — not labels.",
    minutes: 6,
    screens: [
      {
        kind: "hook",
        title: "There are no 'difficult people' — only behaviours and reasons",
        body: [
          "Labelling someone 'difficult' makes them the problem and stops you looking for the cause.",
          "Behind most difficult behaviour is an unmet need: fear, frustration, or feeling unheard.",
          "Address the behaviour and the cause, and most 'difficult people' become workable.",
        ],
      },
      {
        kind: "lesson",
        title: "Three common patterns",
        points: [
          { h: "Defensive", p: "Reacts to feedback as attack. Need: safety. Lower the threat, separate behaviour from worth." },
          { h: "Disengaged", p: "Does the minimum, checked out. Need: meaning or recognition. Reconnect to purpose and value." },
          { h: "Dominating", p: "Talks over others, takes all the space. Need: to be heard. Acknowledge, then make room for others." },
        ],
        note: "Diagnose the need before you choose the response.",
      },
      {
        kind: "reveal",
        title: "First, avoid pouring fuel on the fire",
        intro: "For each pattern, notice the trap first — then tap to reveal a better move.",
        frontLabel: "Common unhelpful move",
        backLabel: "A better move",
        items: [
          {
            label: "Defensive",
            front: "Telling them 'you're being defensive', or arguing the feedback point by point.",
            back: "Stay calm, acknowledge the feeling, and focus on the specific behaviour and its impact — not their character. If emotions run high, agree to revisit later.",
          },
          {
            label: "Disengaged",
            front: "Ignoring it for months, or giving vague nudges like 'just be more proactive'.",
            back: "Have a clear 1:1 about what you're seeing, ask what's going on, connect their work to goals, and agree 1–2 concrete things to watch together.",
          },
          {
            label: "Dominating",
            front: "Letting them run the room to avoid conflict — or challenging them vaguely and hesitantly.",
            back: "Be direct, specific and respectful about the impact, reset the meeting norms, and give them the right way to contribute.",
          },
        ],
        note: "You can't control their reaction, but you can choose a response that lowers the heat.",
      },
      {
        kind: "dragdrop",
        title: "Match the response to the pattern",
        prompt: "These responses help — sort which behaviour each best fits.",
        leftLabel: "Helps a disengaged person",
        rightLabel: "Helps a dominating person",
        items: [
          { text: "'What part of this work feels most meaningful to you?'", side: "left" },
          { text: "'Great point — let's hear from someone who hasn't spoken yet.'", side: "right" },
          { text: "Reconnecting their task to the customer impact.", side: "left" },
          { text: "'I'll note that and come back to it; first, Sara's view.'", side: "right" },
          { text: "Recognising a small recent contribution sincerely.", side: "left" },
          { text: "Setting a 'one point each, then round-robin' meeting norm.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "When someone's behaviour frustrates you, you tend to…",
        options: [
          { text: "Decide they're just 'like that' and work around them.", response: "Understandable, but it locks the pattern in. We'll look for the need." },
          { text: "Confront the behaviour, but as a personal flaw.", response: "Close — reframe from 'who they are' to 'what they're doing and why'." },
          { text: "Get curious about what's driving it, then respond.", response: "Exactly the mindset that changes difficult dynamics." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the meeting dominator",
        setup: "One team member talks over everyone in meetings. Quieter people have stopped contributing. You need their voices.",
        question: "What's the most effective response?",
        choices: [
          { text: "Publicly tell them to 'let others speak'.", feedback: "Shames them; they get defensive and the room gets tense. Need (to be heard) unmet." },
          { text: "Say nothing and let the pattern continue.", feedback: "The quieter voices stay lost and you lose half the team's thinking." },
          { text: "Acknowledge their input, then deliberately invite others by name — and set a turn-taking norm.", feedback: "Meets their need to be heard while making space. Behaviour shifts without humiliation.", best: true },
        ],
        followUp: "Privately, you can also give them a role: 'I'd love you to draw out the quieter folks.'",
      },
      {
        kind: "scenariopick",
        title: "Practise with the pattern you face most",
        prompt: "Pick the behaviour you're dealing with most right now, then choose your next move.",
        paths: [
          {
            label: "Defensive to feedback",
            setup: "You share specific feedback about missed deadlines. They immediately say: 'That's not fair — everyone's late, and you're only picking on me.'",
            question: "What's your next sentence?",
            choices: [
              { text: "'You're just being defensive again — this is exactly the problem.'", feedback: "Makes them the problem; you'll get more defence, not progress." },
              { text: "'Forget it, it's not a big deal.'", feedback: "Avoids the issue — the pattern repeats and the deadlines don't change." },
              { text: "'I can hear this feels unfair. I still need us to look at these specific deadlines and what we can change going forward.'", feedback: "Acknowledges the emotion, stays calm, and brings focus back to behaviour and next steps.", best: true },
            ],
          },
          {
            label: "Disengaged / checked-out",
            setup: "Over the last month they've been quiet in meetings, missing small tasks, doing the minimum. When you ask how things are, they say 'Fine.'",
            question: "What's the best opening for your next 1:1?",
            choices: [
              { text: "'You need to be more passionate — this isn't a good attitude.'", feedback: "Judges character, not behaviour; likely deepens the disengagement." },
              { text: "'Are you planning to quit?'", feedback: "Puts them on the defensive and skips understanding the cause." },
              { text: "'I've noticed you seem quieter and we've had a few missed follow-throughs. I want to understand what's going on and how I can support you.'", feedback: "Specific observations, curiosity, and shared responsibility for getting back on track.", best: true },
            ],
          },
          {
            label: "Dominant in meetings",
            setup: "In team meetings one person regularly interrupts and dismisses others' ideas. Others have stopped speaking up.",
            question: "What's the best first step?",
            choices: [
              { text: "Call them out sharply in the meeting: 'You need to let other people talk — this is rude.'", feedback: "Public shaming breeds defensiveness and tension." },
              { text: "Avoid it and just invite others more, hoping they take the hint.", feedback: "Hope isn't a plan; the pattern continues." },
              { text: "Have a private conversation: describe specific moments, the impact on others, and reset expectations for balanced participation.", feedback: "Direct, fact-based and respectful — clarifies boundaries without humiliation.", best: true },
            ],
          },
        ],
      },
      {
        kind: "action",
        title: "Today's action: diagnose, don't label",
        intro: "Pick one person whose behaviour frustrates you. Ask yourself:",
        steps: [
          "What's the specific behaviour (not the label)?",
          "What unmet need might be driving it — safety, meaning, or being heard?",
          "What's one small response that addresses the need?",
        ],
        note: "Try that response once this week and watch what shifts.",
      },
      {
        kind: "scriptbuilder",
        title: "Build your own micro-script",
        intro: "Pick one person or situation in mind (no names). Sketch a short 3-part script you'd feel comfortable saying.",
        fields: [
          {
            label: "What you've observed (facts, not labels)",
            hint: "Specific examples over time — e.g. 'When I give feedback, we get stuck on whether it's fair and don't reach next steps.'",
            placeholder: "I've noticed…",
          },
          {
            label: "Impact + what you need instead",
            hint: "Why it's a problem for the work or team, and the clear behaviour you need.",
            placeholder: "This is a problem because… What I need instead is…",
          },
          {
            label: "A curious question / offer of support",
            hint: "Invite their view and offer help.",
            placeholder: "Help me understand what's going on. What would help you do this consistently?",
          },
        ],
        note: "Keep it short and human. Facts, impact, and a genuine question beat a lecture.",
      },
      {
        kind: "reflect",
        title: "Did seeing the need change things?",
        scaleQuestion: "How did the behaviour change after your response?",
        scaleOptions: ["No change", "Slightly", "Noticeably", "Clearly better"],
        textPrompt: "What need turned out to be driving the behaviour?",
        placeholder: "The need was…",
        closing: "When you respond to the need instead of the label, most difficult dynamics start to soften.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 15
  {
    id: "m15",
    skill: "listening",
    cluster: "Conflict, difficult people & well-being",
    title: "Motivation, engagement & well-being",
    summary: "Understand what drives people, recognise effort, and protect against burnout.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Motivation isn't one-size-fits-all",
        body: [
          "Pay matters, but day-to-day motivation comes mostly from autonomy, growth, and feeling valued.",
          "Different people are driven by different things — and quietly burn out for different reasons.",
          "Your attention and recognition are powerful, low-cost tools you're probably underusing.",
        ],
      },
      {
        kind: "lesson",
        title: "What drives engagement",
        points: [
          { h: "Autonomy", p: "Some control over how they work. Micromanagement quietly drains motivation." },
          { h: "Progress & growth", p: "A sense they're improving and the work matters. Recognise visible progress." },
          { h: "Connection & recognition", p: "Feeling seen and valued by you and the team. Specific thanks beats generic praise." },
        ],
        note: "Watch for boundaries and burnout: chronic overwork, withdrawal, or cynicism are signals, not flaws.",
      },
      {
        kind: "dragdrop",
        title: "Builds engagement or risks burnout?",
        prompt: "Sort each manager habit into the right bucket.",
        leftLabel: "Builds engagement",
        rightLabel: "Risks burnout",
        items: [
          { text: "Giving someone ownership of how they hit a goal.", side: "left" },
          { text: "Praising specific, recent work sincerely.", side: "left" },
          { text: "Messaging the team late at night, every night.", side: "right" },
          { text: "Treating 'always on' as the standard.", side: "right" },
          { text: "Noticing and naming someone's growth.", side: "left" },
          { text: "Piling on work with no let-up or thanks.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "How well do you know what drives each person?",
        prompt: "Pick the closest.",
        options: [
          { text: "Honestly, I assume everyone's motivated like me.", response: "A common blind spot. We'll get curious about each person." },
          { text: "I have a rough sense for some of the team.", response: "Good start — a couple of questions will fill the gaps." },
          { text: "I know what drives most of my people individually.", response: "Strong. We'll turn that into tailored recognition." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the quietly fading star",
        setup: "Your strongest performer has gone quiet — less initiative, working long hours, a flatter tone. Output's still okay, for now.",
        question: "What do you do?",
        choices: [
          { text: "Nothing — output is fine, so leave it.", feedback: "These are early burnout signals. By the time output drops, it's often a resignation." },
          { text: "Pile on more, since they 'can handle it'.", feedback: "Rewarding capacity with more load is exactly how you lose your best people." },
          { text: "Check in genuinely: 'I've noticed you seem stretched — how are you really doing?'", feedback: "You catch it early, show you see them, and can adjust load before it breaks.", best: true },
        ],
        followUp: "Your best people often suffer in silence. Notice the change before the crash.",
      },
      {
        kind: "action",
        title: "Today's action: one motivation check",
        intro: "Pick one team member and, this week:",
        steps: [
          "Ask: 'What part of your work energises you most right now?'",
          "Give one specific, sincere piece of recognition.",
          "Notice their workload and stress signals honestly — and act on what you see.",
        ],
        note: "Recognition costs nothing and is consistently under-supplied.",
      },
      {
        kind: "reflect",
        title: "What did you learn about what drives them?",
        scaleQuestion: "How well did your recognition or check-in land?",
        scaleOptions: ["Fell flat", "Okay", "Landed well", "Clearly meaningful"],
        textPrompt: "What motivates this person that you hadn't fully realised?",
        placeholder: "They're driven by…",
        closing: "Engaged, well-rested people do their best work. Protecting that is core management, not a soft extra.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 16
  {
    id: "m16",
    skill: "communication",
    cluster: "Team culture & collaboration",
    title: "Building a high-trust, high-performance team",
    summary: "Set the norms and rituals that make a group into a real team.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Culture is just the behaviour you allow and reward",
        body: [
          "A team isn't built by a values poster — it's built by the small behaviours you model, reward, and tolerate.",
          "High-trust teams agree how they work together: how they decide, disagree, and hold each other accountable.",
          "Make the unspoken rules explicit, and performance follows trust.",
        ],
      },
      {
        kind: "lesson",
        title: "Three foundations of a strong team",
        points: [
          { h: "Working agreements", p: "Shared norms: response times, meeting etiquette, how decisions get made and communicated." },
          { h: "Mutual accountability", p: "People hold each other to commitments — not just you policing everyone." },
          { h: "Collaboration rituals", p: "Regular rhythms (standups, retros, demos) that keep the team aligned and learning." },
        ],
        note: "Co-create the norms with the team. Rules you impose alone rarely stick.",
      },
      {
        kind: "dragdrop",
        title: "Builds team trust or erodes it?",
        prompt: "Sort each manager behaviour.",
        leftLabel: "Builds trust",
        rightLabel: "Erodes trust",
        items: [
          { text: "Following through on commitments you make to the team.", side: "left" },
          { text: "Quietly changing decisions without telling anyone.", side: "right" },
          { text: "Running a blameless retro after a mistake.", side: "left" },
          { text: "Having favourites and showing it.", side: "right" },
          { text: "Co-creating team working agreements together.", side: "left" },
          { text: "Taking credit for the team's wins.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Your team's 'how we work' is…",
        options: [
          { text: "Unspoken — everyone just guesses the norms.", response: "Hidden rules cause friction. We'll make a few explicit." },
          { text: "Set by me, top-down.", response: "Better than nothing — co-creating them will boost buy-in." },
          { text: "Agreed together and revisited.", response: "Strong base. We'll keep the rituals alive and useful." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the broken commitment",
        setup: "A team member repeatedly misses shared deadlines, and it's affecting everyone. The team is watching to see what you'll do.",
        question: "What builds the strongest culture?",
        choices: [
          { text: "Ignore it to avoid awkwardness.", feedback: "The team learns commitments are optional. Your best people quietly disengage." },
          { text: "Call them out harshly in the team channel.", feedback: "Public shaming breaks safety; people start hiding problems instead of fixing them." },
          { text: "Address it directly in private, and reinforce the shared agreement with the team.", feedback: "You protect both the person and the standard. Accountability with respect builds trust.", best: true },
        ],
        followUp: "What you tolerate becomes your culture. Address gaps against agreements you all made.",
      },
      {
        kind: "action",
        title: "Today's action: draft one working agreement",
        intro: "With your team (or as a proposal to them), define one norm:",
        steps: [
          "Pick a friction point (e.g. meeting overload, slow replies, unclear decisions).",
          "Draft one simple agreement to fix it.",
          "Ask the team to refine and commit to it together.",
        ],
        note: "One agreed, followed norm is worth more than a long values document.",
      },
      {
        kind: "reflect",
        title: "Did naming the norm help?",
        scaleQuestion: "How did the team respond to co-creating an agreement?",
        scaleOptions: ["Indifferent", "Mild interest", "Engaged", "Strong buy-in"],
        textPrompt: "What unspoken rule turned out to be causing friction?",
        placeholder: "The hidden rule was…",
        closing: "Great teams aren't lucky — they're built, one explicit agreement and kept commitment at a time.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 17
  {
    id: "m17",
    skill: "communication",
    cluster: "Team culture & collaboration",
    title: "Leading remote & hybrid teams",
    summary: "Create structure, equity, and connection when you're not in the same room.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "Remote doesn't fail from distance — it fails from poor structure",
        body: [
          "When the team isn't together, the casual coordination that happened naturally has to be designed.",
          "Without it, remote people feel invisible and hybrid teams split into two tiers.",
          "Good remote leadership = clear rhythms, deliberate async, and equal visibility for everyone.",
        ],
      },
      {
        kind: "lesson",
        title: "Three remote/hybrid essentials",
        points: [
          { h: "Predictable rhythms", p: "Regular check-ins and updates so no one feels out of the loop or forgotten." },
          { h: "Async by default", p: "Write decisions and context down so people in any timezone can stay aligned." },
          { h: "Equity of presence", p: "In hybrid meetings, make sure remote voices are seen and heard as much as in-room ones." },
        ],
        note: "Over-communicate context. In remote work, silence reads as a problem.",
      },
      {
        kind: "dragdrop",
        title: "Helps remote/hybrid or hurts it?",
        prompt: "Sort each practice.",
        leftLabel: "Helps",
        rightLabel: "Hurts",
        items: [
          { text: "Writing key decisions in a shared doc everyone can see.", side: "left" },
          { text: "Making big calls in hallway chats only in-office people hear.", side: "right" },
          { text: "A predictable weekly written team update.", side: "left" },
          { text: "Letting remote folks struggle to get a word in on calls.", side: "right" },
          { text: "Clear norms on response times and 'offline' hours.", side: "left" },
          { text: "Expecting instant replies across timezones.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "In your remote/hybrid setup…",
        options: [
          { text: "In-office people clearly get more of my attention.", response: "A common trap. We'll level the playing field." },
          { text: "It's okay, but a lot lives in my head or DMs.", response: "Writing more down will unlock the whole team." },
          { text: "We have clear rhythms and async habits.", response: "Strong. We'll keep tightening equity of presence." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the two-tier meeting",
        setup: "In a hybrid meeting, the in-room group dominates the discussion and the remote folks have gone quiet. A decision is forming.",
        question: "What's the best move?",
        choices: [
          { text: "Push the decision through — the room agrees, after all.", feedback: "You've effectively excluded half the team. They'll feel like second-class members." },
          { text: "Note it and move on; remote people can catch up later.", feedback: "'Catch up later' is how remote staff slowly disengage and lose influence." },
          { text: "Pause and bring remote voices in by name before deciding — or take it async.", feedback: "You restore equity and get the full team's input. Better decisions, fairer team.", best: true },
        ],
        followUp: "Default to 'remote-first' habits even in hybrid — they make everything fairer.",
      },
      {
        kind: "action",
        title: "Today's action: one equity upgrade",
        intro: "Pick one of these to do this week:",
        steps: [
          "Move one key decision into a written doc everyone can see and comment on.",
          "In your next hybrid meeting, invite each remote person by name.",
          "Write a short, predictable weekly team update.",
        ],
        note: "Small structure beats good intentions when the team is spread out.",
      },
      {
        kind: "reflect",
        title: "Did the structure change inclusion?",
        scaleQuestion: "How included did your remote team members seem?",
        scaleOptions: ["Left out", "Somewhat", "Mostly included", "Fully included"],
        textPrompt: "What did the quieter / remote members add once you made space?",
        placeholder: "They contributed…",
        closing: "Distance is only a problem without structure. Design the connection and your spread-out team thrives.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 18
  {
    id: "m18",
    skill: "conflict",
    cluster: "Team culture & collaboration",
    title: "Diversity, inclusion & fairness in daily decisions",
    summary: "Catch everyday bias and make your routine calls fairer.",
    minutes: 5,
    screens: [
      {
        kind: "hook",
        title: "Inclusion is built in small, daily decisions",
        body: [
          "Inclusion isn't a once-a-year training — it lives in who you call on, who gets the good projects, and who gets credit.",
          "Everyone has biases; the skill is noticing them before they shape your decisions.",
          "Fairer daily choices unlock the full range of talent on your team.",
        ],
      },
      {
        kind: "lesson",
        title: "Three everyday fairness moves",
        points: [
          { h: "Spot bias traps", p: "Notice 'like me' favouritism, who you interrupt, and whose ideas you credit." },
          { h: "Inclusive meetings", p: "Actively invite quieter and under-represented voices; don't let the loudest set the agenda." },
          { h: "Fair opportunity", p: "Spread stretch projects, visibility, and credit deliberately — not just to your favourites." },
        ],
        note: "You can't remove bias entirely, but you can build habits that check it.",
      },
      {
        kind: "reveal",
        title: "Three everyday traps that quietly shape decisions",
        intro: "Tap each trap to see how it plays out — and one way to counter it.",
        frontLabel: "The trap",
        backLabel: "Why it matters — and the fix",
        items: [
          {
            label: "Similarity bias ('people like me')",
            front: "We naturally trust, listen to, and promote people who feel similar to us in background, style, or interests.",
            back: "Others get fewer chances, less airtime, or less stretch work — even when we don't intend it. Slow down and widen who you consider.",
          },
          {
            label: "Visibility bias ('the ones I see most')",
            front: "We over-rely on the people who are most visible, vocal, or top-of-mind — those in our time zone or who speak up confidently.",
            back: "Quieter, remote, or under-represented people get left out of key work. Deliberately seek out the voices you're not hearing.",
          },
          {
            label: "Status-quo trap ('easier to keep doing this')",
            front: "We keep giving the 'important' tasks to the same people because it feels safer or quicker.",
            back: "Over time some get all the opportunities while others are stuck with low-visibility work. Rotate stretch work deliberately.",
          },
        ],
        note: "You can't delete bias, but you can slow down at key moments and use simple checks.",
      },
      {
        kind: "dragdrop",
        title: "Inclusive or biased?",
        prompt: "Sort each manager habit.",
        leftLabel: "Inclusive / fair",
        rightLabel: "Biased / unfair",
        items: [
          { text: "Rotating who gets high-visibility projects.", side: "left" },
          { text: "Always giving the best work to the person most like you.", side: "right" },
          { text: "Inviting quieter people's input by name.", side: "left" },
          { text: "Crediting the loudest person for a shared idea.", side: "right" },
          { text: "Using the same clear criteria to evaluate everyone.", side: "left" },
          { text: "Judging 'culture fit' on gut feeling alone.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Be honest — your opportunity-sharing is…",
        options: [
          { text: "I give the best chances to whoever I trust most (often similar to me).", response: "Natural, but it narrows your team. We'll widen the circle." },
          { text: "Mostly fair, but I haven't really checked.", response: "Checking is the whole skill. We'll add a simple audit." },
          { text: "Deliberate — I track who gets what.", response: "Excellent. We'll keep refining the criteria you use." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the high-visibility project",
        setup: "A career-making project lands on your desk. Your instinct is to give it to the person you know best — who happens to be a lot like you.",
        question: "What's the fairest approach?",
        choices: [
          { text: "Give it to your go-to person; they're a safe pair of hands.", feedback: "Safe, but you keep handing opportunity to the same person and overlook hidden talent." },
          { text: "Give it to whoever asks loudest.", feedback: "Rewards confidence over capability — and the same voices keep winning." },
          { text: "Define what the project needs, then match it to who'd grow from it — considering everyone.", feedback: "You use criteria, not gut, and spread opportunity. Fairer and better for the team.", best: true },
        ],
        followUp: "Ask: 'Who haven't I given a chance like this lately?'",
      },
      {
        kind: "action",
        title: "Today's action: one fairness check",
        intro: "Do one of these this week:",
        steps: [
          "List who got your last 3 stretch opportunities — notice any pattern.",
          "In your next meeting, draw out one voice you usually don't hear from.",
          "Pick one upcoming decision and write the criteria before you choose.",
        ],
        note: "Small, deliberate checks beat good intentions every time.",
      },
      {
        kind: "reflect",
        title: "What did your fairness check reveal?",
        scaleQuestion: "How even was your opportunity-sharing when you looked?",
        scaleOptions: ["Very uneven", "Somewhat uneven", "Fairly even", "Even"],
        textPrompt: "What pattern or bias did you notice in your own decisions?",
        placeholder: "I noticed…",
        closing: "Inclusive managers get more from their teams because everyone gets a real chance to contribute and grow.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 19
  {
    id: "m19",
    skill: "communication",
    cluster: "Growing into a broader leader",
    title: "Stakeholder management & influence",
    summary: "Lead beyond your team — manage up and influence without authority.",
    minutes: 6,
    screens: [
      {
        kind: "hook",
        title: "Your impact now depends on people you don't manage",
        body: [
          "As you grow, more of your results rely on peers, other teams, and your own boss — people you can't simply direct.",
          "Influence comes from trust, clarity, and understanding what others care about, not from your title.",
          "Managing up well isn't politics — it's making sure your team's work is understood and supported.",
        ],
      },
      {
        kind: "lesson",
        title: "Three influence moves",
        points: [
          { h: "Understand their goals", p: "Know what each stakeholder is measured on and worried about. Frame your ask in their terms." },
          { h: "Manage up proactively", p: "Keep your boss informed — wins, risks, and what you need — before they have to ask." },
          { h: "Build trust before you need it", p: "Reliable follow-through and generosity now create goodwill you can draw on later." },
        ],
        note: "Influence is mostly relationship and clarity, banked in advance.",
      },
      {
        kind: "stakeholdermap",
        title: "Who matters most to your current work?",
        prompt: "Think of one important project or outcome you own. Add the 3–5 people or groups (outside your team) who most affect whether it succeeds — then tag each one's power and interest.",
        hint: "If they can block you, or really care about the outcome, they belong on the list.",
        relationshipOptions: ["My manager", "Another team", "Senior leader", "Customer", "Supplier", "Other"],
        classifications: {
          highHigh: "Priority partner — manage closely and involve them early.",
          highLow: "Keep satisfied — give them what they need, but don't overload them.",
          lowHigh: "Keep informed and engaged — they care and can become allies.",
          lowLow: "Monitor — a light touch is enough for now.",
        },
        note: "This tells you who needs your proactive time and tailored communication.",
      },
      {
        kind: "dragdrop",
        title: "Builds influence or burns it?",
        prompt: "Sort each behaviour.",
        leftLabel: "Builds influence",
        rightLabel: "Burns influence",
        items: [
          { text: "Framing your request around the other team's goals.", side: "left" },
          { text: "Only reaching out when you need a favour.", side: "right" },
          { text: "Giving your boss early warning of a risk.", side: "left" },
          { text: "Surprising your boss with bad news in public.", side: "right" },
          { text: "Following through reliably on small commitments.", side: "left" },
          { text: "Over-promising to look good, then under-delivering.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Your relationship with your manager is…",
        options: [
          { text: "I mostly wait to be asked, then report.", response: "Reactive. We'll make your updates proactive and useful." },
          { text: "I update sometimes, but inconsistently.", response: "A simple rhythm will make you far easier to support." },
          { text: "I keep them ahead of wins, risks, and needs.", response: "Strong managing-up habit. We'll extend it to peers." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: you need another team's help",
        setup: "Your project needs work from a peer's team that's already stretched. You have no authority over them.",
        question: "What's the most effective approach?",
        choices: [
          { text: "Escalate to your boss to force them to prioritise it.", feedback: "Sometimes necessary, but starting here burns goodwill and makes you hard to work with." },
          { text: "Send a demanding message about how urgent it is for you.", feedback: "Framing it around your urgency, not their goals, invites resistance." },
          { text: "Talk to the peer: understand their pressures, frame the ask around shared goals, offer something in return.", feedback: "You build a working relationship and a win-win. Influence over force.", best: true },
        ],
        followUp: "Escalate only after a genuine attempt to align — and bring your boss a clear, fair summary if you do.",
      },
      {
        kind: "action",
        title: "Today's action: one proactive update + one bridge",
        intro: "This week, do both:",
        steps: [
          "Send your manager a short proactive update: a win, a risk, and one thing you need.",
          "Reach out to one peer/stakeholder when you DON'T need anything — just to connect or help.",
          "Note what each of them actually cares about most.",
        ],
        note: "You're banking trust and understanding before you need to spend them.",
      },
      {
        kind: "reflect",
        title: "How did managing up and across feel?",
        scaleQuestion: "How well did your proactive update land with your manager?",
        scaleOptions: ["No real effect", "Mild", "Appreciated", "Clearly valued"],
        textPrompt: "What did you learn about what a key stakeholder really cares about?",
        placeholder: "They care most about…",
        closing: "The broader you lead, the more influence beats authority. Invest in trust before you need it.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 20
  {
    id: "m20",
    skill: "communication",
    cluster: "Growing into a broader leader",
    title: "Leading change (small-scale)",
    summary: "Help your team through change — communicate the why and handle resistance.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "People don't resist change — they resist loss and uncertainty",
        body: [
          "Even small changes — a new tool, process, or priority — can unsettle a team if handled carelessly.",
          "Resistance usually isn't stubbornness; it's unanswered questions: 'Why? What does this mean for me?'",
          "Your job is to give the why, acknowledge the loss, and walk people through the transition.",
        ],
      },
      {
        kind: "lesson",
        title: "Leading a change in 3 steps",
        points: [
          { h: "Explain the why", p: "People accept change they understand. Lead with the reason and the benefit, not just the what." },
          { h: "Acknowledge the loss", p: "Name what's changing and what people might miss. Dismissing it breeds quiet resistance." },
          { h: "Make the path clear", p: "Spell out the first steps, the support available, and what stays the same." },
        ],
        note: "Communicate more than feels necessary, and repeat it. People absorb change slowly.",
      },
      {
        kind: "dragdrop",
        title: "Eases change or fuels resistance?",
        prompt: "Sort each manager move.",
        leftLabel: "Eases change",
        rightLabel: "Fuels resistance",
        items: [
          { text: "Explaining clearly why the change is happening.", side: "left" },
          { text: "'We're doing this because I said so.'", side: "right" },
          { text: "Acknowledging what people will miss about the old way.", side: "left" },
          { text: "Springing the change with no warning.", side: "right" },
          { text: "Inviting questions and concerns openly.", side: "left" },
          { text: "Treating any concern as 'being negative'.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "When you roll out a change, you usually…",
        options: [
          { text: "Announce the what and expect people to adapt.", response: "The why is missing — that's where resistance comes from. We'll add it." },
          { text: "Explain the why, but skip people's concerns.", response: "Close — acknowledging the loss will smooth the path." },
          { text: "Give the why, hear concerns, and guide the transition.", response: "Exactly how good change leaders work." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the new process nobody wanted",
        setup: "Leadership mandates a new tool your team must adopt. You can already feel the eye-rolls and grumbling starting.",
        question: "What's your best move as their manager?",
        choices: [
          { text: "Pass it down flatly: 'New tool from Monday, no choice.'", feedback: "You side-step your role. The team feels unheard and resistance hardens." },
          { text: "Quietly agree it's pointless and let adoption slide.", feedback: "Undermining it sets the team up to fail and you to look out of step." },
          { text: "Explain the why honestly, acknowledge the hassle, and agree how you'll ease the switch together.", feedback: "You bridge leadership and team, validating feelings while moving forward.", best: true },
        ],
        followUp: "You can be honest about the downsides and still lead the change well.",
      },
      {
        kind: "action",
        title: "Today's action: frame one change well",
        intro: "Pick a current or upcoming change. Prepare to tell your team:",
        steps: [
          "The why: 'This is happening because…'",
          "The honest loss: 'What's harder / changing is…'",
          "The path: 'Here's the first step and the support you'll have.'",
        ],
        note: "Then invite their questions — and actually listen to them.",
      },
      {
        kind: "reflect",
        title: "How did your team take the change?",
        scaleQuestion: "How much resistance did you meet after framing it well?",
        scaleOptions: ["Heavy", "Some", "A little", "Smooth"],
        textPrompt: "What concern surfaced once you invited questions?",
        placeholder: "They worried about…",
        closing: "Change is constant. Leading it with honesty and empathy is one of the most valued skills you can build.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 21
  {
    id: "m21",
    skill: "feedback",
    cluster: "Growing into a broader leader",
    title: "Continuous learning & self-reflection",
    summary: "Build the habit of improving yourself the way you grow your team.",
    minutes: 4,
    screens: [
      {
        kind: "hook",
        title: "The best managers keep learning on purpose",
        body: [
          "Management isn't a destination you arrive at — it's a skill you keep refining.",
          "Without deliberate reflection, you repeat the same mistakes and plateau.",
          "A simple habit of seeking feedback and reviewing your own actions compounds into real growth.",
        ],
      },
      {
        kind: "lesson",
        title: "Three habits of growing leaders",
        points: [
          { h: "Reflect regularly", p: "A few honest minutes weekly: what went well, what didn't, what I'll try next." },
          { h: "Seek feedback on yourself", p: "Ask your team and peers how you're doing as a manager — and make it safe to be honest." },
          { h: "Use data, not just gut", p: "Notice patterns in your team's results, engagement, and turnover to guide what you improve." },
        ],
        note: "Model the growth mindset you want from your team — they'll follow what you do, not what you say.",
      },
      {
        kind: "dragdrop",
        title: "Growth habit or growth blocker?",
        prompt: "Sort each behaviour.",
        leftLabel: "Helps you grow",
        rightLabel: "Keeps you stuck",
        items: [
          { text: "Asking your team for honest feedback on your leadership.", side: "left" },
          { text: "Assuming you've 'figured out' managing.", side: "right" },
          { text: "A short weekly reflection on what to do differently.", side: "left" },
          { text: "Treating every mistake as someone else's fault.", side: "right" },
          { text: "Picking one skill to deliberately practise this month.", side: "left" },
          { text: "Avoiding feedback because it might sting.", side: "right" },
        ],
      },
      {
        kind: "selfcheck",
        title: "Your own learning habit is…",
        options: [
          { text: "I rarely stop to reflect — too busy.", response: "Even five minutes weekly changes the trajectory. We'll start small." },
          { text: "I reflect sometimes, but never ask for feedback.", response: "Outside input is the missing piece. We'll make it safe to get it." },
          { text: "I reflect and actively seek feedback on myself.", response: "Excellent. We'll turn insights into deliberate practice." },
        ],
      },
      {
        kind: "scenario",
        title: "Scenario: the surprising feedback",
        setup: "In a skip-level or survey, you learn your team finds you less approachable than you believed. It stings.",
        question: "What's the growth response?",
        choices: [
          { text: "Dismiss it — they just don't see how busy you are.", feedback: "Defensiveness ends learning. The gap stays and trust erodes further." },
          { text: "Hunt for who said it and feel resentful.", feedback: "You make it unsafe to be honest, guaranteeing you won't get the truth again." },
          { text: "Sit with it, thank them for the honesty, and pick one concrete change to make.", feedback: "You model exactly the growth mindset you want — and people notice you act on feedback.", best: true },
        ],
        followUp: "Feedback that stings is usually the most useful. Reward it so it keeps coming.",
      },
      {
        kind: "action",
        title: "Today's action: start a reflection loop",
        intro: "Set up your own learning habit this week:",
        steps: [
          "Block 5 minutes on Friday: 'What worked / what didn't / what I'll try.'",
          "Ask one person you trust: 'What's one thing I could do better as a manager?'",
          "Pick one skill from this journey to deliberately practise next.",
        ],
        note: "Write it down. A reflection habit you can see is one you'll keep.",
      },
      {
        kind: "reflect",
        title: "What did reflecting reveal?",
        scaleQuestion: "How honest were you able to be with yourself?",
        scaleOptions: ["Surface only", "Somewhat", "Pretty honest", "Very honest"],
        textPrompt: "What's the one thing you'll deliberately work on next?",
        placeholder: "I'll work on…",
        closing: "You've reached the end of the journey — but a great manager never stops learning. Keep the loop going.",
      },
    ],
  },

  // ---------------------------------------------------------------- Module 22
  // Capstone (doc: "Putting It All Together"). Reflect across the journey, pick
  // 2–3 focus habits, build a 30-day plan, and commit to a check-in.
  {
    id: "m22",
    skill: "communication",
    cluster: "Putting it all together",
    title: "Putting it all together: your 30-day plan",
    summary: "Turn everything you've learned into 2–3 focus habits for the next 30 days.",
    minutes: 5,
    screens: [
      {
        kind: "hook",
        title: "Great managers don't try to change everything at once",
        body: [
          "You've seen a lot of skills in this journey — mindset, communication, feedback, delegation, conflict, coaching, and more.",
          "Real improvement comes from choosing a few things to practise consistently, not from remembering every tip.",
          "This final module turns your learning into a simple 30-day plan.",
        ],
      },
      {
        kind: "planbuilder",
        title: "Turn your focus into small, repeatable actions",
        intro: "Pick up to three focus areas. For each, choose one small habit and what will help you stick to it. Keep it small enough that you'll actually do it.",
        areaOptions: [
          "Clarity & expectations",
          "Feedback & difficult conversations",
          "Listening & coaching",
          "Delegation & trust",
          "Time & priority management",
          "Team climate & safety",
          "Managing up & stakeholders",
          "Leading change / remote",
        ],
        habitHints: [
          { area: "Clarity & expectations", hint: "e.g. Define 'done' clearly for at least one task per day." },
          { area: "Feedback & difficult conversations", hint: "e.g. Give one piece of specific, kind feedback each week." },
          { area: "Listening & coaching", hint: "e.g. Use one coaching question in every 1:1." },
          { area: "Delegation & trust", hint: "e.g. Delegate one task with clear ownership each week." },
          { area: "Time & priority management", hint: "e.g. Protect two focus blocks per week." },
          { area: "Team climate & safety", hint: "e.g. Thank people for speaking up about risks." },
          { area: "Managing up & stakeholders", hint: "e.g. Send a short weekly update with progress + risks." },
          { area: "Leading change / remote", hint: "e.g. Name one team norm clearly this month." },
        ],
        habitPrompt: "One small behaviour I'll practise",
        supportPrompt: "What will help you remember and stick to this?",
        maxRows: 3,
        note: "Your plan doesn't have to be perfect — just small enough that you can actually do it.",
      },
      {
        kind: "commit",
        title: "Your 30-day manager challenge",
        intro: "You've chosen your focus and your habits. Now set a check-in so it sticks.",
        question: "When will you check in on your progress?",
        options: ["Weekly (recommended)", "After 30 days", "I'm not sure yet"],
        closing: "You can always adjust the plan. The important thing is to start and pay attention.",
      },
      {
        kind: "reflect",
        title: "30-day check-in: what changed?",
        scaleQuestion: "For the areas you chose, how much did you practise your habits?",
        scaleOptions: ["Barely at all", "A little", "Quite often", "Consistently"],
        textPrompt: "What's one thing that feels easier or better as a manager now, compared to 30 days ago?",
        placeholder: "What feels easier now is…",
        closing: "Leadership is built in small cycles of practice, reflection, and adjustment. You're doing the work.",
      },
    ],
  },
];

// Helpers -------------------------------------------------------------------
export const MODULE_IDS: string[] = MODULES.map((m) => m.id);
export function getModule(id: string | null | undefined): ManagerModule | undefined {
  return MODULES.find((m) => m.id === id);
}

// All curriculum clusters are now authored. Add names here to show future
// (unauthored) clusters as locked in the journey.
export const LOCKED_CLUSTERS: string[] = [];
