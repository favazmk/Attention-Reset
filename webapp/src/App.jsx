import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Landing from './pages/Landing';
import ProfileModal from './components/ProfileModal';
import ConfirmModal from './components/ConfirmModal';
import ErrorBoundary from './components/ErrorBoundary';
import { auth, getDb } from './firebase';
import { authedPost } from './api';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

// Everything past the landing page is code-split: a visitor who never signs up
// should never download the workbook.
const Auth = lazy(() => import('./pages/Auth'));
const Intro = lazy(() => import('./pages/Intro'));
const Day1 = lazy(() => import('./pages/Day1'));
const Day2 = lazy(() => import('./pages/Day2'));
const Day3 = lazy(() => import('./pages/Day3'));
const Day4 = lazy(() => import('./pages/Day4'));
const Day5 = lazy(() => import('./pages/Day5'));
const Day6 = lazy(() => import('./pages/Day6'));
const Day7 = lazy(() => import('./pages/Day7'));
const Completion = lazy(() => import('./pages/Completion'));

const PAGES = ['intro', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'completion'];

// Lets the owner move through the programme without waiting a day per step.
// It only skips the pacing lock — it grants no access on its own.
const OWNER_EMAIL = 'favazmk12@gmail.com';

const CLOUD_SAVE_DELAY_MS = 1200;

function PageFallback() {
  return (
    <div
      style={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted)',
        fontSize: '0.85rem',
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}
    >
      Loading…
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0E0E0B',
        color: '#6B6860',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.85rem',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}
    >
      Loading…
    </div>
  );
}

async function saveUserDoc(uid, patch) {
  try {
    const { db, doc, setDoc } = await getDb();
    await setDoc(doc(db, 'users', uid), patch, { merge: true });
  } catch (error) {
    console.error('Cloud save failed:', error);
  }
}

export default function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [data, setData] = useState({});
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [introError, setIntroError] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState(null);

  // One ticker drives both the countdown copy and the "is it still today?" checks,
  // so nothing has to read the clock during render.
  useEffect(() => {
    const tick = () => {
      const current = Date.now();
      setNow(current);

      const d = new Date(current);
      const tomorrow = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      const diff = tomorrow.getTime() - current;

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setUser(null);
        setData({});
        setCurrentPageIndex(0);
        setIsEnrolled(false);
        setShowLanding(true);
        setShowAuth(false);
        setAuthResolved(true);
        return;
      }

      setShowAuth(false);

      // ── Cloud state ─────────────────────────────────────────────────────────
      let cloudData = {};
      let cloudPage = 0;
      let cloudUpdatedAt = 0;
      // Enrolment is read from Firestore and written only by the server. The
      // browser gets no say in whether it has paid.
      let enrolled = false;

      try {
        const { db, doc, getDoc } = await getDb();
        const snap = await getDoc(doc(db, 'users', authUser.uid));
        if (snap.exists()) {
          const stored = snap.data();
          cloudData = stored.data || {};
          cloudPage = stored.currentPageIndex || 0;
          cloudUpdatedAt = stored.dataUpdatedAt || 0;
          enrolled = stored.isEnrolled === true;
        }
      } catch (error) {
        console.error('Error fetching from Firestore:', error);
      }

      // ── Local state ─────────────────────────────────────────────────────────
      let localData = {};
      try {
        localData = JSON.parse(localStorage.getItem(`ar_data_${authUser.uid}`) || '{}');
      } catch {
        localData = {};
      }
      const localPage = parseInt(localStorage.getItem(`ar_page_${authUser.uid}`) || '0', 10) || 0;
      const localUpdatedAt = Number(localStorage.getItem(`ar_updated_${authUser.uid}`) || 0);

      // Union of both sides so no answer is ever dropped; whichever side was
      // written more recently wins the individual keys they disagree on.
      const localIsNewer = localUpdatedAt > cloudUpdatedAt;
      const finalData = localIsNewer
        ? { ...cloudData, ...localData }
        : { ...localData, ...cloudData };
      const finalPage = Math.max(cloudPage, localPage);

      // Paid but never got access (browser closed mid-checkout)? Recover it.
      if (!enrolled) {
        try {
          const result = await authedPost('/api/check-entitlement');
          enrolled = result.enrolled === true;
        } catch (error) {
          console.error('Entitlement check failed:', error);
        }
      }

      localStorage.setItem(`ar_data_${authUser.uid}`, JSON.stringify(finalData));
      localStorage.setItem(`ar_page_${authUser.uid}`, String(finalPage));

      const mergedIsAhead =
        Object.keys(finalData).length > Object.keys(cloudData).length || finalPage > cloudPage;
      if (mergedIsAhead) {
        const stamp = Date.now();
        localStorage.setItem(`ar_updated_${authUser.uid}`, String(stamp));
        saveUserDoc(authUser.uid, {
          data: finalData,
          currentPageIndex: finalPage,
          dataUpdatedAt: stamp,
        });
      }

      setData(finalData);
      setCurrentPageIndex(finalPage);
      setIsEnrolled(enrolled);
      setShowLanding(!enrolled);
      setUser(authUser);
      setAuthResolved(true);
    });

    return () => unsubscribe();
  }, []);

  // Debounced so a textarea doesn't cost one Firestore write per keystroke.
  useEffect(() => {
    if (!user) return undefined;

    const stamp = Date.now();
    localStorage.setItem(`ar_data_${user.uid}`, JSON.stringify(data));
    localStorage.setItem(`ar_updated_${user.uid}`, String(stamp));

    const timer = setTimeout(() => {
      saveUserDoc(user.uid, { data, dataUpdatedAt: stamp });
    }, CLOUD_SAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [data, user]);

  useEffect(() => {
    if (!user) return undefined;

    let frame = null;
    const handleScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        localStorage.setItem(`ar_scroll_pos_${user.uid}`, String(window.scrollY));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [user]);

  useEffect(() => {
    if (!user || showLanding) return;
    const savedScroll = localStorage.getItem(`ar_scroll_pos_${user.uid}`);
    if (!savedScroll) return;
    const timer = setTimeout(() => window.scrollTo(0, parseInt(savedScroll, 10)), 100);
    return () => clearTimeout(timer);
  }, [showLanding, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`ar_page_${user.uid}`, String(currentPageIndex));
    saveUserDoc(user.uid, { currentPageIndex });
  }, [currentPageIndex, user]);

  const updateData = (key, value) => {
    setData((prev) => {
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
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getCalendarLink = (dayNum) => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(9, 0, 0, 0); // Default to 9 AM

    const start = nextDay.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = new Date(nextDay.getTime() + 30 * 60000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');

    const title = encodeURIComponent(`Day ${dayNum}: Attention Reset`);
    const details = encodeURIComponent(
      'Time for your next step in the Attention Reset. Open the app to continue!'
    );
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  };

  const handleNext = () => {
    if (currentPageIndex === 0 && (!data.intro_commitment || !data.user_name?.trim())) {
      setIntroError(true);
      setTimeout(() => setIntroError(false), 3000);
      return;
    }

    if (currentPageIndex < PAGES.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderPage = () => {
    const pageId = PAGES[currentPageIndex];
    const props = { data, updateData, user };

    switch (pageId) {
      case 'intro':
        return <Intro {...props} introError={introError} />;
      case 'day1':
        return <Day1 {...props} />;
      case 'day2':
        return <Day2 {...props} />;
      case 'day3':
        return <Day3 {...props} />;
      case 'day4':
        return <Day4 {...props} />;
      case 'day5':
        return <Day5 {...props} />;
      case 'day6':
        return <Day6 {...props} />;
      case 'day7':
        return <Day7 {...props} />;
      case 'completion':
        return <Completion {...props} />;
      default:
        return <Intro {...props} />;
    }
  };

  // The server has already recorded the purchase and flipped isEnrolled by the
  // time this runs — there is nothing for the client to write.
  const handlePaymentSuccess = () => {
    setIsEnrolled(true);
    setShowLanding(false);
    window.scrollTo(0, 0);
  };

  const performClearProgress = () => {
    if (!user) return;
    localStorage.removeItem(`ar_data_${user.uid}`);
    localStorage.removeItem(`ar_page_${user.uid}`);
    localStorage.removeItem(`ar_scroll_pos_${user.uid}`);
    localStorage.removeItem(`ar_updated_${user.uid}`);
    setData({});
    setCurrentPageIndex(0);
    window.scrollTo(0, 0);
    setShowProfile(false);
    saveUserDoc(user.uid, { data: {}, currentPageIndex: 0, dataUpdatedAt: Date.now() });
    setShowConfirmModal(false);
  };

  const handleClearProgress = () => {
    setConfirmModalConfig({
      title: 'Reset Workbook',
      message:
        'Are you sure you want to clear all your progress? This will reset you to Day 1 and cannot be undone.',
      onConfirm: performClearProgress,
    });
    setShowConfirmModal(true);
  };

  const handleAuth = async (authType, credentials) => {
    if (authType === 'google') {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
      } catch (error) {
        console.error('Google sign-in error:', error.code);
        throw error;
      }
    } else if (authType === 'signup') {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
        setUser(userCredential.user);
      } catch (error) {
        console.error('Signup error:', error.code);
        if (error.code === 'auth/email-already-in-use') {
          throw new Error('email-in-use');
        }
        throw error;
      }
    } else if (authType === 'signin') {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
        setUser(userCredential.user);
      } catch (error) {
        console.error('Sign in error:', error.code);
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
        ) {
          throw new Error('invalid-credential');
        }
        throw error;
      }
    } else if (authType === 'reset') {
      await sendPasswordResetEmail(auth, credentials.email);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const closeProfile = useCallback(() => setShowProfile(false), []);
  const closeConfirm = useCallback(() => setShowConfirmModal(false), []);

  const profileModal = showProfile && (
    <ProfileModal
      user={user}
      onClose={closeProfile}
      onSignOut={handleSignOut}
      clearProgress={handleClearProgress}
    />
  );

  if (!authResolved) {
    return <FullScreenLoader />;
  }

  if (showAuth) {
    return (
      <>
        <Suspense fallback={<FullScreenLoader />}>
          <Auth
            onAuth={handleAuth}
            allowSignUp
            defaultTab={showAuth === 'signin' ? 'signin' : 'signup'}
            onBack={() => setShowAuth(false)}
          />
        </Suspense>
        <SpeedInsights />
      </>
    );
  }

  if (!user || showLanding) {
    return (
      <>
        <Landing
          isLoggedIn={!!user}
          isEnrolled={isEnrolled}
          onStartReset={(mode) => setShowAuth(mode || 'signup')}
          onPaymentSuccess={handlePaymentSuccess}
          onReturnToCourse={() => setShowLanding(false)}
          onOpenProfile={() => setShowProfile(true)}
        />
        <SpeedInsights />
        {profileModal}
      </>
    );
  }

  const isOwner = user?.email === OWNER_EMAIL;

  return (
    <div className="container">
      <header style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <button
            onClick={() => setShowLanding(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.68rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span style={{ marginTop: '1px' }}>Home</span>
          </button>
          <h1
            style={{
              fontSize: '0.85rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--muted)',
              margin: 0,
            }}
          >
            7-Day Attention Reset
          </h1>
          <button
            onClick={() => setShowProfile(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.68rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </button>
        </div>

        {/* Progress Track */}
        {(() => {
          const DAY_COLORS = [
            'var(--day0)',
            'var(--day1)',
            'var(--day2)',
            'var(--day3)',
            'var(--day4)',
            'var(--day5)',
            'var(--day6)',
            'var(--day7)',
            'var(--day-gen)',
          ];
          const nodes = currentPageIndex === 8 ? 9 : 8; // Show 9 nodes only on completion
          return (
            <div>
              <div
                style={{
                  position: 'relative',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '6px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    right: '12px',
                    height: '2px',
                    backgroundColor: 'var(--border)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    height: '2px',
                    width: `calc(${(currentPageIndex / (nodes - 1)) * 100}% - 24px * ${
                      currentPageIndex / (nodes - 1)
                    })`,
                    background: `linear-gradient(90deg, var(--day0), ${
                      DAY_COLORS[Math.min(currentPageIndex, 7)]
                    })`,
                    boxShadow: `0 0 8px ${DAY_COLORS[Math.min(currentPageIndex, 7)]}`,
                    transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {Array.from({ length: nodes }).map((_, i) => {
                    const done = i <= currentPageIndex;
                    const active = i === currentPageIndex;
                    const color = DAY_COLORS[i] || 'var(--day7)';
                    const prevDayFinished =
                      i === 1 ? data.intro_commitment : i > 1 && data[`day${i - 1}_finished`];
                    const timeLocked =
                      !isOwner &&
                      i > 1 &&
                      prevDayFinished &&
                      isSameDay(data[`day${i - 1}_completedAt`], now);

                    const isUnlocked =
                      i === 0 ||
                      (prevDayFinished && !timeLocked) ||
                      (i === 8 &&
                        data.day7_finished &&
                        (isOwner || !isSameDay(data.day7_completedAt, now)));

                    const label = i === 0 ? 'Intro' : i < 8 ? `D${i}` : 'Beyond';

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (isUnlocked) setCurrentPageIndex(i);
                        }}
                        disabled={!isUnlocked}
                        aria-label={
                          isUnlocked ? `Go to ${label}` : `${label} — locked until tomorrow`
                        }
                        aria-current={active ? 'step' : undefined}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          position: 'relative',
                          cursor: isUnlocked ? 'pointer' : 'default',
                          zIndex: 10,
                          background: 'none',
                          border: 'none',
                          padding: 0,
                        }}
                      >
                        <span
                          style={{
                            width: active ? '14px' : '8px',
                            height: active ? '14px' : '8px',
                            borderRadius: '50%',
                            backgroundColor: done ? color : 'var(--border)',
                            border: active ? `2px solid ${color}` : 'none',
                            boxShadow: done
                              ? i === 8
                                ? `0 0 12px ${color}, 0 0 20px rgba(255,255,255,0.4)`
                                : `0 0 6px ${color}`
                              : 'none',
                            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                            marginBottom: '4px',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '0.5rem',
                            fontWeight: active ? 700 : 400,
                            color: done ? color : 'var(--muted)',
                            position: 'absolute',
                            top: '18px',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            transition: 'color 0.4s',
                          }}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </header>

      <main style={{ minHeight: '60vh' }}>
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>{renderPage()}</Suspense>
        </ErrorBoundary>
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
              gap: '6px',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
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

            const isDayCompleted =
              currentPageIndex === 0 ? true : data[`day${currentPageIndex}_finished`];
            const nextDayTimeLocked =
              !isOwner &&
              !isLast &&
              isDayCompleted &&
              isSameDay(data[`day${currentPageIndex}_completedAt`], now);

            return (
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                {nextDayTimeLocked ? (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <div
                      style={{
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
                        gap: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Next Day Unlocks Tomorrow</span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          opacity: 0.6,
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      >
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
                        gap: '6px',
                      }}
                    >
                      <span>Add Reminder to Calendar</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
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
                      opacity: isLast || !isDayCompleted ? 0 : 1,
                      pointerEvents: isLast || !isDayCompleted ? 'none' : 'auto',
                      backgroundColor: DAY_COLORS[currentPage],
                      transition: 'background-color 0.4s ease, transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <span style={{ marginTop: '1px' }}>{label}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                {currentPageIndex === 0 &&
                  introError &&
                  (!data.intro_commitment || !data.user_name?.trim()) && (
                    <div
                      role="alert"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        marginTop: '12px',
                        color: '#FF3B3B',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        animation: 'fadeIn 0.2s ease-in',
                      }}
                    >
                      {!data.user_name?.trim()
                        ? '* Please save your name above'
                        : '* Please commit to start'}
                    </div>
                  )}
              </div>
            );
          })()}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleClearProgress}
            style={{
              color: 'var(--border)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
          >
            Reset Workbook
          </button>
        </div>
      </footer>
      <SpeedInsights />
      {profileModal}
      {showConfirmModal && confirmModalConfig && (
        <ConfirmModal
          title={confirmModalConfig.title}
          message={confirmModalConfig.message}
          onConfirm={confirmModalConfig.onConfirm}
          onClose={closeConfirm}
          confirmText="Yes, Reset"
        />
      )}
    </div>
  );
}
