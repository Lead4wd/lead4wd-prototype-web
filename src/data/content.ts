// ============================================================================
// Lead4wd — content & localisation model
// ----------------------------------------------------------------------------
// Single source of all user-facing copy + the skill model. Switches live
// between English / Hindi / Telugu. Aligned with the product docs: 5 manager
// skills (scored 1–5 → Focus / Developing / Strength), a 1–5 behavioural skills
// check, a 12-week journey, daily micro-lessons (action + reflection), and an
// anonymous Team Pulse.
//
// Journey weeks/lessons carry stable IDs; their done/now/locked state is derived
// at runtime from the user's progress (see src/lib/progress.ts), not stored here.
// ============================================================================

export type LanguageCode = "en" | "hi" | "te";

export type SkillId =
  | "communication"
  | "listening"
  | "delegation"
  | "feedback"
  | "conflict";

export type SkillLevel = "strength" | "developing" | "focus";
export type WeekState = "done" | "now" | "next" | "locked";
export type BarTone = "good" | "acc" | "normal";

// --- Skill scoring -----------------------------------------------------------
export const SKILL_ORDER: SkillId[] = [
  "communication",
  "listening",
  "feedback",
  "delegation",
  "conflict",
];

// Seed scores (1–5) shown before the learner re-takes the check.
export const DEFAULT_SCORES: Record<SkillId, number> = {
  communication: 4.1,
  listening: 3.9,
  feedback: 2.6,
  delegation: 1.7,
  conflict: 1.5,
};

export function levelFromScore(score: number): SkillLevel {
  if (score >= 3.8) return "strength";
  if (score >= 2.6) return "developing";
  return "focus";
}

export function pctFromScore(score: number): number {
  return Math.round((score / 5) * 100);
}

// ----------------------------------------------------------------------------
// Content shape
// ----------------------------------------------------------------------------
type ScaleOption = { n: number; label: string };
type AssessmentQuestion = { skill: SkillId; text: string };
type JourneyLesson = { id: string; title: string };
type JourneyWeek = {
  id: string;
  label: string;
  locked?: boolean;
  title: string;
  subtitle: string;
  lessons: JourneyLesson[];
};
type JourneyPhase = { number: string; title: string; weeks: JourneyWeek[] };
type PulseRow = { name: string; pct: number; score: string; tone: BarTone };
type PulseBar = { label: string; pct: number; tone: BarTone };
type PulseQuote = { text: string; by: string };
type OnboardingQuestion = { text: string; options: string[] };

export type Content = {
  nav: {
    coaching: string;
    insight: string;
    home: string;
    journey: string;
    journeyBadge: string;
    lesson: string;
    results: string;
    team: string;
    assessment: string;
  };
  topbar: { search: string; streakLabel: string }; // streakLabel: "{n}-day streak"
  profile: { name: string; role: string };
  pageTitles: Record<
    "dashboard" | "journey" | "lesson" | "results" | "team" | "assessment",
    string
  >;
  levels: { strength: string; developing: string; focus: string };
  weekStates: { done: string; now: string; next: string; locked: string };
  skillNames: Record<SkillId, string>;
  skillShort: Record<SkillId, string>;
  common: {
    minRead: string; // "{n} min read"
    oneAction: string;
    endsAction: string;
    back: string;
    startLesson: string;
  };
  onboarding: {
    eyebrow: string;
    title: string;
    sub: string;
    questions: OnboardingQuestion[];
    skip: string;
    back: string;
    next: string;
    finish: string;
    stepLabel: string;
  };
  auth: {
    eyebrow: string;
    title: string;
    sub: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    remember: string;
    forgot: string;
    login: string;
    google: string;
    noAccount: string;
    signUp: string;
    dummy: string;
  };
  dashboard: {
    eyebrowDate: string;
    greeting: string;
    sub: string;
    continueCta: string;
    nextStepKicker: string;
    nextStepTitle: string;
    nextStepDesc: string;
    planLabel: string;
    lessonsCompleted: string;
    actionsTried: string;
    focusEyebrow: string;
    streakTitle: string;
    seeJourney: string;
    weekdaysShort: string[]; // Sun … Sat (index = Date.getDay())
    todayLabel: string;
    teamTitle: string;
    openTeam: string;
    pulseEyebrow: string;
    pulseRows: PulseRow[];
    coachEyebrow: string;
    coachNote: string;
  };
  journey: {
    eyebrow: string;
    title: string;
    pillTemplate: string; // "→ Week {week} in progress · {pct}% complete"
    resume: string;
    phases: JourneyPhase[];
  };
  lesson: {
    progress: string;
    eyebrow: string;
    title: string;
    minutes: number;
    body: string[];
    quote: string;
    actionKicker: string;
    actionText: string;
    reflectHeading: string;
    reflectPrompt: string;
    reflectPlaceholder: string;
    foot: string;
    saveForLater: string;
    markComplete: string;
    allCaughtUp: string; // shown when every unlocked lesson is done
    lessonLabel: string; // "Lesson {n}"
    footTemplate: string; // "Lesson {n} of {total} · {week}"
  };
  assessment: {
    exit: string;
    hint: string;
    intro: string;
    scale: ScaleOption[];
    questions: AssessmentQuestion[];
    previous: string;
    next: string;
    finish: string;
    counter: string; // "{n} / {total}"
  };
  results: {
    eyebrow: string;
    title: string;
    lede: string;
    startEyebrow: string;
    startTitle: string;
    startDesc: string;
    startCta: string;
    recheckEyebrow: string;
    recheckText: string;
    recheckCta: string;
  };
  team: {
    eyebrow: string;
    title: string;
    sendCta: string;
    overallEyebrow: string;
    overallScore: string;
    overallOf: string;
    overallLabel: string;
    bars: PulseBar[];
    changedEyebrow: string;
    changedText: string;
    pills: { label: string; tone: BarTone }[];
    wordsTitle: string;
    anon: string;
    quotes: PulseQuote[];
    dummyNote: string;
    dummyClose: string;
  };
  language: { label: string; en: string; hi: string; te: string };
};

// ============================================================================
// ENGLISH
// ============================================================================
const en: Content = {
  nav: {
    coaching: "Coaching",
    insight: "Insight",
    home: "Home",
    journey: "My journey",
    journeyBadge: "W2",
    lesson: "Today's lesson",
    results: "Skills profile",
    team: "Team Pulse",
    assessment: "Re-take check",
  },
  topbar: { search: "Search lessons & skills", streakLabel: "{n}-day streak" },
  profile: { name: "User", role: "Team lead · Pro" },
  pageTitles: {
    dashboard: "Home",
    journey: "Your 90-day journey",
    lesson: "Lesson",
    results: "Your results",
    team: "Team Pulse",
    assessment: "Skills check",
  },
  levels: { strength: "Strength", developing: "Developing", focus: "Focus area" },
  weekStates: { done: "Done", now: "In progress", next: "Up next", locked: "Locked" },
  skillNames: {
    communication: "Communication & clarity",
    listening: "Active listening",
    delegation: "Delegation & ownership",
    feedback: "Feedback & coaching",
    conflict: "Difficult conversations",
  },
  skillShort: {
    communication: "Communication",
    listening: "Listening",
    delegation: "Delegation",
    feedback: "Feedback",
    conflict: "Conflict",
  },
  common: {
    minRead: "{n} min read",
    oneAction: "1 action",
    endsAction: "Ends with 1 action",
    back: "Back",
    startLesson: "Start lesson",
  },
  onboarding: {
    eyebrow: "Welcome to Lead4wd",
    title: "Let's set up your coaching.",
    sub: "Two quick questions so your first weeks fit how you actually work.",
    questions: [
      {
        text: "What's your main goal for using Lead4wd?",
        options: [
          "I'm a new manager and want guidance",
          "I want to communicate more clearly",
          "I need help with team conflict",
          "I want to delegate more effectively",
        ],
      },
      {
        text: "How much time can you give each week?",
        options: [
          "10–15 minutes (micro-learning)",
          "30–60 minutes",
          "1–2 hours",
          "More than 2 hours",
        ],
      },
    ],
    skip: "Skip",
    back: "Back",
    next: "Continue",
    finish: "Continue to sign in",
    stepLabel: "Step {n} of {total}",
  },
  auth: {
    eyebrow: "Please enter your details",
    title: "Welcome back",
    sub: "This is a prototype — any details take you straight in.",
    emailPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    remember: "Remember for 30 days",
    forgot: "Forgot password?",
    login: "Log in",
    google: "Continue with Google",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    dummy: "This is a dummy button",
  },
  dashboard: {
    eyebrowDate: "Week {week} of 12",
    greeting: "Good morning, User.",
    sub: "You're building two habits this week — feedback and delegation. One small action today keeps the streak alive.",
    continueCta: "Continue today's lesson →",
    nextStepKicker: "YOUR NEXT BEST STEP · 4 MIN",
    nextStepTitle: "Give feedback that lands the same day",
    nextStepDesc:
      "Specific, timely feedback is the fastest way to build trust. Today's lesson gives you one line to try in your next 1:1.",
    planLabel: "Plan",
    lessonsCompleted: "lessons completed",
    actionsTried: "actions tried",
    focusEyebrow: "This week's focus",
    streakTitle: "Your streak",
    seeJourney: "See full journey →",
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    todayLabel: "Today",
    teamTitle: "How your team feels",
    openTeam: "Open Team Pulse →",
    pulseEyebrow: "Latest pulse · 0 anonymous replies",
    pulseRows: [
      { name: "Listens well", pct: 0, score: "0.0", tone: "good" },
      { name: "Clear goals", pct: 0, score: "0.0", tone: "normal" },
      { name: "Fair feedback", pct: 0, score: "0.0", tone: "acc" },
    ],
    coachEyebrow: "Coach's note",
    coachNote:
      "Your team rates listening highly — lean on it. Fair feedback is your biggest opportunity, which is exactly what this week targets.",
  },
  journey: {
    eyebrow: "12-week plan · personalised to your skills check",
    title: "Your 90-day journey",
    pillTemplate: "→ Week {week} in progress · {pct}% complete",
    resume: "Resume →",
    phases: [
      {
        number: "Phase 01",
        title: "Foundations",
        weeks: [
          {
            id: "w1",
            label: "WEEK 01",
            title: "Listening to understand",
            subtitle: "Drop the urge to fix. Hear the whole thing first.",
            lessons: [
              { id: "w1l1", title: "The 3-second pause" },
              { id: "w1l2", title: "Reflecting back" },
              { id: "w1l3", title: "Asking, not telling" },
            ],
          },
          {
            id: "w2",
            label: "WEEK 02",
            title: "Feedback that lands",
            subtitle: "Specific, kind, and same-day. Make it a habit.",
            lessons: [
              { id: "w2l1", title: "Why feedback feels hard" },
              { id: "w2l2", title: "Name the behaviour, not the person" },
              { id: "w2l3", title: "The same-day rule" },
            ],
          },
          {
            id: "w3",
            label: "WEEK 03",
            title: "Delegating with trust",
            subtitle: "Hand over the outcome, not just the task.",
            lessons: [
              { id: "w3l1", title: "What only you can do" },
              { id: "w3l2", title: "Briefing for ownership" },
              { id: "w3l3", title: "Checking in without hovering" },
            ],
          },
        ],
      },
      {
        number: "Phase 02",
        title: "Hard moments",
        weeks: [
          {
            id: "w4",
            label: "WEEK 04–05",
            locked: true,
            title: "Difficult conversations",
            subtitle: "Prepare, stay calm, and land on a clear next step.",
            lessons: [
              { id: "w4l1", title: "Opening without the flinch" },
              { id: "w4l2", title: "Holding the line, kindly" },
            ],
          },
          {
            id: "w5",
            label: "WEEK 06–07",
            locked: true,
            title: "Coaching your team",
            subtitle: "Grow people by asking better questions.",
            lessons: [
              { id: "w5l1", title: "The GROW conversation" },
              { id: "w5l2", title: "Goals that stick" },
            ],
          },
          {
            id: "w6",
            label: "WEEK 08+",
            locked: true,
            title: "Leading, not managing",
            subtitle: "Set direction, build trust, and step back.",
            lessons: [
              { id: "w6l1", title: "Your operating rhythm" },
              { id: "w6l2", title: "Re-checking your skills" },
            ],
          },
        ],
      },
    ],
  },
  lesson: {
    progress: "2 / 3",
    eyebrow: "Feedback & coaching · Lesson 2",
    title: "Name the behaviour, not the person.",
    minutes: 4,
    body: [
      'The fastest way to make feedback land is to take the person out of it. "You’re disorganised" is a verdict — it invites defence. Pointing at what you actually saw invites a fix.',
      "That sentence does three things at once: it’s specific (one event, not a pattern), it’s observable (you both saw it), and it names the impact (the client noticed). Nobody has to agree on character — just on facts.",
      "Save the labels. Describe the behaviour and its effect, then go quiet and let them respond. You’ll be surprised how often they reach the conclusion before you do.",
    ],
    quote: '"The deck went out with last month’s numbers, and the client noticed."',
    actionKicker: "YOUR ACTION · TRY IT IN YOUR NEXT 1:1",
    actionText:
      "Give one piece of specific feedback within a day of the work happening.",
    reflectHeading: "Quick reflection",
    reflectPrompt:
      "Which recent moment came to mind as you read this? (Just for you — it’s private.)",
    reflectPlaceholder: "Last week, when the report…",
    foot: "Lesson 2 of 3 · Week 2",
    saveForLater: "Save for later",
    markComplete: "Mark complete · keep streak 🔥",
    allCaughtUp: "You're all caught up — great work. New lessons unlock as your journey continues.",
    lessonLabel: "Lesson {n}",
    footTemplate: "Lesson {n} of {total} · {week}",
  },
  assessment: {
    exit: "Exit",
    hint: "Think about the last 3 months — answer for what actually happened, not what you intend to do.",
    intro:
      "Honest answers = better coaching. If you mark everything as perfect, the app can't help you grow.",
    scale: [
      { n: 1, label: "Almost never" },
      { n: 2, label: "Rarely" },
      { n: 3, label: "Sometimes" },
      { n: 4, label: "Often" },
      { n: 5, label: "Almost always" },
    ],
    questions: [
      { skill: "communication", text: "When I explain goals or tasks, my team can repeat back what success looks like in their own words." },
      { skill: "communication", text: "At the end of meetings, I confirm who is doing what by when, so people don't need to ask me again later." },
      { skill: "communication", text: "When I share a change or decision, I also explain the 'why', not just the instructions." },
      { skill: "listening", text: "In 1:1s, I give my full attention — no notifications, no multitasking — and my team does most of the talking." },
      { skill: "listening", text: "When someone shares a concern, I ask questions to understand their view before suggesting solutions." },
      { skill: "listening", text: "In the last month, someone has told me — directly or indirectly — that they feel heard by me." },
      { skill: "delegation", text: "In the last month, I've given a meaningful task to someone and let them own it without stepping back in to fix it." },
      { skill: "delegation", text: "When I delegate, I'm clear about the outcome, the timeline, and what they can decide on their own." },
      { skill: "delegation", text: "My team can keep making progress even if I'm in back-to-back meetings or out for a day." },
      { skill: "feedback", text: "In the last 4 weeks, I've given specific feedback — what they did and the impact it had — to a team member." },
      { skill: "feedback", text: "I don't wait for formal reviews; I give small pieces of feedback during or right after the work." },
      { skill: "feedback", text: "I ask my team about their goals and help them see what will get them there." },
      { skill: "conflict", text: "When I notice tension or repeated issues between people, I bring it up rather than hoping it disappears." },
      { skill: "conflict", text: "In tough conversations, I stay calm and focused on the issue, not the person, even when emotions run high." },
      { skill: "conflict", text: "In the last 3 months, I've had at least one direct, honest conversation about performance or behaviour." },
    ],
    previous: "← Previous",
    next: "Next →",
    finish: "See results →",
    counter: "{n} / {total}",
  },
  results: {
    eyebrow: "Your skills profile · last checked today",
    title: "Two strengths to build on, two to focus on.",
    lede: "Levels are based on your honest answers — not a score to beat. Your journey is already built around your focus areas.",
    startEyebrow: "We'll start here",
    startTitle: "Delegation & Difficult conversations",
    startDesc: "These two are woven into your first weeks, then revisited so the gains stick.",
    startCta: "View my journey →",
    recheckEyebrow: "Re-check rhythm",
    recheckText: "We'll prompt a fresh skills check every 30 days so you can watch these bars move.",
    recheckCta: "Re-take now",
  },
  team: {
    eyebrow: "Anonymous · 3 of 5 replied · sent 4 days ago",
    title: "Team Pulse",
    sendCta: "Send a new pulse →",
    overallEyebrow: "Overall this month",
    overallScore: "4.0",
    overallOf: " / 5",
    overallLabel: "Average across all questions · ▲ 0.3 vs last pulse",
    bars: [
      { label: "Listening", pct: 84, tone: "good" },
      { label: "Clarity", pct: 72, tone: "normal" },
      { label: "Feedback", pct: 64, tone: "acc" },
      { label: "Support", pct: 78, tone: "normal" },
      { label: "Trust", pct: 80, tone: "good" },
    ],
    changedEyebrow: "What changed",
    changedText:
      "Your feedback score rose after Week 2 — the same-day rule is working. Clarity on goals is now your lowest; consider it for your next focus block.",
    pills: [
      { label: "↑ Feedback +0.6", tone: "good" },
      { label: "↓ Clarity −0.1", tone: "normal" },
    ],
    wordsTitle: "In their words",
    anon: "Anonymous",
    quotes: [
      { text: '"She actually listens in 1:1s now — it doesn’t feel like she’s waiting to talk."', by: "— Pulse question: Listening" },
      { text: '"Feedback comes faster and it’s specific, which helps. Sometimes I’m still unsure what the top priority is for the week."', by: "— Pulse question: Clarity" },
      { text: '"Good at backing us up when things go wrong."', by: "— Pulse question: Support" },
    ],
    dummyNote:
      "This is a dummy. Sending a real anonymous pulse to your team needs a backend, which this prototype doesn't have yet.",
    dummyClose: "Got it",
  },
  language: { label: "Language", en: "English", hi: "हिन्दी", te: "తెలుగు" },
};

// ============================================================================
// HINDI
// ============================================================================
const hi: Content = {
  nav: {
    coaching: "कोचिंग",
    insight: "अंतर्दृष्टि",
    home: "होम",
    journey: "मेरी यात्रा",
    journeyBadge: "स2",
    lesson: "आज का पाठ",
    results: "कौशल प्रोफ़ाइल",
    team: "टीम पल्स",
    assessment: "दोबारा जाँच",
  },
  topbar: { search: "पाठ और कौशल खोजें", streakLabel: "{n}-दिन की लय" },
  profile: { name: "उपयोगकर्ता", role: "टीम लीड · प्रो" },
  pageTitles: {
    dashboard: "होम",
    journey: "आपकी 90-दिन की यात्रा",
    lesson: "पाठ",
    results: "आपके परिणाम",
    team: "टीम पल्स",
    assessment: "कौशल जाँच",
  },
  levels: { strength: "मज़बूती", developing: "विकासशील", focus: "फोकस क्षेत्र" },
  weekStates: { done: "पूर्ण", now: "जारी है", next: "अगला", locked: "लॉक" },
  skillNames: {
    communication: "संचार और स्पष्टता",
    listening: "सक्रिय श्रवण",
    delegation: "प्रत्यायोजन और स्वामित्व",
    feedback: "फीडबैक और कोचिंग",
    conflict: "कठिन बातचीत",
  },
  skillShort: {
    communication: "संचार",
    listening: "श्रवण",
    delegation: "प्रत्यायोजन",
    feedback: "फीडबैक",
    conflict: "टकराव",
  },
  common: {
    minRead: "{n} मिनट पढ़ें",
    oneAction: "1 कार्य",
    endsAction: "1 कार्य के साथ समाप्त",
    back: "वापस",
    startLesson: "पाठ शुरू करें",
  },
  onboarding: {
    eyebrow: "Lead4wd में आपका स्वागत है",
    title: "आइए आपकी कोचिंग सेट करें।",
    sub: "दो छोटे सवाल, ताकि आपके पहले हफ़्ते आपके काम करने के तरीके से मेल खाएँ।",
    questions: [
      {
        text: "Lead4wd इस्तेमाल करने का आपका मुख्य लक्ष्य क्या है?",
        options: [
          "मैं नया प्रबंधक हूँ और मार्गदर्शन चाहता/चाहती हूँ",
          "मैं और स्पष्ट रूप से संवाद करना चाहता/चाहती हूँ",
          "मुझे टीम के टकराव में मदद चाहिए",
          "मैं और प्रभावी ढंग से काम सौंपना चाहता/चाहती हूँ",
        ],
      },
      {
        text: "आप हर हफ़्ते कितना समय दे सकते हैं?",
        options: ["10–15 मिनट (माइक्रो-लर्निंग)", "30–60 मिनट", "1–2 घंटे", "2 घंटे से अधिक"],
      },
    ],
    skip: "छोड़ें",
    back: "वापस",
    next: "जारी रखें",
    finish: "साइन इन पर जाएँ",
    stepLabel: "चरण {n} / {total}",
  },
  auth: {
    eyebrow: "कृपया अपना विवरण दर्ज करें",
    title: "वापसी पर स्वागत है",
    sub: "यह एक प्रोटोटाइप है — कोई भी विवरण आपको सीधे अंदर ले जाएगा।",
    emailPlaceholder: "ईमेल पता",
    passwordPlaceholder: "पासवर्ड",
    remember: "30 दिनों तक याद रखें",
    forgot: "पासवर्ड भूल गए?",
    login: "लॉग इन",
    google: "Google से जारी रखें",
    noAccount: "खाता नहीं है?",
    signUp: "साइन अप",
    dummy: "यह एक डमी बटन है",
  },
  dashboard: {
    eyebrowDate: "12 में से सप्ताह {week}",
    greeting: "सुप्रभात, उपयोगकर्ता।",
    sub: "इस हफ़्ते आप दो आदतें बना रहे हैं — फीडबैक और प्रत्यायोजन। आज एक छोटा कदम लय को बनाए रखता है।",
    continueCta: "आज का पाठ जारी रखें →",
    nextStepKicker: "आपका अगला बेहतरीन कदम · 4 मिनट",
    nextStepTitle: "उसी दिन असर करने वाला फीडबैक दें",
    nextStepDesc:
      "विशिष्ट और समय पर दिया गया फीडबैक भरोसा बनाने का सबसे तेज़ तरीका है। आज का पाठ आपको अगली 1:1 में आज़माने के लिए एक पंक्ति देता है।",
    planLabel: "योजना",
    lessonsCompleted: "पाठ पूर्ण",
    actionsTried: "कार्य आज़माए",
    focusEyebrow: "इस हफ़्ते का फोकस",
    streakTitle: "आपकी लय",
    seeJourney: "पूरी यात्रा देखें →",
    weekdaysShort: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
    todayLabel: "आज",
    teamTitle: "आपकी टीम कैसा महसूस करती है",
    openTeam: "टीम पल्स खोलें →",
    pulseEyebrow: "नवीनतम पल्स · 0 गुमनाम उत्तर",
    pulseRows: [
      { name: "अच्छे से सुनते हैं", pct: 0, score: "0.0", tone: "good" },
      { name: "स्पष्ट लक्ष्य", pct: 0, score: "0.0", tone: "normal" },
      { name: "निष्पक्ष फीडबैक", pct: 0, score: "0.0", tone: "acc" },
    ],
    coachEyebrow: "कोच की टिप्पणी",
    coachNote:
      "आपकी टीम सुनने को ऊँचा आँकती है — इसका लाभ उठाएँ। निष्पक्ष फीडबैक आपका सबसे बड़ा अवसर है, और यही इस हफ़्ते का लक्ष्य है।",
  },
  journey: {
    eyebrow: "12-सप्ताह की योजना · आपकी कौशल जाँच के अनुसार",
    title: "आपकी 90-दिन की यात्रा",
    pillTemplate: "→ सप्ताह {week} जारी · {pct}% पूर्ण",
    resume: "जारी रखें →",
    phases: [
      {
        number: "चरण 01",
        title: "बुनियाद",
        weeks: [
          {
            id: "w1",
            label: "सप्ताह 01",
            title: "समझने के लिए सुनना",
            subtitle: "सुधारने की जल्दी छोड़ें। पहले पूरी बात सुनें।",
            lessons: [
              { id: "w1l1", title: "3-सेकंड का ठहराव" },
              { id: "w1l2", title: "दोहराकर पुष्टि करना" },
              { id: "w1l3", title: "बताना नहीं, पूछना" },
            ],
          },
          {
            id: "w2",
            label: "सप्ताह 02",
            title: "असर करने वाला फीडबैक",
            subtitle: "विशिष्ट, सौम्य और उसी दिन। इसे आदत बनाएँ।",
            lessons: [
              { id: "w2l1", title: "फीडबैक मुश्किल क्यों लगता है" },
              { id: "w2l2", title: "व्यक्ति नहीं, व्यवहार का नाम लें" },
              { id: "w2l3", title: "उसी-दिन का नियम" },
            ],
          },
          {
            id: "w3",
            label: "सप्ताह 03",
            title: "भरोसे के साथ काम सौंपना",
            subtitle: "सिर्फ़ काम नहीं, परिणाम सौंपें।",
            lessons: [
              { id: "w3l1", title: "जो केवल आप कर सकते हैं" },
              { id: "w3l2", title: "स्वामित्व के लिए ब्रीफ़िंग" },
              { id: "w3l3", title: "बिना मँडराए जाँच करना" },
            ],
          },
        ],
      },
      {
        number: "चरण 02",
        title: "कठिन पल",
        weeks: [
          {
            id: "w4",
            label: "सप्ताह 04–05",
            locked: true,
            title: "कठिन बातचीत",
            subtitle: "तैयारी करें, शांत रहें, और एक स्पष्ट अगले कदम पर पहुँचें।",
            lessons: [
              { id: "w4l1", title: "बिना झिझक शुरुआत" },
              { id: "w4l2", title: "सौम्यता से अपनी बात पर टिके रहना" },
            ],
          },
          {
            id: "w5",
            label: "सप्ताह 06–07",
            locked: true,
            title: "अपनी टीम को कोचिंग",
            subtitle: "बेहतर सवाल पूछकर लोगों को आगे बढ़ाएँ।",
            lessons: [
              { id: "w5l1", title: "GROW बातचीत" },
              { id: "w5l2", title: "टिकने वाले लक्ष्य" },
            ],
          },
          {
            id: "w6",
            label: "सप्ताह 08+",
            locked: true,
            title: "प्रबंधन नहीं, नेतृत्व",
            subtitle: "दिशा तय करें, भरोसा बनाएँ, और पीछे हटें।",
            lessons: [
              { id: "w6l1", title: "आपकी कार्य-लय" },
              { id: "w6l2", title: "अपने कौशल की दोबारा जाँच" },
            ],
          },
        ],
      },
    ],
  },
  lesson: {
    progress: "2 / 3",
    eyebrow: "फीडबैक और कोचिंग · पाठ 2",
    title: "व्यक्ति नहीं, व्यवहार का नाम लें।",
    minutes: 4,
    body: [
      'फीडबैक को असरदार बनाने का सबसे तेज़ तरीका है उसमें से व्यक्ति को हटा देना। "तुम अव्यवस्थित हो" एक फ़ैसला है — यह बचाव को बुलावा देता है। जो आपने सचमुच देखा उसे बताना, सुधार को बुलावा देता है।',
      "वह वाक्य एक साथ तीन काम करता है: यह विशिष्ट है (एक घटना, कोई पैटर्न नहीं), यह देखा जा सकने वाला है (आप दोनों ने देखा), और यह असर बताता है (ग्राहक ने ध्यान दिया)। चरित्र पर सहमत होने की ज़रूरत नहीं — सिर्फ़ तथ्यों पर।",
      "लेबल छोड़ दें। व्यवहार और उसका असर बताएँ, फिर चुप हो जाएँ और उन्हें जवाब देने दें। आप हैरान होंगे कि कितनी बार वे आपसे पहले ही नतीजे तक पहुँच जाते हैं।",
    ],
    quote: '"प्रस्तुति पिछले महीने के आँकड़ों के साथ चली गई, और ग्राहक ने ध्यान दिया।"',
    actionKicker: "आपका कार्य · इसे अपनी अगली 1:1 में आज़माएँ",
    actionText: "काम होने के एक दिन के भीतर एक विशिष्ट फीडबैक दें।",
    reflectHeading: "त्वरित चिंतन",
    reflectPrompt: "इसे पढ़ते समय कौन-सा हालिया पल याद आया? (सिर्फ़ आपके लिए — यह निजी है।)",
    reflectPlaceholder: "पिछले हफ़्ते, जब रिपोर्ट…",
    foot: "पाठ 3 में से 2 · सप्ताह 2",
    saveForLater: "बाद के लिए सहेजें",
    markComplete: "पूर्ण करें · लय बनाए रखें 🔥",
    allCaughtUp: "आप पूरी तरह अद्यतित हैं — बढ़िया काम। यात्रा आगे बढ़ने पर नए पाठ खुलेंगे।",
    lessonLabel: "पाठ {n}",
    footTemplate: "{total} में से पाठ {n} · {week}",
  },
  assessment: {
    exit: "बाहर",
    hint: "पिछले 3 महीनों के बारे में सोचें — जो वास्तव में हुआ उसके लिए उत्तर दें, न कि जो आप करना चाहते हैं।",
    intro:
      "ईमानदार उत्तर = बेहतर कोचिंग। अगर आप सब कुछ परफ़ेक्ट बताएँगे, तो ऐप आपकी मदद नहीं कर पाएगा।",
    scale: [
      { n: 1, label: "लगभग कभी नहीं" },
      { n: 2, label: "शायद ही कभी" },
      { n: 3, label: "कभी-कभी" },
      { n: 4, label: "अक्सर" },
      { n: 5, label: "लगभग हमेशा" },
    ],
    questions: [
      { skill: "communication", text: "जब मैं लक्ष्य या काम समझाता/समझाती हूँ, तो मेरी टीम अपने शब्दों में बता सकती है कि सफलता कैसी दिखती है।" },
      { skill: "communication", text: "मीटिंग के अंत में मैं तय करता/करती हूँ कि कौन क्या और कब तक करेगा, ताकि लोगों को बाद में दोबारा पूछना न पड़े।" },
      { skill: "communication", text: "जब मैं कोई बदलाव या निर्णय साझा करता/करती हूँ, तो सिर्फ़ निर्देश नहीं, उसका 'क्यों' भी बताता/बताती हूँ।" },
      { skill: "listening", text: "1:1 में मैं पूरा ध्यान देता/देती हूँ — कोई सूचना नहीं, कोई मल्टीटास्किंग नहीं — और ज़्यादातर मेरी टीम बोलती है।" },
      { skill: "listening", text: "जब कोई चिंता साझा करता है, तो समाधान सुझाने से पहले मैं उनका नज़रिया समझने के लिए सवाल पूछता/पूछती हूँ।" },
      { skill: "listening", text: "पिछले महीने किसी ने मुझे प्रत्यक्ष या अप्रत्यक्ष रूप से बताया कि वे मेरे सामने सुने हुए महसूस करते हैं।" },
      { skill: "delegation", text: "पिछले महीने मैंने किसी को एक सार्थक काम सौंपा और बीच में सुधारने आए बिना उसे उसका स्वामी बनने दिया।" },
      { skill: "delegation", text: "जब मैं काम सौंपता/सौंपती हूँ, तो परिणाम, समयसीमा और वे क्या ख़ुद तय कर सकते हैं — इस पर स्पष्ट रहता/रहती हूँ।" },
      { skill: "delegation", text: "मेरी टीम तब भी प्रगति करती रह सकती है जब मैं लगातार मीटिंगों में या एक दिन के लिए बाहर हूँ।" },
      { skill: "feedback", text: "पिछले 4 हफ़्तों में मैंने किसी टीम सदस्य को विशिष्ट फीडबैक दिया — उन्होंने क्या किया और उसका क्या असर हुआ।" },
      { skill: "feedback", text: "मैं औपचारिक समीक्षा का इंतज़ार नहीं करता/करती; काम के दौरान या तुरंत बाद छोटे-छोटे फीडबैक देता/देती हूँ।" },
      { skill: "feedback", text: "मैं अपनी टीम से उनके लक्ष्यों के बारे में पूछता/पूछती हूँ और उन्हें दिखाता/दिखाती हूँ कि वहाँ क्या पहुँचाएगा।" },
      { skill: "conflict", text: "जब मुझे लोगों के बीच तनाव या बार-बार की दिक़्क़तें दिखती हैं, तो मैं उसके ख़त्म होने की उम्मीद के बजाय उसे उठाता/उठाती हूँ।" },
      { skill: "conflict", text: "कठिन बातचीत में मैं शांत रहता/रहती हूँ और व्यक्ति नहीं, मुद्दे पर केंद्रित रहता/रहती हूँ, भले ही भावनाएँ तीव्र हों।" },
      { skill: "conflict", text: "पिछले 3 महीनों में मैंने प्रदर्शन या व्यवहार के बारे में कम से कम एक सीधी, ईमानदार बातचीत की है।" },
    ],
    previous: "← पिछला",
    next: "अगला →",
    finish: "परिणाम देखें →",
    counter: "{n} / {total}",
  },
  results: {
    eyebrow: "आपकी कौशल प्रोफ़ाइल · आज जाँची गई",
    title: "आगे बढ़ाने के लिए दो मज़बूतियाँ, ध्यान देने के लिए दो।",
    lede: "स्तर आपके ईमानदार उत्तरों पर आधारित हैं — कोई स्कोर नहीं जिसे हराना हो। आपकी यात्रा पहले से ही आपके फोकस क्षेत्रों के इर्द-गिर्द बनी है।",
    startEyebrow: "हम यहाँ से शुरू करेंगे",
    startTitle: "प्रत्यायोजन और कठिन बातचीत",
    startDesc: "ये दोनों आपके पहले हफ़्तों में पिरोए गए हैं, फिर दोबारा देखे जाते हैं ताकि बढ़त बनी रहे।",
    startCta: "मेरी यात्रा देखें →",
    recheckEyebrow: "दोबारा-जाँच की लय",
    recheckText: "हम हर 30 दिन में एक नई कौशल जाँच के लिए याद दिलाएँगे ताकि आप इन बारों को बढ़ते देख सकें।",
    recheckCta: "अभी दोबारा लें",
  },
  team: {
    eyebrow: "गुमनाम · 5 में से 3 ने उत्तर दिया · 4 दिन पहले भेजा",
    title: "टीम पल्स",
    sendCta: "नया पल्स भेजें →",
    overallEyebrow: "इस महीने कुल मिलाकर",
    overallScore: "4.0",
    overallOf: " / 5",
    overallLabel: "सभी सवालों का औसत · पिछले पल्स से ▲ 0.3",
    bars: [
      { label: "श्रवण", pct: 84, tone: "good" },
      { label: "स्पष्टता", pct: 72, tone: "normal" },
      { label: "फीडबैक", pct: 64, tone: "acc" },
      { label: "समर्थन", pct: 78, tone: "normal" },
      { label: "भरोसा", pct: 80, tone: "good" },
    ],
    changedEyebrow: "क्या बदला",
    changedText:
      "सप्ताह 2 के बाद आपका फीडबैक स्कोर बढ़ा — उसी-दिन का नियम काम कर रहा है। लक्ष्यों पर स्पष्टता अब आपकी सबसे कम है; इसे अगले फोकस ब्लॉक के लिए सोचें।",
    pills: [
      { label: "↑ फीडबैक +0.6", tone: "good" },
      { label: "↓ स्पष्टता −0.1", tone: "normal" },
    ],
    wordsTitle: "उनके शब्दों में",
    anon: "गुमनाम",
    quotes: [
      { text: '"अब वे 1:1 में सचमुच सुनती हैं — ऐसा नहीं लगता कि वे बस बोलने का इंतज़ार कर रही हैं।"', by: "— पल्स सवाल: श्रवण" },
      { text: '"फीडबैक तेज़ी से और विशिष्ट रूप से आता है, जो मदद करता है। कभी-कभी मुझे अब भी पक्का नहीं होता कि हफ़्ते की सबसे बड़ी प्राथमिकता क्या है।"', by: "— पल्स सवाल: स्पष्टता" },
      { text: '"जब चीज़ें ग़लत होती हैं तो हमारा साथ देने में अच्छी हैं।"', by: "— पल्स सवाल: समर्थन" },
    ],
    dummyNote:
      "यह एक डमी है। आपकी टीम को असली गुमनाम पल्स भेजने के लिए बैकएंड चाहिए, जो इस प्रोटोटाइप में अभी नहीं है।",
    dummyClose: "ठीक है",
  },
  language: { label: "भाषा", en: "English", hi: "हिन्दी", te: "తెలుగు" },
};

// ============================================================================
// TELUGU
// ============================================================================
const te: Content = {
  nav: {
    coaching: "కోచింగ్",
    insight: "అంతర్దృష్టి",
    home: "హోమ్",
    journey: "నా ప్రయాణం",
    journeyBadge: "వా2",
    lesson: "నేటి పాఠం",
    results: "నైపుణ్య ప్రొఫైల్",
    team: "టీమ్ పల్స్",
    assessment: "మళ్లీ తనిఖీ",
  },
  topbar: { search: "పాఠాలు & నైపుణ్యాలను వెతకండి", streakLabel: "{n}-రోజుల స్ట్రీక్" },
  profile: { name: "వినియోగదారు", role: "టీమ్ లీడ్ · ప్రో" },
  pageTitles: {
    dashboard: "హోమ్",
    journey: "మీ 90-రోజుల ప్రయాణం",
    lesson: "పాఠం",
    results: "మీ ఫలితాలు",
    team: "టీమ్ పల్స్",
    assessment: "నైపుణ్య తనిఖీ",
  },
  levels: { strength: "బలం", developing: "అభివృద్ధి", focus: "దృష్టి ప్రాంతం" },
  weekStates: { done: "పూర్తయింది", now: "జరుగుతోంది", next: "తదుపరి", locked: "లాక్" },
  skillNames: {
    communication: "సంభాషణ & స్పష్టత",
    listening: "క్రియాశీల శ్రవణం",
    delegation: "అప్పగింత & యాజమాన్యం",
    feedback: "ఫీడ్‌బ్యాక్ & కోచింగ్",
    conflict: "కఠిన సంభాషణలు",
  },
  skillShort: {
    communication: "సంభాషణ",
    listening: "శ్రవణం",
    delegation: "అప్పగింత",
    feedback: "ఫీడ్‌బ్యాక్",
    conflict: "వివాదం",
  },
  common: {
    minRead: "{n} నిమి. చదవండి",
    oneAction: "1 చర్య",
    endsAction: "1 చర్యతో ముగుస్తుంది",
    back: "వెనుకకు",
    startLesson: "పాఠం ప్రారంభించండి",
  },
  onboarding: {
    eyebrow: "Lead4wd కు స్వాగతం",
    title: "మీ కోచింగ్‌ను సెటప్ చేద్దాం.",
    sub: "మీ తొలి వారాలు మీరు నిజంగా పనిచేసే విధానానికి సరిపోయేలా రెండు చిన్న ప్రశ్నలు.",
    questions: [
      {
        text: "Lead4wd వాడటానికి మీ ప్రధాన లక్ష్యం ఏమిటి?",
        options: [
          "నేను కొత్త మేనేజర్‌ని, మార్గదర్శనం కావాలి",
          "నేను మరింత స్పష్టంగా సంభాషించాలనుకుంటున్నాను",
          "టీమ్ వివాదంలో నాకు సహాయం కావాలి",
          "నేను మరింత ప్రభావవంతంగా అప్పగించాలనుకుంటున్నాను",
        ],
      },
      {
        text: "ప్రతి వారం మీరు ఎంత సమయం ఇవ్వగలరు?",
        options: ["10–15 నిమిషాలు (మైక్రో-లెర్నింగ్)", "30–60 నిమిషాలు", "1–2 గంటలు", "2 గంటల కంటే ఎక్కువ"],
      },
    ],
    skip: "దాటవేయి",
    back: "వెనుకకు",
    next: "కొనసాగించు",
    finish: "సైన్ ఇన్‌కు వెళ్లండి",
    stepLabel: "దశ {n} / {total}",
  },
  auth: {
    eyebrow: "దయచేసి మీ వివరాలను నమోదు చేయండి",
    title: "తిరిగి స్వాగతం",
    sub: "ఇది ఒక ప్రోటోటైప్ — ఏ వివరాలైనా మిమ్మల్ని నేరుగా లోపలికి తీసుకెళ్తాయి.",
    emailPlaceholder: "ఇమెయిల్ చిరునామా",
    passwordPlaceholder: "పాస్‌వర్డ్",
    remember: "30 రోజులు గుర్తుంచుకో",
    forgot: "పాస్‌వర్డ్ మర్చిపోయారా?",
    login: "లాగిన్",
    google: "Google తో కొనసాగించండి",
    noAccount: "ఖాతా లేదా?",
    signUp: "సైన్ అప్",
    dummy: "ఇది ఒక డమ్మీ బటన్",
  },
  dashboard: {
    eyebrowDate: "12లో వారం {week}",
    greeting: "శుభోదయం, వినియోగదారు.",
    sub: "ఈ వారం మీరు రెండు అలవాట్లను నిర్మిస్తున్నారు — ఫీడ్‌బ్యాక్ మరియు అప్పగింత. ఈరోజు ఒక చిన్న చర్య స్ట్రీక్‌ను నిలుపుతుంది.",
    continueCta: "నేటి పాఠాన్ని కొనసాగించండి →",
    nextStepKicker: "మీ తదుపరి ఉత్తమ అడుగు · 4 నిమి.",
    nextStepTitle: "అదే రోజు ప్రభావం చూపే ఫీడ్‌బ్యాక్ ఇవ్వండి",
    nextStepDesc:
      "నిర్దిష్టమైన, సమయానుకూల ఫీడ్‌బ్యాక్ నమ్మకాన్ని నిర్మించే అత్యంత వేగవంతమైన మార్గం. నేటి పాఠం మీ తదుపరి 1:1లో ప్రయత్నించడానికి ఒక వాక్యాన్ని ఇస్తుంది.",
    planLabel: "ప్రణాళిక",
    lessonsCompleted: "పాఠాలు పూర్తి",
    actionsTried: "చర్యలు ప్రయత్నించారు",
    focusEyebrow: "ఈ వారం దృష్టి",
    streakTitle: "మీ స్ట్రీక్",
    seeJourney: "పూర్తి ప్రయాణం చూడండి →",
    weekdaysShort: ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"],
    todayLabel: "నేడు",
    teamTitle: "మీ టీమ్ ఎలా భావిస్తోంది",
    openTeam: "టీమ్ పల్స్ తెరవండి →",
    pulseEyebrow: "తాజా పల్స్ · 0 అనామక సమాధానాలు",
    pulseRows: [
      { name: "బాగా వింటారు", pct: 0, score: "0.0", tone: "good" },
      { name: "స్పష్ట లక్ష్యాలు", pct: 0, score: "0.0", tone: "normal" },
      { name: "నిష్పక్ష ఫీడ్‌బ్యాక్", pct: 0, score: "0.0", tone: "acc" },
    ],
    coachEyebrow: "కోచ్ గమనిక",
    coachNote:
      "మీ టీమ్ వినడాన్ని ఎక్కువగా రేటు చేస్తుంది — దాన్ని ఆధారం చేసుకోండి. నిష్పక్ష ఫీడ్‌బ్యాక్ మీ అతిపెద్ద అవకాశం, అదే ఈ వారం లక్ష్యం.",
  },
  journey: {
    eyebrow: "12-వారాల ప్రణాళిక · మీ నైపుణ్య తనిఖీకి అనుగుణంగా",
    title: "మీ 90-రోజుల ప్రయాణం",
    pillTemplate: "→ వారం {week} జరుగుతోంది · {pct}% పూర్తి",
    resume: "కొనసాగించు →",
    phases: [
      {
        number: "దశ 01",
        title: "పునాదులు",
        weeks: [
          {
            id: "w1",
            label: "వారం 01",
            title: "అర్థం చేసుకోవడానికి వినడం",
            subtitle: "సరిచేయాలనే ఆత్రుతను వదలండి. ముందు మొత్తం వినండి.",
            lessons: [
              { id: "w1l1", title: "3-సెకన్ల విరామం" },
              { id: "w1l2", title: "తిరిగి ప్రతిబింబించడం" },
              { id: "w1l3", title: "చెప్పడం కాదు, అడగడం" },
            ],
          },
          {
            id: "w2",
            label: "వారం 02",
            title: "ప్రభావం చూపే ఫీడ్‌బ్యాక్",
            subtitle: "నిర్దిష్టం, దయతో, అదే రోజు. దీన్ని అలవాటు చేసుకోండి.",
            lessons: [
              { id: "w2l1", title: "ఫీడ్‌బ్యాక్ ఎందుకు కష్టంగా అనిపిస్తుంది" },
              { id: "w2l2", title: "వ్యక్తి కాదు, ప్రవర్తనకు పేరు పెట్టండి" },
              { id: "w2l3", title: "అదే-రోజు నియమం" },
            ],
          },
          {
            id: "w3",
            label: "వారం 03",
            title: "నమ్మకంతో అప్పగించడం",
            subtitle: "కేవలం పని కాదు, ఫలితాన్ని అప్పగించండి.",
            lessons: [
              { id: "w3l1", title: "మీరు మాత్రమే చేయగలిగేది" },
              { id: "w3l2", title: "యాజమాన్యం కోసం బ్రీఫింగ్" },
              { id: "w3l3", title: "మీద పడకుండా తనిఖీ చేయడం" },
            ],
          },
        ],
      },
      {
        number: "దశ 02",
        title: "కఠిన క్షణాలు",
        weeks: [
          {
            id: "w4",
            label: "వారం 04–05",
            locked: true,
            title: "కఠిన సంభాషణలు",
            subtitle: "సిద్ధమవ్వండి, ప్రశాంతంగా ఉండండి, స్పష్టమైన తదుపరి అడుగుకు చేరండి.",
            lessons: [
              { id: "w4l1", title: "తడబాటు లేకుండా మొదలుపెట్టడం" },
              { id: "w4l2", title: "దయతో మీ మాటపై నిలబడటం" },
            ],
          },
          {
            id: "w5",
            label: "వారం 06–07",
            locked: true,
            title: "మీ టీమ్‌కు కోచింగ్",
            subtitle: "మెరుగైన ప్రశ్నలడిగి వ్యక్తులను ఎదిగించండి.",
            lessons: [
              { id: "w5l1", title: "GROW సంభాషణ" },
              { id: "w5l2", title: "నిలిచే లక్ష్యాలు" },
            ],
          },
          {
            id: "w6",
            label: "వారం 08+",
            locked: true,
            title: "నిర్వహణ కాదు, నాయకత్వం",
            subtitle: "దిశను నిర్ణయించండి, నమ్మకాన్ని నిర్మించండి, వెనక్కి తగ్గండి.",
            lessons: [
              { id: "w6l1", title: "మీ పని-లయ" },
              { id: "w6l2", title: "మీ నైపుణ్యాలను మళ్లీ తనిఖీ" },
            ],
          },
        ],
      },
    ],
  },
  lesson: {
    progress: "2 / 3",
    eyebrow: "ఫీడ్‌బ్యాక్ & కోచింగ్ · పాఠం 2",
    title: "వ్యక్తి కాదు, ప్రవర్తనకు పేరు పెట్టండి.",
    minutes: 4,
    body: [
      'ఫీడ్‌బ్యాక్ ప్రభావవంతంగా చేయడానికి అత్యంత వేగవంతమైన మార్గం దాన్నుంచి వ్యక్తిని తొలగించడం. "నువ్వు అస్తవ్యస్తంగా ఉన్నావు" అనేది ఒక తీర్పు — అది రక్షణను ఆహ్వానిస్తుంది. మీరు నిజంగా చూసినదాన్ని చూపడం ఒక సరిదిద్దును ఆహ్వానిస్తుంది.',
      "ఆ వాక్యం ఒకేసారి మూడు పనులు చేస్తుంది: అది నిర్దిష్టం (ఒక సంఘటన, ఒక నమూనా కాదు), అది గమనించదగినది (మీరిద్దరూ చూశారు), మరియు అది ప్రభావాన్ని పేర్కొంటుంది (క్లయింట్ గమనించారు). స్వభావంపై ఏకీభవించాల్సిన అవసరం లేదు — కేవలం వాస్తవాలపై.",
      "లేబుళ్లను వదలండి. ప్రవర్తనను, దాని ప్రభావాన్ని వివరించండి, తర్వాత నిశ్శబ్దంగా ఉండి వారిని స్పందించనివ్వండి. మీకంటే ముందే వారు తరచూ నిర్ణయానికి చేరుకోవడం చూసి మీరు ఆశ్చర్యపోతారు.",
    ],
    quote: '"ప్రెజెంటేషన్ గత నెల అంకెలతో వెళ్లింది, క్లయింట్ గమనించారు."',
    actionKicker: "మీ చర్య · మీ తదుపరి 1:1లో ప్రయత్నించండి",
    actionText: "పని జరిగిన ఒక రోజులోపు ఒక నిర్దిష్ట ఫీడ్‌బ్యాక్ ఇవ్వండి.",
    reflectHeading: "త్వరిత ఆలోచన",
    reflectPrompt: "ఇది చదువుతున్నప్పుడు ఏ ఇటీవలి క్షణం గుర్తొచ్చింది? (మీ కోసమే — ఇది గోప్యం.)",
    reflectPlaceholder: "గత వారం, రిపోర్ట్ ఉన్నప్పుడు…",
    foot: "3లో పాఠం 2 · వారం 2",
    saveForLater: "తర్వాత కోసం సేవ్ చేయి",
    markComplete: "పూర్తి చేయి · స్ట్రీక్ నిలుపు 🔥",
    allCaughtUp: "మీరు పూర్తిగా తాజాగా ఉన్నారు — చక్కని పని. ప్రయాణం కొనసాగుతున్న కొద్దీ కొత్త పాఠాలు తెరుచుకుంటాయి.",
    lessonLabel: "పాఠం {n}",
    footTemplate: "{total}లో పాఠం {n} · {week}",
  },
  assessment: {
    exit: "నిష్క్రమించు",
    hint: "గత 3 నెలల గురించి ఆలోచించండి — మీరు ఏం చేయాలనుకుంటున్నారో కాదు, నిజంగా ఏం జరిగిందో దానికి సమాధానమివ్వండి.",
    intro:
      "నిజాయితీ సమాధానాలు = మెరుగైన కోచింగ్. అన్నీ పర్‌ఫెక్ట్ అని గుర్తిస్తే, యాప్ మీ ఎదుగుదలకు సహాయపడలేదు.",
    scale: [
      { n: 1, label: "దాదాపు ఎప్పుడూ లేదు" },
      { n: 2, label: "అరుదుగా" },
      { n: 3, label: "కొన్నిసార్లు" },
      { n: 4, label: "తరచుగా" },
      { n: 5, label: "దాదాపు ఎల్లప్పుడూ" },
    ],
    questions: [
      { skill: "communication", text: "నేను లక్ష్యాలు లేదా పనులను వివరించినప్పుడు, విజయం ఎలా ఉంటుందో నా టీమ్ తమ సొంత మాటల్లో తిరిగి చెప్పగలదు." },
      { skill: "communication", text: "మీటింగ్ చివరిలో ఎవరు ఏం, ఎప్పటిలోగా చేయాలో నిర్ధారిస్తాను, తద్వారా వారు తర్వాత మళ్లీ అడగాల్సిన అవసరం ఉండదు." },
      { skill: "communication", text: "నేను మార్పు లేదా నిర్ణయాన్ని పంచుకున్నప్పుడు, కేవలం సూచనలే కాదు, దాని 'ఎందుకు' కూడా వివరిస్తాను." },
      { skill: "listening", text: "1:1లలో నేను పూర్తి శ్రద్ధ ఇస్తాను — నోటిఫికేషన్లు లేవు, మల్టీటాస్కింగ్ లేదు — ఎక్కువగా నా టీమ్ మాట్లాడుతుంది." },
      { skill: "listening", text: "ఎవరైనా ఆందోళన పంచుకున్నప్పుడు, పరిష్కారాలు సూచించే ముందు వారి దృక్కోణాన్ని అర్థం చేసుకోవడానికి ప్రశ్నలడుగుతాను." },
      { skill: "listening", text: "గత నెలలో, నా దగ్గర తాము వినబడుతున్నట్లు అనిపిస్తోందని ఎవరో నేరుగా లేదా పరోక్షంగా చెప్పారు." },
      { skill: "delegation", text: "గత నెలలో నేను ఒక ముఖ్యమైన పనిని ఎవరికైనా అప్పగించి, మధ్యలో సరిచేయడానికి జోక్యం చేసుకోకుండా దాన్ని వారు సొంతం చేసుకోనిచ్చాను." },
      { skill: "delegation", text: "నేను అప్పగించినప్పుడు, ఫలితం, గడువు, మరియు వారు సొంతంగా ఏం నిర్ణయించగలరో దానిపై స్పష్టంగా ఉంటాను." },
      { skill: "delegation", text: "నేను వరుస మీటింగ్‌లలో లేదా ఒక రోజు బయట ఉన్నా నా టీమ్ తమ పనిలో ముందుకు సాగగలదు." },
      { skill: "feedback", text: "గత 4 వారాల్లో, ఒక టీమ్ సభ్యుడికి నిర్దిష్ట ఫీడ్‌బ్యాక్ ఇచ్చాను — వారు ఏం చేశారు, దాని ప్రభావం ఏమిటి." },
      { skill: "feedback", text: "నేను అధికారిక సమీక్షల కోసం వేచి ఉండను; పని సమయంలో లేదా వెంటనే చిన్న చిన్న ఫీడ్‌బ్యాక్‌లు ఇస్తాను." },
      { skill: "feedback", text: "నా టీమ్‌ను వారి లక్ష్యాల గురించి అడిగి, అక్కడికి ఏం చేరుస్తుందో చూడటానికి సహాయం చేస్తాను." },
      { skill: "conflict", text: "వ్యక్తుల మధ్య ఉద్రిక్తత లేదా పదేపదే సమస్యలు గమనించినప్పుడు, అది సమసిపోతుందని ఆశించకుండా దాన్ని లేవనెత్తుతాను." },
      { skill: "conflict", text: "కఠిన సంభాషణల్లో, భావోద్వేగాలు తీవ్రంగా ఉన్నా నేను ప్రశాంతంగా ఉండి, వ్యక్తిపై కాదు సమస్యపై దృష్టి పెడతాను." },
      { skill: "conflict", text: "గత 3 నెలల్లో, పనితీరు లేదా ప్రవర్తన గురించి కనీసం ఒక నేరుగా, నిజాయితీగల సంభాషణ చేశాను." },
    ],
    previous: "← మునుపటి",
    next: "తదుపరి →",
    finish: "ఫలితాలు చూడండి →",
    counter: "{n} / {total}",
  },
  results: {
    eyebrow: "మీ నైపుణ్య ప్రొఫైల్ · ఈరోజు తనిఖీ చేయబడింది",
    title: "నిర్మించుకోవడానికి రెండు బలాలు, దృష్టి పెట్టడానికి రెండు.",
    lede: "స్థాయిలు మీ నిజాయితీ సమాధానాలపై ఆధారపడ్డాయి — ఓడించాల్సిన స్కోరు కాదు. మీ ప్రయాణం ఇప్పటికే మీ దృష్టి ప్రాంతాల చుట్టూ నిర్మించబడింది.",
    startEyebrow: "మనం ఇక్కడ నుండి మొదలుపెడతాం",
    startTitle: "అప్పగింత & కఠిన సంభాషణలు",
    startDesc: "ఈ రెండూ మీ తొలి వారాల్లో అల్లుకుపోయాయి, తర్వాత లాభాలు నిలిచేలా మళ్లీ సందర్శించబడతాయి.",
    startCta: "నా ప్రయాణం చూడండి →",
    recheckEyebrow: "మళ్లీ-తనిఖీ లయ",
    recheckText: "ఈ బార్లు కదలడం మీరు చూసేలా ప్రతి 30 రోజులకు ఒక కొత్త నైపుణ్య తనిఖీని మేము గుర్తుచేస్తాం.",
    recheckCta: "ఇప్పుడే మళ్లీ తీసుకోండి",
  },
  team: {
    eyebrow: "అనామకం · 5లో 3 సమాధానమిచ్చారు · 4 రోజుల క్రితం పంపారు",
    title: "టీమ్ పల్స్",
    sendCta: "కొత్త పల్స్ పంపండి →",
    overallEyebrow: "ఈ నెల మొత్తం",
    overallScore: "4.0",
    overallOf: " / 5",
    overallLabel: "అన్ని ప్రశ్నల సగటు · గత పల్స్‌తో పోలిస్తే ▲ 0.3",
    bars: [
      { label: "శ్రవణం", pct: 84, tone: "good" },
      { label: "స్పష్టత", pct: 72, tone: "normal" },
      { label: "ఫీడ్‌బ్యాక్", pct: 64, tone: "acc" },
      { label: "మద్దతు", pct: 78, tone: "normal" },
      { label: "నమ్మకం", pct: 80, tone: "good" },
    ],
    changedEyebrow: "ఏం మారింది",
    changedText:
      "వారం 2 తర్వాత మీ ఫీడ్‌బ్యాక్ స్కోరు పెరిగింది — అదే-రోజు నియమం పనిచేస్తోంది. లక్ష్యాలపై స్పష్టత ఇప్పుడు మీ అత్యల్పం; దాన్ని మీ తదుపరి దృష్టి బ్లాక్ కోసం పరిగణించండి.",
    pills: [
      { label: "↑ ఫీడ్‌బ్యాక్ +0.6", tone: "good" },
      { label: "↓ స్పష్టత −0.1", tone: "normal" },
    ],
    wordsTitle: "వారి మాటల్లో",
    anon: "అనామకం",
    quotes: [
      { text: '"ఇప్పుడు ఆమె 1:1లలో నిజంగా వింటారు — మాట్లాడటానికి ఎదురుచూస్తున్నట్లు అనిపించదు."', by: "— పల్స్ ప్రశ్న: శ్రవణం" },
      { text: '"ఫీడ్‌బ్యాక్ వేగంగా, నిర్దిష్టంగా వస్తుంది, అది సహాయపడుతుంది. కొన్నిసార్లు వారానికి అతిపెద్ద ప్రాధాన్యత ఏమిటో నాకు ఇంకా స్పష్టంగా తెలియదు."', by: "— పల్స్ ప్రశ్న: స్పష్టత" },
      { text: '"విషయాలు తప్పుగా జరిగినప్పుడు మాకు అండగా నిలవడంలో బాగుంటారు."', by: "— పల్స్ ప్రశ్న: మద్దతు" },
    ],
    dummyNote:
      "ఇది ఒక డమ్మీ. మీ టీమ్‌కు నిజమైన అనామక పల్స్ పంపడానికి బ్యాకెండ్ అవసరం, ఇది ఈ ప్రోటోటైప్‌లో ఇంకా లేదు.",
    dummyClose: "సరే",
  },
  language: { label: "భాష", en: "English", hi: "हिन्दी", te: "తెలుగు" },
};

// ----------------------------------------------------------------------------
export const CONTENT: Record<LanguageCode, Content> = { en, hi, te };

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
];
