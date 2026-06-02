# Lead4wd Prototype - Project Transfer Document

This document contains all the necessary context, architecture details, and feature explanations for the **Lead4wd Prototype** web application. Provide this document to any new AI assistant so they can instantly understand the project state and pick up right where we left off.

## Project Overview
Lead4wd is a micro-learning platform designed to help new managers improve their leadership, communication, and delegation skills. The application provides bite-sized modules containing multiple-choice questions.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript / React
- **Styling:** Vanilla CSS (`src/app/globals.css`) with a mobile-first responsive architecture.
- **Deployment:** Vercel (Auto-deploys on push to the `master` branch in GitHub).
- **State Management:** React `useState` coupled with browser `sessionStorage` for persistence.

## Architecture & Data Flow

### 1. Single Page Application (SPA) Structure
The entire application logic is currently housed within a single file: `src/app/page.tsx`. 
It uses a state machine pattern (`appState`) to navigate between screens without full page reloads:
- `"LANGUAGE_SELECT"` -> `"ONBOARDING"` -> `"AUTH"` -> `"DASHBOARD"` <-> `"QUESTION_PLAYER"` / `"PROFILE"`

### 2. Data Layer
All content is statically defined in `src/data/mock.ts`. 
- **`UI_STRINGS`**: A dictionary containing all hardcoded UI text (buttons, labels, headers).
- **`MOCK_MODULES`**: Contains the course curriculum (Modules -> Questions -> Options).
- **`ONBOARDING_QUESTIONS`**: Initial survey questions asked after language selection.

### 3. State Persistence
User data is persisted in the browser's `sessionStorage`.
- **`lead4wd_logged_in_user`**: Stores the mock username.
- **`lead4wd_progress_[username]`**: Stores the user's progress. 

The Progress state is structured as:
```typescript
type ProgressState = Record<string, { 
  status: "correct" | "wrong", 
  selectedIndex: number 
}>;
```
This ensures that when a user revisits a question, the UI can re-highlight the exact option they previously selected.

## Key Features Implemented

### 1. Multi-Language Support (i18n)
- **Languages Supported:** English (`en`), Hindi (`hi`), and Telugu (`te`).
- **Flow:** When a user opens the app in a new session, they are forced to select a language via the `LanguageSelector` component. 
- **Dynamic Updates:** The selected language is stored in React state. Users can change it at any time via a dropdown in the `Profile` component. Changing the language instantly swaps out the `UI_STRINGS` and `MOCK_MODULES` data objects, translating the entire app instantly without a reload.

### 2. Responsive UI Redesign
The CSS in `globals.css` was entirely refactored for a premium, responsive experience.
- **Mobile-First:** By default, elements stack vertically taking up 100% width (perfect for phones).
- **Desktop Scaling:** Media queries (`@media (min-width: 768px)`) wrap the content in centered, styled cards (`.card`, `.container`) so the UI doesn't stretch awkwardly on ultra-wide monitors.
- **Key UI Elements:** CSS Grid is used for the Profile layout, and Flexbox is heavily utilized for centering and alignment. 

### 3. Cross-Module Navigation
The `QuestionPlayer` component intelligently tracks where the user is in the curriculum.
- It calculates: `isLastQuestionOfModule` and `isLastQuestionOverall`.
- If a user completes Module 1, Question 3, the "Next" button automatically changes to **"Next Module"**.
- Clicking "Next Module" instantly increments the `activeModuleIndex` and resets the `currentQuestionIndex` to `0`, seamlessly transitioning the user to the next topic.
- At the very end of the course, the button becomes **"Finish Course"** and routes them back to the Dashboard.

## Known Limitations & Future Work
- **Wispr Flow API:** Originally, there was a plan to integrate voice-to-text using the Wispr Flow API, but this was scrapped in favor of multi-language support. An `.env.local` file was created, but the API integration code was not written.
- **Backend/Database:** Everything currently runs client-side using `sessionStorage`. If the project scales, it will need a real database (like PostgreSQL/Prisma or Firebase) to persist user progress permanently across devices. 
- **Component Splitting:** As the app grows, `src/app/page.tsx` (which is over 600 lines) should be split into smaller, dedicated files (e.g., `components/Dashboard.tsx`, `components/QuestionPlayer.tsx`).

## How to Resume Work
1. Read this document thoroughly.
2. Review `src/app/page.tsx` to understand the state machine and component structure.
3. Review `src/app/globals.css` to understand the styling tokens and responsive classes.
4. Execute `npm run dev` to start the local development server.
