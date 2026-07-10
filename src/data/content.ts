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
type PulseRow = { name: string; pct: number; score: string; tone: BarTone };
type PulseBar = { label: string; pct: number; tone: BarTone };
type PulseQuote = { text: string; by: string };
type OnboardingQuestion = { text: string; options: string[] };

export type Content = {
  nav: {
    coaching: string;
    insight: string;
    admin: string; // admin nav-group label
    home: string;
    journey: string;
    journeyBadge: string;
    lesson: string;
    results: string;
    team: string;
    assessment: string;
    analytics: string; // user-facing analytics page
    adminPanel: string; // admin panel nav item
  };
  topbar: { search: string; streakLabel: string }; // streakLabel: "{n}-day streak"
  profile: { name: string; role: string };
  pageTitles: Record<
    "dashboard" | "journey" | "lesson" | "results" | "team" | "assessment" | "analytics" | "admin",
    string
  >;
  levels: { strength: string; developing: string; focus: string };
  weekStates: { done: string; now: string; next: string; locked: string };
  skillNames: Record<SkillId, string>;
  skillShort: Record<SkillId, string>;
  common: {
    minRead: string; // "{n} min read"
    oneAction: string;
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
    noAccount: string;
    signUp: string;
    namePlaceholder: string;
    signupTitle: string;
    signupSub: string;
    createAccount: string;
    haveAccount: string;
    working: string;
    forgotSent: string;
    forgotPrompt: string;
    error: string;
    errInvalidCreds: string;
    errUserExists: string;
    errRateLimit: string;
    errWeakPassword: string;
    passwordShort: string; // client-side minimum-length message
  };
  account: {
    title: string;
    nameLabel: string;
    roleLabel: string;
    languageLabel: string;
    save: string;
    saved: string;
    passwordTitle: string;
    newPassword: string;
    updatePassword: string;
    passwordUpdated: string;
    dangerTitle: string;
    dangerDesc: string;
    deleteCta: string;
    confirmHint: string;
    confirmWord: string;
    deleting: string;
    signOut: string;
    close: string;
  };
  cookie: { message: string; accept: string; decline: string };
  dashboard: {
    eyebrowDate: string;
    greetings: { morning: string; afternoon: string; evening: string };
    sub: string;
    continueCta: string;
    nextStepKicker: string;
    caughtUpTitle: string;
    caughtUpDesc: string;
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
    pillTemplate: string; // "→ {pct}% complete · Module {n} of {total}"
    resume: string;
    steps: string[]; // 3 generic "what you'll do" labels per module card
    moduleTag: string; // "Module {n}"
    phaseLabel: string; // "Phase {n}"
    lockedTag: string;
    comingTitle: string;
  };
  lesson: {
    minutes: number; // default duration shown when no module is active
  };
  assessment: {
    exit: string;
    hint: string;
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
  player: {
    back: string;
    continue: string;
    check: string;
    correct: string;
    incorrect: string;
    bestMove: string;
    complete: string;
    counter: string; // "{n} / {total}"
    lockedMsg: string;
    retakeMsg: string; // "…{pct}%…"
    retake: string;
    goToQuestions: string;
    reveal: string;
    hide: string;
    save: string;
    saved: string;
    choosePlaceholder: string;
    addItem: string;
    remove: string;
    namePlaceholder: string;
    relationship: string;
    power: string;
    interest: string;
    levelLow: string;
    levelMedium: string;
    levelHigh: string;
  };
  analytics: {
    eyebrow: string;
    title: string;
    lede: string;
    totalTime: string;
    activeDays: string;
    completed: string;
    skipped: string;
    timeByModuleTitle: string;
    dailyTitle: string;
    minutesUnit: string; // "{n} min"
    noData: string;
  };
  admin: {
    title: string;
    lede: string;
    totalUsers: string;
    totalOnboarded: string;
    totalCompleted: string;
    totalTime: string;
    searchPlaceholder: string;
    colUser: string;
    colEmail: string;
    colStreak: string;
    colProgress: string;
    colTime: string;
    colLastActive: string;
    never: string;
    adminTag: string;
    back: string;
    secProgress: string;
    secResponses: string;
    secAssessment: string;
    secOnboarding: string;
    secTime: string;
    secSkips: string;
    secDaily: string;
    statusLabel: string;
    scoreLabel: string;
    reflectionLabel: string;
    moduleLabel: string; // "Module {n}"
    screenLabel: string; // "Screen {n}"
    skipLabel: string; // "Skipped {kind} on screen {n}"
    correctTag: string;
    wrongTag: string;
    noResponses: string;
    noSkips: string;
    noUsers: string;
    minutesUnit: string;
    valueLabel: string; // assessment answer value
  };
  ga: {
    title: string;
    lede: string;
    notConfigured: string;
    activeUsers: string;
    newUsers: string;
    sessions: string;
    avgEngagement: string;
    topEvents: string;
    dailyActive: string;
    secondsUnit: string; // "{n}s"
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
    admin: "Admin",
    home: "Home",
    journey: "My journey",
    journeyBadge: "W2",
    lesson: "Today's lesson",
    results: "Skills profile",
    team: "Team Pulse",
    assessment: "Re-take check",
    analytics: "My analytics",
    adminPanel: "User analytics",
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
    analytics: "My analytics",
    admin: "Admin · user analytics",
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
    stepLabel: "Step {n} of {total}",
  },
  auth: {
    eyebrow: "Please enter your details",
    title: "Welcome back",
    sub: "Log in to pick up your journey where you left off.",
    emailPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    remember: "Remember for 30 days",
    forgot: "Forgot password?",
    login: "Log in",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    namePlaceholder: "Your name",
    signupTitle: "Create your account",
    signupSub: "Sign up to start your journey — your progress is saved to your account.",
    createAccount: "Create account",
    haveAccount: "Already have an account?",
    working: "Please wait…",
    forgotSent: "Check your email for a password reset link.",
    forgotPrompt: "Enter your email above first, then tap Forgot password.",
    error: "Something went wrong. Check your details and try again.",
    errInvalidCreds: "Incorrect email or password.",
    errUserExists: "An account with this email already exists — log in instead.",
    errRateLimit: "Too many attempts — wait a minute and try again.",
    errWeakPassword: "That password is too weak — use at least 8 characters.",
    passwordShort: "Use at least 8 characters for your password.",
  },
  account: {
    title: "Account settings",
    nameLabel: "Display name",
    roleLabel: "Role",
    languageLabel: "Language",
    save: "Save changes",
    saved: "Saved.",
    passwordTitle: "Change password",
    newPassword: "New password",
    updatePassword: "Update password",
    passwordUpdated: "Password updated.",
    dangerTitle: "Delete account",
    dangerDesc: "This permanently deletes your account and all your progress. This cannot be undone.",
    deleteCta: "Delete my account",
    confirmHint: "Type DELETE to confirm",
    confirmWord: "DELETE",
    deleting: "Deleting…",
    signOut: "Log out",
    close: "Close",
  },
  cookie: {
    message:
      "Essential cookies keep you signed in. With your consent, we also use Google Analytics to understand how the app is used.",
    accept: "Accept analytics",
    decline: "Essential only",
  },
  dashboard: {
    eyebrowDate: "Module {n} of {total}",
    greetings: {
      morning: "Good morning, {name}.",
      afternoon: "Good afternoon, {name}.",
      evening: "Good evening, {name}.",
    },
    sub: "You're building new habits this week. One small action today keeps your streak alive.",
    continueCta: "Continue today's lesson →",
    nextStepKicker: "YOUR NEXT BEST STEP · {n} MIN",
    caughtUpTitle: "You're all caught up",
    caughtUpDesc:
      "You've finished the modules available right now. New ones unlock as your journey continues.",
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
    pillTemplate: "→ {pct}% complete · Module {n} of {total}",
    resume: "Resume →",
    steps: ["Learn the idea", "Practise & decide", "Try one micro-action"],
    moduleTag: "Module {n}",
    phaseLabel: "Phase {n}",
    lockedTag: "Locked",
    comingTitle: "More in your journey",
  },
  lesson: {
    minutes: 4,
  },
  assessment: {
    exit: "Exit",
    hint: "Think about the last 3 months — answer for what actually happened, not what you intend to do.",
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
  player: {
    back: "Exit",
    continue: "Continue",
    check: "Check answers",
    correct: "Correct",
    incorrect: "Not quite — try the other bucket",
    bestMove: "Best move",
    complete: "Complete · keep streak 🔥",
    counter: "{n} / {total}",
    lockedMsg: "Answer the questions in this module to unlock the next one.",
    retakeMsg: "You scored {pct}%. Score at least 60% to unlock the next module — give it another go.",
    retake: "Retake module",
    goToQuestions: "Go to the questions",
    reveal: "Reveal",
    hide: "Hide",
    save: "Save",
    saved: "Saved",
    choosePlaceholder: "Choose a focus area…",
    addItem: "Add another",
    remove: "Remove",
    namePlaceholder: "Name or role",
    relationship: "Relationship",
    power: "Power",
    interest: "Interest",
    levelLow: "Low",
    levelMedium: "Medium",
    levelHigh: "High",
  },
  analytics: {
    eyebrow: "Your activity",
    title: "How you're learning",
    lede: "Your time, momentum, and progress so far — just for you.",
    totalTime: "Total time",
    activeDays: "Active days",
    completed: "Modules completed",
    skipped: "Sections skipped",
    timeByModuleTitle: "Time per module",
    dailyTitle: "Daily activity",
    minutesUnit: "{n} min",
    noData: "No activity yet — start a module and your stats will appear here.",
  },
  admin: {
    title: "User analytics",
    lede: "Every learner's progress, responses, time, and skips.",
    totalUsers: "Users",
    totalOnboarded: "Onboarded",
    totalCompleted: "Modules completed",
    totalTime: "Total time",
    searchPlaceholder: "Search by name or email",
    colUser: "User",
    colEmail: "Email",
    colStreak: "Streak",
    colProgress: "Completed",
    colTime: "Time",
    colLastActive: "Last active",
    never: "Never",
    adminTag: "Admin",
    back: "← All users",
    secProgress: "Module progress",
    secResponses: "Module responses",
    secAssessment: "Skills-check answers",
    secOnboarding: "Onboarding answers",
    secTime: "Time per module",
    secSkips: "Skipped sections",
    secDaily: "Daily activity",
    statusLabel: "Status",
    scoreLabel: "Score",
    reflectionLabel: "Reflection",
    moduleLabel: "Module {n}",
    screenLabel: "Screen {n}",
    skipLabel: "Skipped {kind} on screen {n}",
    correctTag: "Correct",
    wrongTag: "Wrong",
    noResponses: "No responses recorded.",
    noSkips: "No skipped sections.",
    noUsers: "No users yet.",
    minutesUnit: "{n} min",
    valueLabel: "Rated {n}/5",
  },
  ga: {
    title: "Product analytics (Google Analytics)",
    lede: "Anonymous, aggregate usage across everyone — no individual data.",
    notConfigured: "Google Analytics isn't connected yet. Add the credentials to see aggregate usage here.",
    activeUsers: "Active users",
    newUsers: "New users",
    sessions: "Sessions",
    avgEngagement: "Avg engagement",
    topEvents: "Top events",
    dailyActive: "Daily active users",
    secondsUnit: "{n}s",
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
    admin: "एडमिन",
    home: "होम",
    journey: "मेरी यात्रा",
    journeyBadge: "स2",
    lesson: "आज का पाठ",
    results: "कौशल प्रोफ़ाइल",
    team: "टीम पल्स",
    assessment: "दोबारा जाँच",
    analytics: "मेरा विश्लेषण",
    adminPanel: "उपयोगकर्ता विश्लेषण",
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
    analytics: "मेरा विश्लेषण",
    admin: "एडमिन · उपयोगकर्ता विश्लेषण",
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
    stepLabel: "चरण {n} / {total}",
  },
  auth: {
    eyebrow: "कृपया अपना विवरण दर्ज करें",
    title: "वापसी पर स्वागत है",
    sub: "लॉग इन करें और अपनी यात्रा वहीं से जारी रखें जहाँ छोड़ी थी।",
    emailPlaceholder: "ईमेल पता",
    passwordPlaceholder: "पासवर्ड",
    remember: "30 दिनों तक याद रखें",
    forgot: "पासवर्ड भूल गए?",
    login: "लॉग इन",
    noAccount: "खाता नहीं है?",
    signUp: "साइन अप",
    namePlaceholder: "आपका नाम",
    signupTitle: "अपना खाता बनाएँ",
    signupSub: "अपनी यात्रा शुरू करने के लिए साइन अप करें — आपकी प्रगति आपके खाते में सहेजी जाती है।",
    createAccount: "खाता बनाएँ",
    haveAccount: "पहले से खाता है?",
    working: "कृपया प्रतीक्षा करें…",
    forgotSent: "पासवर्ड रीसेट लिंक के लिए अपना ईमेल देखें।",
    forgotPrompt: "पहले ऊपर अपना ईमेल दर्ज करें, फिर 'पासवर्ड भूल गए' पर टैप करें।",
    error: "कुछ गलत हो गया। अपना विवरण जाँचें और पुनः प्रयास करें।",
    errInvalidCreds: "ईमेल या पासवर्ड ग़लत है।",
    errUserExists: "इस ईमेल से खाता पहले से मौजूद है — लॉग इन करें।",
    errRateLimit: "बहुत अधिक प्रयास — एक मिनट रुककर फिर कोशिश करें।",
    errWeakPassword: "पासवर्ड बहुत कमज़ोर है — कम से कम 8 अक्षर इस्तेमाल करें।",
    passwordShort: "पासवर्ड में कम से कम 8 अक्षर रखें।",
  },
  account: {
    title: "खाता सेटिंग्स",
    nameLabel: "प्रदर्शित नाम",
    roleLabel: "भूमिका",
    languageLabel: "भाषा",
    save: "परिवर्तन सहेजें",
    saved: "सहेजा गया।",
    passwordTitle: "पासवर्ड बदलें",
    newPassword: "नया पासवर्ड",
    updatePassword: "पासवर्ड अपडेट करें",
    passwordUpdated: "पासवर्ड अपडेट हो गया।",
    dangerTitle: "खाता हटाएँ",
    dangerDesc: "यह आपके खाते और आपकी सारी प्रगति को स्थायी रूप से हटा देता है। इसे पूर्ववत नहीं किया जा सकता।",
    deleteCta: "मेरा खाता हटाएँ",
    confirmHint: "पुष्टि के लिए DELETE टाइप करें",
    confirmWord: "DELETE",
    deleting: "हटाया जा रहा है…",
    signOut: "लॉग आउट",
    close: "बंद करें",
  },
  cookie: {
    message:
      "आवश्यक कुकीज़ आपको साइन इन रखती हैं। आपकी सहमति से हम ऐप के उपयोग को समझने के लिए Google Analytics का भी उपयोग करते हैं।",
    accept: "विश्लेषण स्वीकारें",
    decline: "केवल आवश्यक",
  },
  dashboard: {
    eyebrowDate: "{total} में से मॉड्यूल {n}",
    greetings: {
      morning: "सुप्रभात, {name}।",
      afternoon: "शुभ अपराह्न, {name}।",
      evening: "शुभ संध्या, {name}।",
    },
    sub: "इस हफ़्ते आप नई आदतें बना रहे हैं। आज एक छोटा कदम आपकी लय बनाए रखता है।",
    continueCta: "आज का पाठ जारी रखें →",
    nextStepKicker: "आपका अगला बेहतरीन कदम · {n} मिनट",
    caughtUpTitle: "आप पूरी तरह अद्यतित हैं",
    caughtUpDesc:
      "अभी उपलब्ध मॉड्यूल आपने पूरे कर लिए हैं। यात्रा आगे बढ़ने पर नए मॉड्यूल खुलेंगे।",
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
    pillTemplate: "→ {pct}% पूर्ण · {total} में से मॉड्यूल {n}",
    resume: "जारी रखें →",
    steps: ["विचार समझें", "अभ्यास और निर्णय", "एक छोटा कार्य आज़माएँ"],
    moduleTag: "मॉड्यूल {n}",
    phaseLabel: "चरण {n}",
    lockedTag: "लॉक",
    comingTitle: "आपकी यात्रा में आगे",
  },
  lesson: {
    minutes: 4,
  },
  assessment: {
    exit: "बाहर",
    hint: "पिछले 3 महीनों के बारे में सोचें — जो वास्तव में हुआ उसके लिए उत्तर दें, न कि जो आप करना चाहते हैं।",
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
  player: {
    back: "बाहर",
    continue: "जारी रखें",
    check: "उत्तर जाँचें",
    correct: "सही",
    incorrect: "बिलकुल नहीं — दूसरी बकेट आज़माएँ",
    bestMove: "बेहतरीन कदम",
    complete: "पूर्ण करें · लय बनाए रखें 🔥",
    counter: "{n} / {total}",
    lockedMsg: "अगला मॉड्यूल खोलने के लिए इस मॉड्यूल के प्रश्नों के उत्तर दें।",
    retakeMsg: "आपका स्कोर {pct}% रहा। अगला मॉड्यूल खोलने के लिए कम से कम 60% चाहिए — इसे दोबारा करें।",
    retake: "मॉड्यूल दोबारा करें",
    goToQuestions: "प्रश्नों पर जाएँ",
    reveal: "दिखाएँ",
    hide: "छिपाएँ",
    save: "सहेजें",
    saved: "सहेजा गया",
    choosePlaceholder: "एक फ़ोकस क्षेत्र चुनें…",
    addItem: "एक और जोड़ें",
    remove: "हटाएँ",
    namePlaceholder: "नाम या भूमिका",
    relationship: "संबंध",
    power: "प्रभाव",
    interest: "रुचि",
    levelLow: "कम",
    levelMedium: "मध्यम",
    levelHigh: "उच्च",
  },
  analytics: {
    eyebrow: "आपकी गतिविधि",
    title: "आप कैसे सीख रहे हैं",
    lede: "अब तक आपका समय, गति और प्रगति — सिर्फ़ आपके लिए।",
    totalTime: "कुल समय",
    activeDays: "सक्रिय दिन",
    completed: "मॉड्यूल पूर्ण",
    skipped: "छोड़े गए हिस्से",
    timeByModuleTitle: "प्रति मॉड्यूल समय",
    dailyTitle: "दैनिक गतिविधि",
    minutesUnit: "{n} मिनट",
    noData: "अभी कोई गतिविधि नहीं — एक मॉड्यूल शुरू करें और आपके आँकड़े यहाँ दिखेंगे।",
  },
  admin: {
    title: "उपयोगकर्ता विश्लेषण",
    lede: "हर सीखने वाले की प्रगति, उत्तर, समय और छोड़े गए हिस्से।",
    totalUsers: "उपयोगकर्ता",
    totalOnboarded: "ऑनबोर्ड हुए",
    totalCompleted: "मॉड्यूल पूर्ण",
    totalTime: "कुल समय",
    searchPlaceholder: "नाम या ईमेल से खोजें",
    colUser: "उपयोगकर्ता",
    colEmail: "ईमेल",
    colStreak: "लय",
    colProgress: "पूर्ण",
    colTime: "समय",
    colLastActive: "अंतिम सक्रिय",
    never: "कभी नहीं",
    adminTag: "एडमिन",
    back: "← सभी उपयोगकर्ता",
    secProgress: "मॉड्यूल प्रगति",
    secResponses: "मॉड्यूल उत्तर",
    secAssessment: "कौशल-जाँच उत्तर",
    secOnboarding: "ऑनबोर्डिंग उत्तर",
    secTime: "प्रति मॉड्यूल समय",
    secSkips: "छोड़े गए हिस्से",
    secDaily: "दैनिक गतिविधि",
    statusLabel: "स्थिति",
    scoreLabel: "स्कोर",
    reflectionLabel: "चिंतन",
    moduleLabel: "मॉड्यूल {n}",
    screenLabel: "स्क्रीन {n}",
    skipLabel: "स्क्रीन {n} पर {kind} छोड़ा",
    correctTag: "सही",
    wrongTag: "गलत",
    noResponses: "कोई उत्तर दर्ज नहीं।",
    noSkips: "कोई हिस्सा नहीं छोड़ा।",
    noUsers: "अभी कोई उपयोगकर्ता नहीं।",
    minutesUnit: "{n} मिनट",
    valueLabel: "{n}/5 दिया",
  },
  ga: {
    title: "प्रोडक्ट विश्लेषण (Google Analytics)",
    lede: "सभी का गुमनाम, समग्र उपयोग — कोई व्यक्तिगत डेटा नहीं।",
    notConfigured: "Google Analytics अभी जुड़ा नहीं है। समग्र उपयोग देखने के लिए क्रेडेंशियल जोड़ें।",
    activeUsers: "सक्रिय उपयोगकर्ता",
    newUsers: "नए उपयोगकर्ता",
    sessions: "सेशन",
    avgEngagement: "औसत सहभागिता",
    topEvents: "शीर्ष इवेंट",
    dailyActive: "दैनिक सक्रिय उपयोगकर्ता",
    secondsUnit: "{n}से",
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
    admin: "అడ్మిన్",
    home: "హోమ్",
    journey: "నా ప్రయాణం",
    journeyBadge: "వా2",
    lesson: "నేటి పాఠం",
    results: "నైపుణ్య ప్రొఫైల్",
    team: "టీమ్ పల్స్",
    assessment: "మళ్లీ తనిఖీ",
    analytics: "నా విశ్లేషణ",
    adminPanel: "వినియోగదారు విశ్లేషణ",
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
    analytics: "నా విశ్లేషణ",
    admin: "అడ్మిన్ · వినియోగదారు విశ్లేషణ",
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
    stepLabel: "దశ {n} / {total}",
  },
  auth: {
    eyebrow: "దయచేసి మీ వివరాలను నమోదు చేయండి",
    title: "తిరిగి స్వాగతం",
    sub: "లాగిన్ అయ్యి, మీ ప్రయాణాన్ని ఆపిన చోటు నుండే కొనసాగించండి.",
    emailPlaceholder: "ఇమెయిల్ చిరునామా",
    passwordPlaceholder: "పాస్‌వర్డ్",
    remember: "30 రోజులు గుర్తుంచుకో",
    forgot: "పాస్‌వర్డ్ మర్చిపోయారా?",
    login: "లాగిన్",
    noAccount: "ఖాతా లేదా?",
    signUp: "సైన్ అప్",
    namePlaceholder: "మీ పేరు",
    signupTitle: "మీ ఖాతాను సృష్టించండి",
    signupSub: "మీ ప్రయాణాన్ని ప్రారంభించడానికి సైన్ అప్ చేయండి — మీ పురోగతి మీ ఖాతాలో సేవ్ అవుతుంది.",
    createAccount: "ఖాతాను సృష్టించండి",
    haveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    working: "దయచేసి వేచి ఉండండి…",
    forgotSent: "పాస్‌వర్డ్ రీసెట్ లింక్ కోసం మీ ఇమెయిల్‌ను చూడండి.",
    forgotPrompt: "ముందుగా పైన మీ ఇమెయిల్‌ను నమోదు చేయండి, ఆపై 'పాస్‌వర్డ్ మర్చిపోయారా' నొక్కండి.",
    error: "ఏదో తప్పు జరిగింది. మీ వివరాలను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.",
    errInvalidCreds: "ఇమెయిల్ లేదా పాస్‌వర్డ్ తప్పు.",
    errUserExists: "ఈ ఇమెయిల్‌తో ఖాతా ఇప్పటికే ఉంది — లాగిన్ అవ్వండి.",
    errRateLimit: "చాలా ప్రయత్నాలు — ఒక నిమిషం ఆగి మళ్లీ ప్రయత్నించండి.",
    errWeakPassword: "పాస్‌వర్డ్ చాలా బలహీనంగా ఉంది — కనీసం 8 అక్షరాలు వాడండి.",
    passwordShort: "పాస్‌వర్డ్‌లో కనీసం 8 అక్షరాలు ఉండాలి.",
  },
  account: {
    title: "ఖాతా సెట్టింగ్‌లు",
    nameLabel: "ప్రదర్శన పేరు",
    roleLabel: "పాత్ర",
    languageLabel: "భాష",
    save: "మార్పులను సేవ్ చేయండి",
    saved: "సేవ్ చేయబడింది.",
    passwordTitle: "పాస్‌వర్డ్ మార్చండి",
    newPassword: "కొత్త పాస్‌వర్డ్",
    updatePassword: "పాస్‌వర్డ్ నవీకరించండి",
    passwordUpdated: "పాస్‌వర్డ్ నవీకరించబడింది.",
    dangerTitle: "ఖాతాను తొలగించండి",
    dangerDesc: "ఇది మీ ఖాతాను మరియు మీ మొత్తం పురోగతిని శాశ్వతంగా తొలగిస్తుంది. దీన్ని తిరిగి పొందలేరు.",
    deleteCta: "నా ఖాతాను తొలగించండి",
    confirmHint: "నిర్ధారించడానికి DELETE అని టైప్ చేయండి",
    confirmWord: "DELETE",
    deleting: "తొలగిస్తోంది…",
    signOut: "లాగ్ అవుట్",
    close: "మూసివేయండి",
  },
  cookie: {
    message:
      "అవసరమైన కుకీలు మిమ్మల్ని సైన్ ఇన్‌లో ఉంచుతాయి. మీ సమ్మతితో, యాప్ వినియోగాన్ని అర్థం చేసుకోవడానికి Google Analytics కూడా ఉపయోగిస్తాము.",
    accept: "విశ్లేషణ అంగీకరించు",
    decline: "అవసరమైనవి మాత్రమే",
  },
  dashboard: {
    eyebrowDate: "{total}లో మాడ్యూల్ {n}",
    greetings: {
      morning: "శుభోదయం, {name}.",
      afternoon: "శుభ మధ్యాహ్నం, {name}.",
      evening: "శుభ సాయంత్రం, {name}.",
    },
    sub: "ఈ వారం మీరు కొత్త అలవాట్లను నిర్మిస్తున్నారు. ఈరోజు ఒక చిన్న చర్య మీ స్ట్రీక్‌ను నిలుపుతుంది.",
    continueCta: "నేటి పాఠాన్ని కొనసాగించండి →",
    nextStepKicker: "మీ తదుపరి ఉత్తమ అడుగు · {n} నిమి.",
    caughtUpTitle: "మీరు పూర్తిగా తాజాగా ఉన్నారు",
    caughtUpDesc:
      "ప్రస్తుతం అందుబాటులో ఉన్న మాడ్యూల్‌లను మీరు పూర్తి చేశారు. ప్రయాణం కొనసాగుతున్న కొద్దీ కొత్తవి తెరుచుకుంటాయి.",
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
    pillTemplate: "→ {pct}% పూర్తి · {total}లో మాడ్యూల్ {n}",
    resume: "కొనసాగించు →",
    steps: ["భావనను నేర్చుకోండి", "అభ్యాసం & నిర్ణయం", "ఒక చిన్న చర్య ప్రయత్నించండి"],
    moduleTag: "మాడ్యూల్ {n}",
    phaseLabel: "దశ {n}",
    lockedTag: "లాక్",
    comingTitle: "మీ ప్రయాణంలో మరిన్ని",
  },
  lesson: {
    minutes: 4,
  },
  assessment: {
    exit: "నిష్క్రమించు",
    hint: "గత 3 నెలల గురించి ఆలోచించండి — మీరు ఏం చేయాలనుకుంటున్నారో కాదు, నిజంగా ఏం జరిగిందో దానికి సమాధానమివ్వండి.",
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
  player: {
    back: "నిష్క్రమించు",
    continue: "కొనసాగించు",
    check: "సమాధానాలు తనిఖీ చేయి",
    correct: "సరైనది",
    incorrect: "సరికాదు — మరో బకెట్ ప్రయత్నించండి",
    bestMove: "ఉత్తమ ఎంపిక",
    complete: "పూర్తి చేయి · స్ట్రీక్ నిలుపు 🔥",
    counter: "{n} / {total}",
    lockedMsg: "తదుపరి మాడ్యూల్‌ను అన్‌లాక్ చేయడానికి ఈ మాడ్యూల్‌లోని ప్రశ్నలకు సమాధానం ఇవ్వండి.",
    retakeMsg: "మీ స్కోరు {pct}%. తదుపరి మాడ్యూల్ అన్‌లాక్ కావాలంటే కనీసం 60% కావాలి — మళ్లీ ప్రయత్నించండి.",
    retake: "మాడ్యూల్ మళ్లీ చేయి",
    goToQuestions: "ప్రశ్నలకు వెళ్లండి",
    reveal: "చూపించు",
    hide: "దాచు",
    save: "సేవ్ చేయి",
    saved: "సేవ్ అయింది",
    choosePlaceholder: "ఫోకస్ ప్రాంతాన్ని ఎంచుకోండి…",
    addItem: "మరొకటి జోడించు",
    remove: "తొలగించు",
    namePlaceholder: "పేరు లేదా పాత్ర",
    relationship: "సంబంధం",
    power: "అధికారం",
    interest: "ఆసక్తి",
    levelLow: "తక్కువ",
    levelMedium: "మధ్యస్థం",
    levelHigh: "ఎక్కువ",
  },
  analytics: {
    eyebrow: "మీ కార్యకలాపం",
    title: "మీరు ఎలా నేర్చుకుంటున్నారు",
    lede: "ఇప్పటివరకు మీ సమయం, వేగం, పురోగతి — మీ కోసమే.",
    totalTime: "మొత్తం సమయం",
    activeDays: "క్రియాశీల రోజులు",
    completed: "పూర్తయిన మాడ్యూల్‌లు",
    skipped: "దాటవేసిన భాగాలు",
    timeByModuleTitle: "మాడ్యూల్‌కు సమయం",
    dailyTitle: "రోజువారీ కార్యకలాపం",
    minutesUnit: "{n} నిమి",
    noData: "ఇంకా కార్యకలాపం లేదు — ఒక మాడ్యూల్ ప్రారంభించండి, మీ గణాంకాలు ఇక్కడ కనిపిస్తాయి.",
  },
  admin: {
    title: "వినియోగదారు విశ్లేషణ",
    lede: "ప్రతి అభ్యాసకుని పురోగతి, సమాధానాలు, సమయం, దాటవేతలు.",
    totalUsers: "వినియోగదారులు",
    totalOnboarded: "ఆన్‌బోర్డ్ అయినవారు",
    totalCompleted: "పూర్తయిన మాడ్యూల్‌లు",
    totalTime: "మొత్తం సమయం",
    searchPlaceholder: "పేరు లేదా ఇమెయిల్‌తో వెతకండి",
    colUser: "వినియోగదారు",
    colEmail: "ఇమెయిల్",
    colStreak: "స్ట్రీక్",
    colProgress: "పూర్తయింది",
    colTime: "సమయం",
    colLastActive: "చివరి సారి క్రియాశీలం",
    never: "ఎప్పుడూ లేదు",
    adminTag: "అడ్మిన్",
    back: "← అందరు వినియోగదారులు",
    secProgress: "మాడ్యూల్ పురోగతి",
    secResponses: "మాడ్యూల్ సమాధానాలు",
    secAssessment: "నైపుణ్య-తనిఖీ సమాధానాలు",
    secOnboarding: "ఆన్‌బోర్డింగ్ సమాధానాలు",
    secTime: "మాడ్యూల్‌కు సమయం",
    secSkips: "దాటవేసిన భాగాలు",
    secDaily: "రోజువారీ కార్యకలాపం",
    statusLabel: "స్థితి",
    scoreLabel: "స్కోరు",
    reflectionLabel: "ఆలోచన",
    moduleLabel: "మాడ్యూల్ {n}",
    screenLabel: "స్క్రీన్ {n}",
    skipLabel: "స్క్రీన్ {n}లో {kind} దాటవేశారు",
    correctTag: "సరి",
    wrongTag: "తప్పు",
    noResponses: "సమాధానాలు నమోదు కాలేదు.",
    noSkips: "దాటవేసిన భాగాలు లేవు.",
    noUsers: "ఇంకా వినియోగదారులు లేరు.",
    minutesUnit: "{n} నిమి",
    valueLabel: "{n}/5 ఇచ్చారు",
  },
  ga: {
    title: "ప్రోడక్ట్ విశ్లేషణ (Google Analytics)",
    lede: "అందరి అనామక, సమగ్ర వినియోగం — వ్యక్తిగత డేటా లేదు.",
    notConfigured: "Google Analytics ఇంకా కనెక్ట్ కాలేదు. సమగ్ర వినియోగం చూడటానికి క్రెడెన్షియల్స్ జోడించండి.",
    activeUsers: "క్రియాశీల వినియోగదారులు",
    newUsers: "కొత్త వినియోగదారులు",
    sessions: "సెషన్‌లు",
    avgEngagement: "సగటు నిమగ్నత",
    topEvents: "టాప్ ఈవెంట్‌లు",
    dailyActive: "రోజువారీ క్రియాశీల వినియోగదారులు",
    secondsUnit: "{n}సె",
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
