export type Question = {
  id: string;
  number: number;
  text: string;
  options: string[];
  correctOptionIndex?: number;
};

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    number: 1,
    text: "When a team member shares a concern, what should your first step be?",
    options: [
      "Suggest a solution immediately to save time",
      "Ask clarifying questions to understand their view",
      "Remind them of the project deadline",
      "Assign the problem to someone else"
    ],
    correctOptionIndex: 1
  },
  {
    id: "q2",
    number: 2,
    text: "In 1:1 meetings, what is the best practice for giving your full attention?",
    options: [
      "Keep your phone on the desk just in case",
      "Multitask on minor emails while they speak",
      "Turn off notifications and let them do most of the talking",
      "Only schedule them when you have no other work"
    ],
    correctOptionIndex: 2
  },
  {
    id: "q3",
    number: 3,
    text: "How should you handle delegating a meaningful task?",
    options: [
      "Step back in to fix it if they do it differently than you would",
      "Only delegate tasks you don't want to do",
      "Be clear about the outcome and decision rights, then let them own it",
      "Give them the task without any timeline to reduce pressure"
    ],
    correctOptionIndex: 2
  },
  {
    id: "q4",
    number: 4,
    text: "When delivering feedback, which approach is most effective?",
    options: [
      "Wait for the annual performance review",
      "Give specific feedback shortly after the real work situation occurs",
      "Only give positive feedback to maintain morale",
      "Deliver it in front of the whole team so everyone learns"
    ],
    correctOptionIndex: 1
  },
  {
    id: "q5",
    number: 5,
    text: "If you notice repeated tension between two team members, you should:",
    options: [
      "Hope it resolves itself over time",
      "Reassign one of them to a different project",
      "Bring it up directly and facilitate an honest conversation",
      "Ignore it unless it affects the project delivery"
    ],
    correctOptionIndex: 2
  }
];

export const ONBOARDING_QUESTIONS = [
  {
    id: "o1",
    text: "What is your primary goal for using Lead4wd?",
    options: [
      "I'm a new manager looking for guidance",
      "I want to improve my communication skills",
      "I need help navigating team conflicts",
      "I want to learn how to delegate effectively"
    ]
  },
  {
    id: "o2",
    text: "How much time can you dedicate to learning each week?",
    options: [
      "10-15 minutes (Micro-learning)",
      "30-60 minutes",
      "1-2 hours",
      "More than 2 hours"
    ]
  }
];
