"use client";

import { useState, useEffect } from "react";
import { MOCK_MODULES, ONBOARDING_QUESTIONS, Module, LanguageCode, UI_STRINGS } from "@/data/mock";

type AppState = "LANGUAGE_SELECT" | "ONBOARDING" | "AUTH" | "DASHBOARD" | "QUESTION_PLAYER" | "PROFILE";
type ProgressState = Record<string, { status: "correct" | "wrong", selectedIndex: number }>;

export default function Home() {
  const [appState, setAppState] = useState<AppState>("LANGUAGE_SELECT");
  const [language, setLanguage] = useState<LanguageCode | null>(null);
  
  // User State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  // Progress State
  const [completedQuestions, setCompletedQuestions] = useState<ProgressState>({});
  
  // Player State
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Clear session on reload to force logout and redirect to language select
  useEffect(() => {
    sessionStorage.clear();
    setTimeout(() => {
      setCurrentUser(null);
      setCompletedQuestions({});
      setLanguage(null);
      setAppState("LANGUAGE_SELECT");
    }, 0);
  }, []);

  // Sync progress to sessionStorage
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(`lead4wd_progress_${currentUser}`, JSON.stringify(completedQuestions));
    }
  }, [completedQuestions, currentUser]);

  const handleLogout = () => {
    sessionStorage.removeItem("lead4wd_logged_in_user");
    setCurrentUser(null);
    setCompletedQuestions({});
    setAppState("AUTH");
  };

  const handleLogin = (username: string) => {
    sessionStorage.setItem("lead4wd_logged_in_user", username);
    setCurrentUser(username);
    
    // Load progress for this user
    const savedState = sessionStorage.getItem(`lead4wd_progress_${username}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const migratedState: ProgressState = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value === "string") {
            migratedState[key] = { status: value as "correct" | "wrong", selectedIndex: -1 };
          } else {
            migratedState[key] = value as any;
          }
        }
        setCompletedQuestions(migratedState);
      } catch (e) {
        setCompletedQuestions({});
      }
    } else {
      setCompletedQuestions({});
    }
    
    setAppState("DASHBOARD");
  };

  const handleSelectLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    setAppState("ONBOARDING");
  };

  // Safe accessor for UI Strings
  const ui = UI_STRINGS[language || 'en'];
  const modules = MOCK_MODULES[language || 'en'];
  const activeModule = activeModuleIndex !== null ? modules[activeModuleIndex] : null;

  return (
    <main>
      {appState === "LANGUAGE_SELECT" && (
        <LanguageSelector onSelect={handleSelectLanguage} />
      )}
      {appState === "ONBOARDING" && language && (
        <Onboarding language={language} ui={ui} onComplete={() => setAppState("AUTH")} />
      )}
      {appState === "AUTH" && language && (
        <Auth ui={ui} onLogin={handleLogin} />
      )}
      {appState === "DASHBOARD" && currentUser && language && (
        <Dashboard 
          username={currentUser}
          ui={ui}
          modules={modules}
          completedQuestions={completedQuestions}
          onOpenProfile={() => setAppState("PROFILE")}
          onSelectQuestion={(modIdx, qIdx) => {
            setActiveModuleIndex(modIdx);
            setCurrentQuestionIndex(qIdx);
            setAppState("QUESTION_PLAYER");
          }}
        />
      )}
      {appState === "QUESTION_PLAYER" && activeModule && language && (
        <QuestionPlayer 
          activeModuleIndex={activeModuleIndex!}
          modules={modules}
          ui={ui}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          setActiveModuleIndex={setActiveModuleIndex}
          completedQuestions={completedQuestions}
          setCompletedQuestions={setCompletedQuestions}
          onBack={() => setAppState("DASHBOARD")}
        />
      )}
      {appState === "PROFILE" && currentUser && language && (
        <Profile 
          username={currentUser} 
          language={language}
          setLanguage={setLanguage}
          ui={ui}
          onBack={() => setAppState("DASHBOARD")} 
          onLogout={handleLogout} 
        />
      )}
    </main>
  );
}

// --- Components ---

function LanguageSelector({ onSelect }: { onSelect: (lang: LanguageCode) => void }) {
  return (
    <div className="container flex-center" style={{ flex: 1, minHeight: '100vh' }}>
      <div className="card">
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Select Your Language</h1>
          <p style={{ color: 'var(--text-secondary)' }}>अपनी भाषा चुनें / మీ భాషను ఎంచుకోండి</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="primary-button" onClick={() => onSelect('en')}>English</button>
          <button className="primary-button" onClick={() => onSelect('hi')}>हिन्दी (Hindi)</button>
          <button className="primary-button" onClick={() => onSelect('te')}>తెలుగు (Telugu)</button>
        </div>
      </div>
    </div>
  );
}

function Onboarding({ language, ui, onComplete }: { language: LanguageCode, ui: Record<string, string>, onComplete: () => void }) {
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const questions = ONBOARDING_QUESTIONS[language];
  const question = questions[onboardingIndex];
  
  return (
    <div className="container flex-center" style={{ flex: 1, minHeight: '100vh' }}>
      <div className="card">
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: 'var(--accent-color)', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>{ui.welcomeTitle}</p>
          <h1 style={{ fontSize: '28px' }}>{question.text}</h1>
        </div>
        <div>
          {question.options.map((opt, i) => (
            <div 
              key={i} 
              className="option-card"
              onClick={() => {
                if (onboardingIndex < questions.length - 1) {
                  setOnboardingIndex(prev => prev + 1);
                } else {
                  onComplete();
                }
              }}
              style={{ padding: '16px' }}
            >
              <div className="option-indicator" style={{ width: '20px', height: '20px' }}></div>
              <span style={{ fontWeight: 500, fontSize: '15px' }}>{opt}</span>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="secondary-button" style={{ color: 'var(--text-tertiary)', padding: 0 }} onClick={onComplete}>
            {ui.skip}
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {questions.map((_, i) => (
              <div 
                key={i} 
                style={{
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: i === onboardingIndex ? 'var(--accent-color)' : 'var(--border-color)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Auth({ ui, onLogin }: { ui: Record<string, string>, onLogin: (username: string) => void }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [dummyForgotMsg, setDummyForgotMsg] = useState(false);
  const [dummyGoogleMsg, setDummyGoogleMsg] = useState(false);
  const [dummySignUpMsg, setDummySignUpMsg] = useState(false);

  const handleLogin = () => {
    if (!identifier.trim()) {
      setIdentifier("GuestUser");
    }
    onLogin(identifier.trim() || "GuestUser");
  };

  return (
    <div className="container flex-center" style={{ flex: 1, minHeight: '100vh' }}>
      <div className="card">
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{ui.enterDetails}</p>
        <h1 style={{ marginBottom: '32px', fontSize: '32px' }}>{ui.welcomeBack}</h1>
        
        <input 
          type="text" 
          placeholder={ui.emailPlaceholder} 
          className="input-field" 
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          style={{ marginBottom: '16px' }}
        />
        
        <input 
          type="password" 
          placeholder={ui.passwordPlaceholder} 
          className="input-field" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '16px' }}
        />
        
        <div className="auth-options">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
             <label htmlFor="remember" style={{ color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer' }}>{ui.rememberMe}</label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <button className="secondary-button" style={{ padding: 0 }} onClick={() => setDummyForgotMsg(true)}>
              {ui.forgotPassword}
            </button>
            {dummyForgotMsg && <span style={{ color: 'var(--error-color)', fontSize: '10px', marginTop: '4px' }}>{ui.dummyBtn}</span>}
          </div>
        </div>
        
        <button className="primary-button" onClick={handleLogin} style={{ marginBottom: '16px' }}>
          {ui.login}
        </button>
        
        <button 
          className="secondary-button icon-button" 
          onClick={() => setDummyGoogleMsg(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
            <path d="M12 16v-8"></path>
            <path d="M8 12h8"></path>
          </svg>
          {ui.signInGoogle}
        </button>
        {dummyGoogleMsg && <p style={{ color: 'var(--error-color)', fontSize: '12px', textAlign: 'center', marginBottom: '8px' }}>{ui.dummyBtn}</p>}
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {ui.noAccount} <button className="secondary-button" style={{ padding: 0, fontSize: '14px' }} onClick={() => setDummySignUpMsg(true)}>{ui.signUp}</button>
          {dummySignUpMsg && <p style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>{ui.dummyBtn}</p>}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ username, ui, modules, completedQuestions, onOpenProfile, onSelectQuestion }: { 
  username: string,
  ui: Record<string, string>,
  modules: Module[],
  completedQuestions: ProgressState, 
  onOpenProfile: () => void, 
  onSelectQuestion: (modIdx: number, qIdx: number) => void 
}) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "m1": true // Expand first module by default
  });

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalQuestions = modules.reduce((acc, mod) => acc + mod.questions.length, 0);
  const correctCount = Object.values(completedQuestions).filter(val => val.status === "correct").length;
  const percentage = Math.round((correctCount / totalQuestions) * 100) || 0;

  return (
    <div className="container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <header className="dashboard-header">
        <h1 style={{ fontSize: '24px', margin: 0 }}>{ui.welcomeUser} {username}</h1>
        <div 
          onClick={onOpenProfile}
          className="profile-badge"
        >
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{ui.profile}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </header>

      <div className="progress-banner">
        <div className="progress-ring-container">
            <svg width="80" height="80" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent-color)" strokeWidth="8" 
                strokeDasharray={`${251.2 * (percentage / 100)} 251.2`}
              />
            </svg>
            <div className="progress-percentage">{percentage}%</div>
        </div>
        <div>
          <h2 style={{ fontSize: '20px' }}>{ui.yourProgress}</h2>
          <p style={{ fontSize: '14px' }}>{ui.completedPrefix} {correctCount} {ui.outOf} {totalQuestions} {ui.completedSuffix}</p>
        </div>
      </div>

      <div className="modules-grid">
        {modules.map((module, modIdx) => {
          const isExpanded = expandedModules[module.id];
          return (
            <div key={module.id} className="module-accordion">
              <div 
                className="module-header"
                onClick={() => toggleModule(module.id)}
              >
                <h2 style={{ fontSize: '18px', margin: 0 }}>{module.title}</h2>
                <svg 
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              {isExpanded && (
                <div className="module-content">
                  {module.questions.map((q, qIdx) => {
                    const status = completedQuestions[q.id]?.status;
                    return (
                      <div 
                        key={q.id}
                        className={`list-item`}
                        onClick={() => onSelectQuestion(modIdx, qIdx)}
                        style={{ borderColor: status === "correct" ? "var(--success-color)" : status === "wrong" ? "var(--error-color)" : "var(--border-color)" }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1, paddingRight: '16px' }}>
                            <span style={{ 
                              color: status === "correct" ? "var(--success-color)" : status === "wrong" ? "var(--error-color)" : "var(--text-tertiary)",
                              fontSize: '12px', 
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {ui.question} {q.number} {status === "wrong" && `- ${ui.needsReview}`}
                            </span>
                            <p style={{ color: 'var(--text-primary)', marginTop: '8px', fontWeight: 500, fontSize: '14px' }}>
                              {q.text}
                            </p>
                          </div>
                          {status === "correct" && (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                          {status === "wrong" && (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--error-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionPlayer({ 
  activeModuleIndex, 
  modules, 
  ui, 
  currentQuestionIndex, 
  setCurrentQuestionIndex, 
  setActiveModuleIndex,
  completedQuestions, 
  setCompletedQuestions, 
  onBack 
}: {
  activeModuleIndex: number,
  modules: Module[],
  ui: Record<string, string>,
  currentQuestionIndex: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setActiveModuleIndex: React.Dispatch<React.SetStateAction<number | null>>,
  completedQuestions: ProgressState,
  setCompletedQuestions: React.Dispatch<React.SetStateAction<ProgressState>>,
  onBack: () => void
}) {
  const activeModule = modules[activeModuleIndex];
  const q = activeModule.questions[currentQuestionIndex];
  const progress = completedQuestions[q.id];
  const status = progress?.status;
  const isCorrect = status === "correct";
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Is this the very last question of the entire course?
  const isLastModule = activeModuleIndex === modules.length - 1;
  const isLastQuestionOfModule = currentQuestionIndex === activeModule.questions.length - 1;
  const isLastQuestionOverall = isLastModule && isLastQuestionOfModule;

  useEffect(() => {
    const savedProgress = completedQuestions[q.id];
    if (savedProgress && savedProgress.selectedIndex !== undefined && savedProgress.selectedIndex !== -1) {
      setSelectedOption(savedProgress.selectedIndex);
    } else if (savedProgress && savedProgress.status === "correct" && q.correctOptionIndex !== undefined) {
      setSelectedOption(q.correctOptionIndex);
    } else {
      setSelectedOption(null);
    }
  }, [q.id]); // Only run when navigating to a new question

  const handleSubmit = () => {
    if (selectedOption !== null) {
      if (selectedOption === q.correctOptionIndex) {
        setCompletedQuestions(prev => ({ ...prev, [q.id]: { status: "correct", selectedIndex: selectedOption } }));
      } else {
        setCompletedQuestions(prev => ({ ...prev, [q.id]: { status: "wrong", selectedIndex: selectedOption } }));
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestionOfModule) {
      if (isLastQuestionOverall) {
        onBack();
      } else {
        // Go to Next Module
        setActiveModuleIndex(activeModuleIndex + 1);
        setCurrentQuestionIndex(0);
      }
    } else {
      // Go to next question in same module
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  return (
    <div className="player-layout">
      <header className="player-header">
        <button className="secondary-button back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="hide-on-mobile">{ui.back}</span>
        </button>
        <div className="player-title">
          {activeModule.title} - Q{q.number}
        </div>
        <div style={{ width: '80px' }}></div>
      </header>

      <div className="container player-body">
        <div className="player-content">
          <h1 className="question-text">{q.text}</h1>
          
          <div className="options-grid">
            {q.options.map((opt, idx) => (
              <div 
                key={idx}
                className={`option-card ${selectedOption === idx ? 'selected' : ''}`}
                onClick={() => !isCorrect && setSelectedOption(idx)}
                style={{ 
                  opacity: isCorrect && selectedOption !== idx ? 0.5 : 1,
                  borderColor: isCorrect && selectedOption === idx ? 'var(--success-color)' : '',
                  backgroundColor: isCorrect && selectedOption === idx ? 'rgba(16, 185, 129, 0.15)' : ''
                }}
              >
                <div className="option-indicator" style={{ borderColor: isCorrect && selectedOption === idx ? 'var(--success-color)' : '', backgroundColor: isCorrect && selectedOption === idx ? 'var(--success-color)' : '' }}>
                  {selectedOption === idx && <div style={{ width: '12px', height: '12px', backgroundColor: 'white', borderRadius: '50%' }} />}
                </div>
                <span style={{ fontSize: '16px' }}>{opt}</span>
              </div>
            ))}
          </div>
          
          {status === "wrong" && !isCorrect && (
             <div className="error-banner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{ui.incorrect}</span>
             </div>
          )}
        </div>
      </div>

      <footer className="player-footer">
        <button 
          className="secondary-button" 
          disabled={currentQuestionIndex === 0 && activeModuleIndex === 0}
          onClick={() => {
            if (currentQuestionIndex === 0 && activeModuleIndex > 0) {
              setActiveModuleIndex(activeModuleIndex - 1);
              setCurrentQuestionIndex(modules[activeModuleIndex - 1].questions.length - 1);
            } else {
              setCurrentQuestionIndex(prev => prev - 1);
            }
          }}
          style={{ opacity: currentQuestionIndex === 0 && activeModuleIndex === 0 ? 0.5 : 1 }}
        >
          {ui.previous}
        </button>
        
        {!isCorrect ? (
          <button 
            className="primary-button submit-button" 
            disabled={selectedOption === null}
            onClick={handleSubmit}
          >
            {ui.submitAnswer}
          </button>
        ) : (
          <div className="success-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {ui.correct}
          </div>
        )}

        <button 
          className="secondary-button" 
          onClick={handleNext}
        >
          {isLastQuestionOverall ? ui.finishCourse : (isLastQuestionOfModule ? ui.nextModule : ui.next)}
        </button>
      </footer>
    </div>
  );
}

function Profile({ username, language, setLanguage, ui, onBack, onLogout }: { 
  username: string, 
  language: LanguageCode,
  setLanguage: (lang: LanguageCode) => void,
  ui: Record<string, string>, 
  onBack: () => void, 
  onLogout: () => void 
}) {
  const [dummyDeleteMsg, setDummyDeleteMsg] = useState(false);
  const [dummyPasswordMsg, setDummyPasswordMsg] = useState(false);
  const [dummySaveMsg, setDummySaveMsg] = useState(false);

  return (
    <div className="container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
      <header className="profile-header">
        <h1 style={{ fontSize: '24px', margin: 0 }}>{ui.userProfile}</h1>
        <button className="secondary-button" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="hide-on-mobile">{ui.esc}</span>
        </button>
      </header>

      <div className="profile-grid">
        <div className="profile-section">
          <label className="input-label">Language</label>
          <select 
            className="input-field select-field" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>

        <div className="profile-section">
          <label className="input-label">{ui.firstName}</label>
          <input type="text" className="input-field" defaultValue="Guest" />
        </div>
        <div className="profile-section">
          <label className="input-label">{ui.lastName}</label>
          <input type="text" className="input-field" defaultValue="User" />
        </div>
        <div className="profile-section">
          <label className="input-label">{ui.email}</label>
          <input type="email" className="input-field" defaultValue={`${username}@example.com`} />
        </div>
        <div className="profile-section">
          <label className="input-label">{ui.phone}</label>
          <input type="tel" className="input-field" defaultValue="+1 000 000 0000" />
        </div>
        
        <div className="profile-section">
           <button className="primary-button" onClick={() => setDummySaveMsg(true)}>{ui.saveChanges}</button>
           {dummySaveMsg && <p className="dummy-msg">{ui.dummyBtn}</p>}
        </div>
      </div>

      <hr className="divider" />

      <div className="profile-actions">
        <div>
          <button 
            className="secondary-button full-width" 
            onClick={() => setDummyPasswordMsg(true)}
          >
            {ui.changePassword}
          </button>
          {dummyPasswordMsg && <p className="dummy-msg">{ui.dummyBtn}</p>}
        </div>

        <div>
          <button 
            className="danger-button full-width" 
            onClick={() => setDummyDeleteMsg(true)}
          >
            {ui.deleteAccount}
          </button>
          {dummyDeleteMsg && <p className="dummy-msg">{ui.dummyBtn}</p>}
        </div>
      </div>

      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <button className="secondary-button" style={{ color: 'var(--text-tertiary)' }} onClick={onLogout}>
          {ui.logout}
        </button>
      </div>
    </div>
  );
}
