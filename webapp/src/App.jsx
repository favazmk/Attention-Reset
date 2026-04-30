import React, { useState, useEffect, useRef } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
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
import ProfileModal from './components/ProfileModal';
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
  const [showAuth, setShowAuth] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [data, setData] = useState({});
  const [user, setUser] = useState(null);
  const [introError, setIntroError] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow - now;
      
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        setShowAuth(false);

        // Load user-specific data
        const savedData = localStorage.getItem(`ar_data_${authUser.uid}`);
        setData(savedData ? JSON.parse(savedData) : {});

        const savedPage = localStorage.getItem(`ar_page_${authUser.uid}`);
        setCurrentPageIndex(savedPage ? parseInt(savedPage, 10) : 0);

        const savedEnrolled = localStorage.getItem(`ar_enrolled_${authUser.uid}`);
        setShowLanding(!savedEnrolled);
      } else {
        // Reset state on sign out
        setData({});
        setCurrentPageIndex(0);
        setShowLanding(true);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`ar_data_${user.uid}`, JSON.stringify(data));
    }
  }, [data, user]);

  useEffect(() => {
    const handleScroll = () => {
      if (user) {
        localStorage.setItem(`ar_scroll_pos_${user.uid}`, window.scrollY.toString());
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  useEffect(() => {
    if (user && !showLanding) {
      const savedScroll = localStorage.getItem(`ar_scroll_pos_${user.uid}`) || localStorage.getItem('ar_scroll_pos');
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        }, 100);
      }
    }
  }, [showLanding, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`ar_page_${user.uid}`, currentPageIndex.toString());
    }
  }, [currentPageIndex, user]);

  const updateData = (key, value) => {
    setData(prev => {
      const newData = { ...prev, [key]: value };
      // If a day is being marked as finished, record the timestamp
      if (key.endsWith('_finished') && value === true) {
        const dayKey = key.split('_')[0]; // e.g., 'day1'
        newData[`${dayKey}_completedAt`] = Date.now();
      }
      return newData;
    });
    if ((key === 'intro_commitment' || key === 'user_name') && value) setIntroError(false);
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const getCalendarLink = (dayNum) => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(9, 0, 0, 0); // Default to 9 AM
    
    const start = nextDay.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(nextDay.getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const title = encodeURIComponent(`Day ${dayNum}: Attention Reset`);
    const details = encodeURIComponent(`Time for your next step in the Attention Reset. Open the app to continue!`);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
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
    if (currentPageIndex === 0 && (!data.intro_commitment || !data.user_name?.trim())) {
      setIntroError(true);
      setTimeout(() => setIntroError(false), 3000);
      return;
    }

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
    const props = { data, updateData, user };
    
    switch (pageId) {
      case 'intro': return <Intro {...props} introError={introError} />;
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

  const handlePaymentSuccess = () => {
    if (user) {
      localStorage.setItem(`ar_enrolled_${user.uid}`, '1');
    }
    setShowLanding(false);
    window.scrollTo(0, 0);
  };

  const handleClearProgress = () => {
    if (window.confirm("Are you sure you want to clear all your progress? This will reset you to Day 1 and cannot be undone.")) {
      localStorage.removeItem(`ar_data_${user.uid}`);
      localStorage.removeItem(`ar_page_${user.uid}`);
      localStorage.removeItem(`ar_scroll_pos_${user.uid}`);
      setData({});
      setCurrentPageIndex(0);
      window.scrollTo(0, 0);
      setShowProfile(false);
    }
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

  if (showAuth) {
    return (
      <>
        <Auth 
          onAuth={handleAuth} 
          allowSignUp={true} 
          defaultTab={showAuth === 'signin' ? 'signin' : 'signup'} 
          onBack={() => setShowAuth(false)} 
        />
        <SpeedInsights />
      </>
    );
  }

  if (!user || showLanding) {
    return (
      <>
        <Landing 
          isLoggedIn={!!user}
          isEnrolled={user && !!localStorage.getItem(`ar_enrolled_${user.uid}`)}
          onStartReset={(mode) => setShowAuth(mode || 'signup')}
          onPaymentSuccess={handlePaymentSuccess} 
          onReturnToCourse={() => setShowLanding(false)}
          onOpenProfile={() => setShowProfile(true)}
        />
        <SpeedInsights />
        {showProfile && (
          <ProfileModal 
            user={user} 
            onClose={() => setShowProfile(false)} 
            onSignOut={handleSignOut}
            clearProgress={handleClearProgress}
          />
        )}
      </>
    );
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setShowLanding(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase',
              color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer',
              padding: 0
            }}
          >
            <svg 
              width="14" height="14" viewBox="0 0 24 24" 
              fill="none" stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span style={{ marginTop: '1px' }}>Home</span>
          </button>
          <h1 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>
            7-Day Attention Reset
          </h1>
          <button 
            onClick={() => setShowProfile(true)} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.68rem', letterSpacing: '1px', textTransform: 'uppercase'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </button>
        </div>

        {/* Progress Track */}
        {(() => {
          const DAY_COLORS = ['var(--day0)','var(--day1)','var(--day2)','var(--day3)','var(--day4)','var(--day5)','var(--day6)','var(--day7)', 'var(--day-gen)'];
          const nodes = currentPageIndex === 8 ? 9 : 8; // Show 9 nodes only on completion
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
                    const prevDayFinished = i === 1 ? data.intro_commitment : (i > 1 && data[`day${i-1}_finished`]);
                    const isAdmin = user?.email === 'favazmk12@gmail.com';
                    const timeLocked = !isAdmin && i > 1 && prevDayFinished && isSameDay(data[`day${i-1}_completedAt`], Date.now());
                    
                    const isUnlocked = i === 0 || (prevDayFinished && !timeLocked) || (i === 8 && data.day7_finished && (isAdmin || !isSameDay(data.day7_completedAt, Date.now())));
                    
                    return (
                      <div 
                        key={i} 
                        onClick={() => { if (isUnlocked) setCurrentPageIndex(i); }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          position: 'relative',
                          cursor: isUnlocked ? 'pointer' : 'default',
                          zIndex: 10
                        }}
                      >
                        <div 
                          style={{
                            width: active ? '14px' : '8px',
                            height: active ? '14px' : '8px',
                            borderRadius: '50%',
                            backgroundColor: done ? color : 'var(--border)',
                            border: active ? `2px solid ${color}` : 'none',
                            boxShadow: done ? (i === 8 ? `0 0 12px ${color}, 0 0 20px rgba(255,255,255,0.4)` : `0 0 6px ${color}`) : 'none',
                            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                            marginBottom: '4px'
                          }} 
                        />
                        <span style={{
                          fontSize: '0.5rem',
                          fontWeight: active ? 700 : 400,
                          color: done ? color : 'var(--muted)',
                          position: 'absolute',
                          top: '18px',
                          whiteSpace: 'nowrap',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          transition: 'color 0.4s'
                        }}>
                          {i === 0 ? 'Intro' : i < 8 ? `D${i}` : 'Beyond'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </header>

      <main style={{ minHeight: '60vh' }}>
        {renderPage()}
      </main>

      <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <div className="footer-btn-container">
          <button
            className="outline-btn"
            onClick={handlePrev}
            style={{ 
              opacity: currentPageIndex === 0 ? 0 : 1, 
              pointerEvents: currentPageIndex === 0 ? 'none' : 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg 
              width="14" height="14" viewBox="0 0 24 24" 
              fill="none" stroke="currentColor" strokeWidth="2.5" 
              strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span style={{ marginTop: '1px' }}>Back</span>
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

            const isDayCompleted = currentPageIndex === 0 ? true : data[`day${currentPageIndex}_finished`];
            const isAdmin = user?.email === 'favazmk12@gmail.com';
            const nextDayTimeLocked = !isAdmin && !isLast && isDayCompleted && isSameDay(data[`day${currentPageIndex}_completedAt`], Date.now());

            return (
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                {nextDayTimeLocked ? (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ 
                      padding: '16px 24px', 
                      borderRadius: '12px', 
                      backgroundColor: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--border)',
                      color: 'var(--muted)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      marginBottom: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Next Day Unlocks Tomorrow</span>
                      </div>
                      <div style={{ 
                        fontSize: '0.7rem', 
                        opacity: 0.6, 
                        letterSpacing: '1px', 
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}>
                        {timeLeft} remaining
                      </div>
                    </div>
                    <a 
                      href={getCalendarLink(currentPageIndex + 1)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: '0.75rem', 
                        color: DAY_COLORS[currentPage], 
                        textDecoration: 'none',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Add Reminder to Calendar</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                ) : (
                  <button
                    className="primary-btn"
                    onClick={handleNext}
                    style={{
                      width: '100%',
                      opacity: (isLast || !isDayCompleted) ? 0 : 1,
                      pointerEvents: (isLast || !isDayCompleted) ? 'none' : 'auto',
                      backgroundColor: DAY_COLORS[currentPage],
                      transition: 'background-color 0.4s ease, transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <span style={{ marginTop: '1px' }}>{label}</span>
                    <svg 
                      width="18" height="18" viewBox="0 0 24 24" 
                      fill="none" stroke="currentColor" strokeWidth="2.2" 
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                )}
                {currentPageIndex === 0 && introError && (!data.intro_commitment || !data.user_name?.trim()) && (
                  <div style={{ position: 'absolute', top: '100%', marginTop: '12px', color: '#FF3B30', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease-in' }}>
                    {!data.user_name?.trim() ? '* Please save your name above' : '* Please commit to start'}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleClearProgress}
            style={{ color: 'var(--border)', fontSize: '0.75rem', textTransform: 'uppercase', transition: 'color 0.2s' }}
          >
            Reset Workbook
          </button>
        </div>
      </footer>
      <SpeedInsights />
      {showProfile && (
        <ProfileModal 
          user={user} 
          onClose={() => setShowProfile(false)} 
          onSignOut={handleSignOut}
          clearProgress={handleClearProgress}
        />
      )}
    </div>
  );
}
