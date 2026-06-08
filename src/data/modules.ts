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
];

// Helpers -------------------------------------------------------------------
export const MODULE_IDS: string[] = MODULES.map((m) => m.id);
export function getModule(id: string | null | undefined): ManagerModule | undefined {
  return MODULES.find((m) => m.id === id);
}

// Clusters not yet authored — shown locked in the journey.
export const LOCKED_CLUSTERS: string[] = [
  "Feedback, coaching & performance",
  "Conflict, difficult people & well-being",
  "Team culture & collaboration",
  "Growing into a broader leader",
];
