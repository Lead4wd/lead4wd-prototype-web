"use client";

import { useState, useEffect } from "react";
import { MOCK_MODULES, ONBOARDING_QUESTIONS, Module, Question } from "@/data/mock";

type AppState = "ONBOARDING" | "AUTH" | "DASHBOARD" | "QUESTION_PLAYER" | "PROFILE";
type ProgressState = Record<string, "correct" | "wrong">;

export default function Home() {
  const [appState, setAppState] = useState<AppState>("ONBOARDING");
  
  // User State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  // Progress State
  const [completedQuestions, setCompletedQuestions] = useState<ProgressState>({});
  
  // Player State
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Clear session on reload to force logout and redirect to login page
  useEffect(() => {
    sessionStorage.clear();
    setCurrentUser(null);
    setCompletedQuestions({});
    setAppState("AUTH");
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
      setCompletedQuestions(JSON.parse(savedState));
    } else {
      setCompletedQuestions({});
    }
    
    setAppState("DASHBOARD");
  };

  return (
    <main>
      {appState === "ONBOARDING" && (
        <Onboarding onComplete={() => setAppState("AUTH")} />
      )}
      {appState === "AUTH" && (
        <Auth onLogin={handleLogin} />
      )}
      {appState === "DASHBOARD" && currentUser && (
        <Dashboard 
          username={currentUser}
          completedQuestions={completedQuestions}
          onOpenProfile={() => setAppState("PROFILE")}
          onSelectQuestion={(module, idx) => {
            setActiveModule(module);
            setCurrentQuestionIndex(idx);
            setAppState("QUESTION_PLAYER");
          }}
        />
      )}
      {appState === "QUESTION_PLAYER" && activeModule && (
        <QuestionPlayer 
          activeModule={activeModule}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          completedQuestions={completedQuestions}
          setCompletedQuestions={setCompletedQuestions}
          onBack={() => setAppState("DASHBOARD")}
        />
      )}
      {appState === "PROFILE" && currentUser && (
        <Profile 
          username={currentUser} 
          onBack={() => setAppState("DASHBOARD")} 
          onLogout={handleLogout} 
        />
      )}
    </main>
  );
}

// --- Components ---

function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const question = ONBOARDING_QUESTIONS[onboardingIndex];
  
  return (
    <div className="container flex-center" style={{ flex: 1 }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '480px', 
        backgroundColor: 'var(--bg-secondary)', 
        padding: '48px', 
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: 'var(--accent-color)', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Welcome to Lead4wd</p>
          <h1 style={{ fontSize: '28px' }}>{question.text}</h1>
        </div>
        <div>
          {question.options.map((opt, i) => (
            <div 
              key={i} 
              className="option-card"
              onClick={() => {
                if (onboardingIndex < ONBOARDING_QUESTIONS.length - 1) {
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
            Skip
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {ONBOARDING_QUESTIONS.map((_, i) => (
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

function Auth({ onLogin }: { onLogin: (username: string) => void }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [dummyForgotMsg, setDummyForgotMsg] = useState(false);
  const [dummyGoogleMsg, setDummyGoogleMsg] = useState(false);
  const [dummySignUpMsg, setDummySignUpMsg] = useState(false);

  const handleLogin = () => {
    if (!identifier.trim()) {
      setIdentifier("GuestUser");
    }
    // Accept any password and log in
    onLogin(identifier.trim() || "GuestUser");
  };

  return (
    <div className="container flex-center" style={{ flex: 1 }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '480px', 
        backgroundColor: 'var(--bg-secondary)', 
        padding: '48px', 
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Please enter your details</p>
        <h1 style={{ marginBottom: '32px', fontSize: '32px' }}>Welcome back</h1>
        
        <input 
          type="text" 
          placeholder="Email address" 
          className="input-field" 
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          style={{ marginBottom: '16px' }}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          className="input-field" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '16px' }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <input type="checkbox" id="remember" style={{ cursor: 'pointer' }} />
             <label htmlFor="remember" style={{ color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer' }}>Remember for 30 days</label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <button className="secondary-button" style={{ padding: 0 }} onClick={() => setDummyForgotMsg(true)}>
              Forgot password?
            </button>
            {dummyForgotMsg && <span style={{ color: 'var(--error-color)', fontSize: '10px', marginTop: '4px' }}>dummy button</span>}
          </div>
        </div>
        
        <button className="primary-button" onClick={handleLogin} style={{ marginBottom: '16px' }}>
          Login
        </button>
        
        <button 
          className="secondary-button" 
          onClick={() => setDummyGoogleMsg(true)}
          style={{ 
            width: '100%', 
            padding: '16px', 
            border: '1px solid var(--border-color)', 
            borderRadius: '8px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px',
            color: 'var(--text-primary)',
            marginBottom: '4px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
            <path d="M12 16v-8"></path>
            <path d="M8 12h8"></path>
          </svg>
          Sign in with Google
        </button>
        {dummyGoogleMsg && <p style={{ color: 'var(--error-color)', fontSize: '12px', textAlign: 'center', marginBottom: '8px' }}>dummy button</p>}
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Don't have an account? <button className="secondary-button" style={{ padding: 0, fontSize: '14px' }} onClick={() => setDummySignUpMsg(true)}>Sign up</button>
          {dummySignUpMsg && <p style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>dummy button</p>}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ username, completedQuestions, onOpenProfile, onSelectQuestion }: { 
  username: string,
  completedQuestions: ProgressState, 
  onOpenProfile: () => void, 
  onSelectQuestion: (module: Module, idx: number) => void 
}) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "m1": true // Expand first module by default
  });

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalQuestions = MOCK_MODULES.reduce((acc, mod) => acc + mod.questions.length, 0);
  const correctCount = Object.values(completedQuestions).filter(status => status === "correct").length;
  const percentage = Math.round((correctCount / totalQuestions) * 100) || 0;

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Welcome {username}</h1>
        <div 
          onClick={onOpenProfile}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}
        >
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Profile</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </header>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent-color)" strokeWidth="8" 
                strokeDasharray={`${251.2 * (percentage / 100)} 251.2`}
              />
            </svg>
            <div style={{ position: 'absolute', fontWeight: 'bold' }}>{percentage}%</div>
        </div>
        <div>
          <h2 style={{ fontSize: '20px' }}>Your Progress</h2>
          <p style={{ fontSize: '14px' }}>You have completed {correctCount} out of {totalQuestions} questions.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {MOCK_MODULES.map((module) => {
          const isExpanded = expandedModules[module.id];
          return (
            <div key={module.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <div 
                onClick={() => toggleModule(module.id)}
                style={{ 
                  padding: '16px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
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
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'var(--bg-primary)' }}>
                  {module.questions.map((q, idx) => {
                    const status = completedQuestions[q.id];
                    return (
                      <div 
                        key={q.id}
                        className={`list-item`}
                        onClick={() => onSelectQuestion(module, idx)}
                        style={{ margin: 0, borderColor: status === "correct" ? "var(--success-color)" : status === "wrong" ? "var(--error-color)" : "var(--border-color)" }}
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
                              Question {q.number} {status === "wrong" && "- Needs Review"}
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

function QuestionPlayer({ activeModule, currentQuestionIndex, setCurrentQuestionIndex, completedQuestions, setCompletedQuestions, onBack }: {
  activeModule: Module,
  currentQuestionIndex: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  completedQuestions: ProgressState,
  setCompletedQuestions: React.Dispatch<React.SetStateAction<ProgressState>>,
  onBack: () => void
}) {
  const q = activeModule.questions[currentQuestionIndex];
  const status = completedQuestions[q.id];
  const isCorrect = status === "correct";
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [currentQuestionIndex, activeModule]);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      if (selectedOption === q.correctOptionIndex) {
        setCompletedQuestions(prev => ({ ...prev, [q.id]: "correct" }));
      } else {
        setCompletedQuestions(prev => ({ ...prev, [q.id]: "wrong" }));
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
        <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }} onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
          {activeModule.title} - Q{q.number}
        </div>
        <div style={{ width: '80px' }}></div>
      </header>

      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '32px', lineHeight: 1.4 }}>{q.text}</h1>
          
          <div>
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
             <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error-color)', borderRadius: '8px', color: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Incorrect answer. Try again!</span>
             </div>
          )}
        </div>
      </div>

      <footer style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="secondary-button" 
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
        >
          Previous
        </button>
        
        {!isCorrect ? (
          <button 
            className="primary-button" 
            style={{ width: 'auto', padding: '12px 32px' }}
            disabled={selectedOption === null}
            onClick={handleSubmit}
          >
            Submit Answer
          </button>
        ) : (
          <div style={{ color: 'var(--success-color)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Correct!
          </div>
        )}

        <button 
          className="secondary-button" 
          disabled={currentQuestionIndex === activeModule.questions.length - 1}
          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
          style={{ opacity: currentQuestionIndex === activeModule.questions.length - 1 ? 0.5 : 1 }}
        >
          Next
        </button>
      </footer>
    </div>
  );
}

function Profile({ username, onBack, onLogout }: { username: string, onBack: () => void, onLogout: () => void }) {
  const [dummyDeleteMsg, setDummyDeleteMsg] = useState(false);
  const [dummyPasswordMsg, setDummyPasswordMsg] = useState(false);
  const [dummySaveMsg, setDummySaveMsg] = useState(false);

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>User Profile</h1>
        <button className="secondary-button" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Esc
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>First Name</label>
          <input type="text" className="input-field" defaultValue="Guest" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Last Name</label>
          <input type="text" className="input-field" defaultValue="User" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email</label>
          <input type="email" className="input-field" defaultValue={`${username}@example.com`} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Phone Number</label>
          <input type="tel" className="input-field" defaultValue="+1 000 000 0000" />
        </div>
        
        <div>
           <button className="primary-button" onClick={() => setDummySaveMsg(true)}>Save Changes</button>
           {dummySaveMsg && <p style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>this is a dummy button</p>}
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', margin: '32px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <button 
            className="secondary-button" 
            style={{ width: '100%', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            onClick={() => setDummyPasswordMsg(true)}
          >
            Change Password
          </button>
          {dummyPasswordMsg && <p style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>this is a dummy button</p>}
        </div>

        <div>
          <button 
            className="secondary-button" 
            style={{ width: '100%', padding: '16px', border: '1px solid var(--error-color)', color: 'var(--error-color)', borderRadius: '8px' }}
            onClick={() => setDummyDeleteMsg(true)}
          >
            Delete Account
          </button>
          {dummyDeleteMsg && <p style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>this is a dummy button</p>}
        </div>
      </div>

      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <button className="secondary-button" style={{ color: 'var(--text-tertiary)' }} onClick={onLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}
