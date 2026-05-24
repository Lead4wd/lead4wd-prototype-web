"use client";

import { useState, useEffect } from "react";
import { MOCK_QUESTIONS, ONBOARDING_QUESTIONS } from "@/data/mock";

type AppState = "ONBOARDING" | "AUTH" | "DASHBOARD" | "QUESTION_PLAYER";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("ONBOARDING");
  
  // Progress State
  const [completedQuestions, setCompletedQuestions] = useState<Record<string, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Initialization (check localStorage)
  useEffect(() => {
    const savedState = localStorage.getItem("lead4wd_progress");
    const isLoggedIn = localStorage.getItem("lead4wd_logged_in");
    
    if (savedState) {
      setCompletedQuestions(JSON.parse(savedState));
    }
    
    if (isLoggedIn === "true") {
      setAppState("DASHBOARD");
    }
  }, []);

  // Sync progress to localStorage
  useEffect(() => {
    if (Object.keys(completedQuestions).length > 0) {
      localStorage.setItem("lead4wd_progress", JSON.stringify(completedQuestions));
    }
  }, [completedQuestions]);

  const handleLogout = () => {
    localStorage.removeItem("lead4wd_logged_in");
    setAppState("AUTH");
  };

  return (
    <main>
      {appState === "ONBOARDING" && (
        <Onboarding onComplete={() => setAppState("AUTH")} />
      )}
      {appState === "AUTH" && (
        <Auth onLogin={() => setAppState("DASHBOARD")} />
      )}
      {appState === "DASHBOARD" && (
        <Dashboard 
          completedQuestions={completedQuestions}
          onLogout={handleLogout}
          onSelectQuestion={(idx) => {
            setCurrentQuestionIndex(idx);
            setAppState("QUESTION_PLAYER");
          }}
        />
      )}
      {appState === "QUESTION_PLAYER" && (
        <QuestionPlayer 
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          completedQuestions={completedQuestions}
          setCompletedQuestions={setCompletedQuestions}
          onBack={() => setAppState("DASHBOARD")}
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
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: 'var(--accent-color)', fontWeight: 600, marginBottom: '8px' }}>Welcome to Lead4wd</p>
          <h1>{question.text}</h1>
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
            >
              <div className="option-indicator"></div>
              <span style={{ fontWeight: 500 }}>{opt}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
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
  );
}

function Auth({ onLogin }: { onLogin: () => void }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    setAuthError("");
    if (!identifier.trim() || !password) {
      setAuthError("Please enter email/phone and password");
      return;
    }
    
    if (identifier === "admin" && password === "password") {
      localStorage.setItem("lead4wd_logged_in", "true");
      onLogin();
    } else {
      setAuthError("Username or password is incorrect");
    }
  };

  return (
    <div className="container flex-center" style={{ flex: 1 }}>
      <div style={{ width: '100%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', marginBottom: '32px' }}>Login with Email or Phone</p>
        
        <input 
          type="text" 
          placeholder="Email or Phone Number" 
          className="input-field" 
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        
        <div style={{ position: 'relative' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer'
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        
        {authError && (
          <p style={{ color: 'var(--error-color)', fontSize: '14px', fontWeight: 500, marginBottom: '16px' }}>
            {authError}
          </p>
        )}
        
        <button className="primary-button" onClick={handleLogin}>
          Login
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button className="secondary-button">Forgot Password?</button>
          <button className="secondary-button">Create Account</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ completedQuestions, onLogout, onSelectQuestion }: { 
  completedQuestions: Record<string, boolean>, 
  onLogout: () => void, 
  onSelectQuestion: (idx: number) => void 
}) {
  const total = MOCK_QUESTIONS.length;
  const completed = Object.values(completedQuestions).filter(Boolean).length;
  const percentage = Math.round((completed / total) * 100) || 0;

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Lead4wd</h1>
        <button className="secondary-button" onClick={onLogout}>Log Out</button>
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
          <p style={{ fontSize: '14px' }}>You have completed {completed} out of {total} core questions.</p>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Module 1: The First 90 Days</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {MOCK_QUESTIONS.map((q, idx) => {
          const isCompleted = completedQuestions[q.id];
          return (
            <div 
              key={q.id}
              className={`list-item ${isCompleted ? 'completed' : ''}`}
              onClick={() => onSelectQuestion(idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: '16px' }}>
                  <span style={{ 
                    color: isCompleted ? 'var(--success-color)' : 'var(--text-tertiary)',
                    fontSize: '12px', 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Question {q.number}
                  </span>
                  <p style={{ color: 'var(--text-primary)', marginTop: '8px', fontWeight: 500 }}>
                    {q.text}
                  </p>
                </div>
                {isCompleted && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionPlayer({ currentQuestionIndex, setCurrentQuestionIndex, completedQuestions, setCompletedQuestions, onBack }: {
  currentQuestionIndex: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  completedQuestions: Record<string, boolean>,
  setCompletedQuestions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  onBack: () => void
}) {
  const q = MOCK_QUESTIONS[currentQuestionIndex];
  const isCompleted = completedQuestions[q.id];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setCompletedQuestions(prev => ({ ...prev, [q.id]: true }));
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
          Question {q.number} of {MOCK_QUESTIONS.length}
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
                onClick={() => !isCompleted && setSelectedOption(idx)}
                style={{ opacity: isCompleted && selectedOption !== idx ? 0.5 : 1 }}
              >
                <div className="option-indicator">
                  {selectedOption === idx && <div style={{ width: '12px', height: '12px', backgroundColor: 'white', borderRadius: '50%' }} />}
                </div>
                <span style={{ fontSize: '16px' }}>{opt}</span>
              </div>
            ))}
          </div>
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
        
        {!isCompleted ? (
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
          disabled={currentQuestionIndex === MOCK_QUESTIONS.length - 1}
          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
          style={{ opacity: currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? 0.5 : 1 }}
        >
          Next
        </button>
      </footer>
    </div>
  );
}
