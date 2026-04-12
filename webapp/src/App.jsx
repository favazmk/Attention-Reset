import React, { useState, useEffect, useRef } from 'react';
import Landing from './pages/Landing';
import Intro from './pages/Intro';
import Day1 from './pages/Day1';
import Day2 from './pages/Day2';
import Day3 from './pages/Day3';
import Day4 from './pages/Day4';
import Day5 from './pages/Day5';
import Day6 from './pages/Day6';
import Day7 from './pages/Day7';
import Completion from './pages/Completion';
import Auth from './pages/Auth';
import { auth } from './firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

const PAGES = [
  'intro', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'completion'
];

export default function App() {
  const [showLanding, setShowLanding] = useState(
    () => !localStorage.getItem('ar_enrolled')
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('attention_workbook_data');
    if (saved) return JSON.parse(saved);
    return {};
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('attention_workbook_data', JSON.stringify(data));
  }, [data]);

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const resetData = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      setData({});
      setCurrentPageIndex(0);
      setShowLanding(true);
      localStorage.removeItem('attention_workbook_data');
      localStorage.removeItem('ar_enrolled');
    }
  };

  const handleNext = () => {
    if (currentPageIndex < PAGES.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderPage = () => {
    const pageId = PAGES[currentPageIndex];
    const props = { data, updateData };
    
    switch (pageId) {
      case 'intro': return <Intro {...props} />;
      case 'day1': return <Day1 {...props} />;
      case 'day2': return <Day2 {...props} />;
      case 'day3': return <Day3 {...props} />;
      case 'day4': return <Day4 {...props} />;
      case 'day5': return <Day5 {...props} />;
      case 'day6': return <Day6 {...props} />;
      case 'day7': return <Day7 {...props} />;
      case 'completion': return <Completion {...props} />;
      default: return <Intro {...props} />;
    }
  };

  const handleEnroll = () => {
    localStorage.setItem('ar_enrolled', '1');
    setShowLanding(false);
    window.scrollTo(0, 0);
  };
  
  const handleAuth = async (authType, credentials) => {
    if (authType === 'google') {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
      } catch (error) {
        console.error("Google sign-in error:", error);
        alert(`Google sign-in failed: ${error.message}`);
      }
    } else if (authType === 'signup') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        setUser(userCredential.user);
      } catch (error) {
        console.error("Signup error:", error.code);
        if (error.code === 'auth/email-already-in-use') {
          alert('An account already exists with this email address. Please sign in.');
        } else {
          alert(`Sign up failed: ${error.message}`);
        }
      }
    } else if (authType === 'signin') {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        setUser(userCredential.user);
      } catch (error) {
        console.error("Sign in error:", error.code);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          alert('Invalid email or password.');
        } else {
          alert(`Sign in failed: ${error.message}`);
        }
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  if (showLanding) {
    return <Landing onEnroll={handleEnroll} />;
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setShowLanding(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase',
              color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer'
            }}
          >
            ← Overview
          </button>
          <h1 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>
            7-Day Attention Reset
          </h1>
          <button onClick={handleSignOut} style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
        </div>

        {/* Progress Track */}
        {(() => {
          const DAY_COLORS = ['var(--day0)','var(--day1)','var(--day2)','var(--day3)','var(--day4)','var(--day5)','var(--day6)','var(--day7)'];
          const nodes = 8; // intro + 7 days
          return (
            <div>
              <div style={{ position: 'relative', height: '32px', display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ position: 'absolute', left: '12px', right: '12px', height: '2px', backgroundColor: 'var(--border)' }} />
                <div style={{
                  position: 'absolute', left: '12px', height: '2px',
                  width: `calc(${(currentPageIndex / (nodes - 1)) * 100}% - 24px * ${currentPageIndex / (nodes - 1)})`,
                  background: `linear-gradient(90deg, var(--day0), ${DAY_COLORS[Math.min(currentPageIndex, 7)]})`,
                  boxShadow: `0 0 8px ${DAY_COLORS[Math.min(currentPageIndex, 7)]}`,
                  transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {Array.from({ length: nodes }).map((_, i) => {
                    const done = i <= currentPageIndex;
                    const active = i === currentPageIndex;
                    const color = DAY_COLORS[i] || 'var(--day7)';
                    return (
                      <div key={i} style={{
                        width: active ? '14px' : '8px',
                        height: active ? '14px' : '8px',
                        borderRadius: '50%',
                        backgroundColor: done ? color : 'var(--border)',
                        border: active ? `2px solid ${color}` : 'none',
                        boxShadow: done ? `0 0 6px ${color}` : 'none',
                        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                      }} />
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>Scattered</span>
                <span style={{ fontSize: '0.6rem', color: currentPageIndex === 8 ? 'var(--day7)' : 'var(--muted)', transition: 'color 0.4s' }}>
                  Locked In
                </span>
              </div>
            </div>
          );
        })()}
      </header>

      <main style={{ minHeight: '60vh' }}>
        {renderPage()}
      </main>

      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <button
            className="outline-btn"
            onClick={handlePrev}
            style={{ opacity: currentPageIndex === 0 ? 0 : 1, pointerEvents: currentPageIndex === 0 ? 'none' : 'auto' }}
          >
            ← Back
          </button>

          {(() => {
            const DAY_COLORS = {
              intro: 'var(--day0)',
              day1: 'var(--day1)',
              day2: 'var(--day2)',
              day3: 'var(--day3)',
              day4: 'var(--day4)',
              day5: 'var(--day5)',
              day6: 'var(--day6)',
              day7: 'var(--day7)',
              completion: 'var(--day7)',
            };
            const currentPage = PAGES[currentPageIndex];
            const isLast = currentPageIndex === PAGES.length - 1;
            const label = currentPageIndex < 7 ? `Start Day ${currentPageIndex + 1}` : 'Finish Reset';

            return (
              <button
                className="primary-btn"
                onClick={handleNext}
                style={{
                  opacity: isLast ? 0 : 1,
                  pointerEvents: isLast ? 'none' : 'auto',
                  backgroundColor: DAY_COLORS[currentPage],
                  transition: 'background-color 0.4s ease, transform 0.2s, box-shadow 0.2s',
                }}
              >
                {label} →
              </button>
            );
          })()}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={resetData}
            style={{ color: 'var(--border)', fontSize: '0.75rem', textTransform: 'uppercase', transition: 'color 0.2s' }}
          >
            Reset Workbook
          </button>
        </div>
      </footer>
    </div>
  );
}
