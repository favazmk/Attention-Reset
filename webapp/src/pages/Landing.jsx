import React, { useEffect, useLayoutEffect, useRef } from 'react';
import PrivacyPolicy from '../components/PrivacyPolicy';
import TermsAndConditions from '../components/TermsAndConditions';
import CheckoutModal from '../components/CheckoutModal';
import Toast from '../components/Toast';
import { authedPost } from '../api';
import '../styles/landing.css';

const PRICE = 99;
const PREVIOUS_PRICE = 399;
const BUNDLE_VALUE = 2094;

// `rgb` mirrors `color` as a triplet so the carousel can tint its active-card
// glow through rgba(var(--day-rgb), a) without a runtime colour conversion.
const DAYS = [
  { n: '01', color: '#00E87A', rgb: '0,232,122', title: 'The Digital Kill-Switch', action: 'Stop the pings. Start the progress.', feel: 'Lighter. Less reactive.' },
  { n: '02', color: '#B060FF', rgb: '176,96,255', title: 'The Snap Audit', action: 'Find your attention leaks in 5 minutes.', feel: 'Aware. In control of what you\'re fighting.' },
  { n: '03', color: '#3BB8E8', rgb: '59,184,232', title: 'The Monk Sprint', action: 'One task. Zero noise. 100% impact.', feel: 'Surprised by what you finished.' },
  { n: '04', color: '#F5C842', rgb: '245,200,66', title: 'The Focus Sprints', action: 'Level up your mental endurance.', feel: 'Your brain starts to feel like yours again.' },
  { n: '05', color: '#00E5C0', rgb: '0,229,192', title: 'The Fortress', action: 'Design a space where focus is the only option.', feel: 'Work feels 10× less exhausting.' },
  { n: '06', color: '#FF3B3B', rgb: '255,59,59', title: 'The Dopamine Reset', action: 'Recover your edge through strategic boredom.', feel: 'Calm you haven\'t felt in months.' },
  { n: '07', color: '#FF8C00', rgb: '255,140,0', title: 'The Attention OS', action: 'Build a system that works so you don\'t have to.', feel: 'You have a system. Not just intentions.' },
];

const FEATURES = [
  {
    title: "7-Day Protocols",
    value: "₹599 value",
    desc: "Science-backed daily missions designed to rebuild your focus step by step."
  },
  {
    title: "27 Clickable Checklists",
    value: "₹499 value",
    desc: "Action-based tasks you complete in real time — not just read."
  },
  {
    title: "1 Attention OS Builder",
    value: "₹99 value",
    desc: "Your permanent post-reset system to protect your focus long-term."
  },
  {
    title: "1 Before vs. After Score",
    value: "₹199 value",
    desc: "See exactly how far you've come — in numbers."
  },
  {
    title: "3-Step Focus Ritual Builder",
    value: "₹299 value",
    desc: "A repeatable ritual that trains your brain to enter deep work on command."
  },
  {
    title: "11 Focus Blueprint & Audit insights",
    value: "₹399 value",
    desc: "A clear breakdown of your distractions, patterns, and reclaimed time."
  }
];

const FAQS = [
  ['Do I need to download anything?', 'No. It\'s a web app — open it in any browser on your phone, tablet, or laptop. Nothing to install. Your progress is auto-saved.'],
  ['What if I have ADHD or can\'t focus at all?', 'That\'s exactly who this was built for. Each day starts with a 5-minute win. You don\'t need to be focused to start — just open it.'],
  ['What if I\'ve tried this kind of thing before and quit?', 'Day 1 takes 10 minutes. The programme is designed for low-friction completion. You don\'t need motivation — you need a low starting point to begin.'],
  ['Will this work if I\'m on screens all day for work?', 'Yes. Day 5 (The Fortress) specifically addresses environment design for people who can\'t avoid screens.'],
  ['Is this a video course?', 'No. It\'s a focused, interactive web programme — designed for people with fractured attention who don\'t need another video queue to feel guilty about.'],
  ['Why will this work when other things didn’t?', 'Because this isn’t information. It’s structured action.'],
];

export default function Landing({ onPaymentSuccess, onStartReset, isLoggedIn, isEnrolled, onReturnToCourse, onOpenProfile }) {
  const [openFaq, setOpenFaq] = React.useState(null);
  const [checkedSymptoms, setCheckedSymptoms] = React.useState({});
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const [showSticky, setShowSticky] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const [checkoutBusy, setCheckoutBusy] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const dismissToast = React.useCallback(() => setToast(null), []);

  const [touchStart, setTouchStart] = React.useState(null);
  const [touchOffset, setTouchOffset] = React.useState(0);

  const rootRef = useRef(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    setTouchOffset(diff);
  };

  const handleTouchEnd = () => {
    if (touchOffset > 50 && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    } else if (touchOffset < -50 && activeIndex < DAYS.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
    setTouchStart(null);
    setTouchOffset(0);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after hero section (roughly 600px)
      setShowSticky(window.scrollY > 700);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Meta needs mid-funnel signal to optimise against — a ₹99 product will never
  // hit the purchase volume that Purchase-only optimisation requires.
  useEffect(() => {
    if (window.fbq) window.fbq('track', 'ViewContent', { content_name: '7-Day Attention Reset', value: PRICE, currency: 'INR' });
  }, []);

  // Someone who clicked "buy" before signing up gets dropped straight back into
  // checkout once their account exists.
  useEffect(() => {
    if (isLoggedIn && !isEnrolled && sessionStorage.getItem('auto_open_checkout') === 'true') {
      sessionStorage.removeItem('auto_open_checkout');
      const timer = setTimeout(() => handlePayment(), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isEnrolled]);

  const handleStartCheckout = () => {
    if (isEnrolled) return;
    if (window.fbq) window.fbq('track', 'InitiateCheckout', { value: PRICE, currency: 'INR' });
    setShowCheckoutModal(true);
  };

  const handlePayment = async () => {
    if (checkoutBusy) return;

    if (!isLoggedIn) {
      setShowCheckoutModal(false);
      sessionStorage.setItem('auto_open_checkout', 'true');
      onStartReset('signup');
      return;
    }

    setCheckoutBusy(true);

    try {
      // The server decides the amount. Nothing about the price travels from here.
      const order = await authedPost('/api/create-order');

      // Close our modal before Razorpay's opens, so cancelling doesn't leave the
      // user staring at a stale order summary.
      setShowCheckoutModal(false);

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: '7-Day Attention Reset',
        description: 'Reclaim your focus in one week',
        order_id: order.id,
        handler: async function (response) {
          try {
            await authedPost('/api/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (window.fbq) {
              window.fbq(
                'track',
                'Purchase',
                { value: PRICE, currency: 'INR' },
                { eventID: response.razorpay_order_id }
              );
            }
            onPaymentSuccess();
          } catch (error) {
            console.error('Verification error:', error);
            setToast({
              tone: 'error',
              message:
                'Your payment went through but we could not unlock the course automatically. Refresh the page — if it is still locked, message us on WhatsApp and we will fix it right away.',
            });
          } finally {
            setCheckoutBusy(false);
          }
        },
        modal: {
          ondismiss: () => setCheckoutBusy(false),
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#F5C842' },
      });

      rzp.on('payment.failed', function (response) {
        setCheckoutBusy(false);
        setToast({
          tone: 'error',
          message: `Payment failed: ${response.error?.description || 'please try again.'}`,
        });
      });

      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutBusy(false);

      if (error.data?.error === 'already_enrolled') {
        setShowCheckoutModal(false);
        onPaymentSuccess();
        return;
      }

      setToast({
        tone: 'error',
        message: error.message || 'Could not start checkout. Please try again.',
      });
    }
  };

  const toggleSymptom = (i) => {
    setCheckedSymptoms(prev => ({ ...prev, [i]: !prev[i] }));
  };

  // Reveal-on-scroll. Sections marked `.l-reveal` settle into place as they
  // enter the viewport, so the page arrives in layers instead of all at once.
  //
  // The hidden start state lives behind [data-reveal="on"], set here rather
  // than in the markup: every section is a reveal target, so if this effect
  // never ran the page would render blank. Opting in from JS makes "visible"
  // the failure mode. useLayoutEffect (not useEffect) applies it before the
  // first paint, so nothing flashes in and back out.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const targets = root.querySelectorAll('.l-reveal');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!targets.length || reduced || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    root.dataset.reveal = 'on';

    let delivered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        delivered = true;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    targets.forEach((el) => observer.observe(el));

    // Backstop for contexts that create an observer but never deliver to it —
    // a page not compositing frames skips the rendering-lifecycle step that
    // both dispatches these callbacks and advances CSS transitions. Marking the
    // targets `is-in` would not help there (the fade would never run), so the
    // recovery is to switch the whole reveal system off and let the content
    // paint at its natural state. A working observer delivers its first batch
    // almost immediately, so this only ever fires when nothing arrived at all.
    const failsafe = setTimeout(() => {
      if (delivered) return;
      observer.disconnect();
      delete root.dataset.reveal;
    }, 2000);

    return () => {
      clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);


  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => { setShowPrivacy(false); window.scrollTo(0, 0); }} />;
  }

  if (showTerms) {
    return <TermsAndConditions onBack={() => { setShowTerms(false); window.scrollTo(0, 0); }} />;
  }

  return (
    <div className="landing" ref={rootRef}>

      {/* Ambient background field. Fixed behind everything so scrolling content
          crosses lit and unlit regions instead of one uniform black slab. */}
      <div className="l-atmosphere" aria-hidden="true">
        <div className="l-atm-grid" />
        <div className="l-atm-glow l-atm-glow--key" />
        <div className="l-atm-glow l-atm-glow--fill" />
        <div className="l-atm-glow l-atm-glow--bloom" />
        <div className="l-atm-vignette" />
      </div>

      <div className="l-content">

      {/* HEADER */}
      <header className="l-header">
        <div className="l-wrap l-header-inner">
          <div className="l-brand">
            <span className="l-brand-mark" aria-hidden="true" />
            <span>Deeper Fix</span>
          </div>
          <nav className="l-header-nav">
            <a href="#symptoms" className="l-header-link">Symptoms</a>
            <a href="#programme" className="l-header-link">The Programme</a>
            <a href="#inside" className="l-header-link">What's Inside</a>
            <a href="#pricing" className="l-header-link">Pricing</a>
            <a href="#faq" className="l-header-link">FAQ</a>
          </nav>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="l-btn-nav"
              onClick={isEnrolled ? onReturnToCourse : handleStartCheckout}
              style={{
                opacity: showSticky ? 1 : 0,
                pointerEvents: showSticky ? 'auto' : 'none',
                transform: `translateX(${showSticky ? '0' : '10px'})`,
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {isEnrolled ? 'Return to Course' : 'Start My Reset'}
            </button>

            <button 
              className="l-mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ background: 'none', border: 'none', color: '#EDE8DC', cursor: 'pointer', padding: '4px', display: 'none', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>

            <div className="l-desktop-auth">
              {!isLoggedIn ? (
                <button className="l-btn-ghost" onClick={() => onStartReset('signin')}>
                  Course Login
                </button>
              ) : (
                <button className="l-btn-quiet" onClick={onOpenProfile}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="l-mobile-nav">
            <a href="#symptoms" onClick={() => setIsMenuOpen(false)}>Symptoms</a>
            <a href="#programme" onClick={() => setIsMenuOpen(false)}>The Programme</a>
            <a href="#inside" onClick={() => setIsMenuOpen(false)}>What's Inside</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            <div style={{ margin: '16px 0', height: '1px', background: '#2C2C26' }} />
            {!isLoggedIn ? (
              <button 
                onClick={() => { setIsMenuOpen(false); onStartReset('signin'); }}
                style={{
                  background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.3)', color: '#F5C842',
                  padding: '12px 16px', borderRadius: '4px', fontSize: '0.9rem', letterSpacing: '1px',
                  textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", width: '100%'
                }}
              >
                Course Login
              </button>
            ) : (
              <button 
                onClick={() => { setIsMenuOpen(false); onOpenProfile(); }} 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  color: 'rgba(237,232,220,0.8)', background: 'rgba(28,28,24,0.6)', border: '1px solid rgba(237,232,220,0.1)', cursor: 'pointer',
                  fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', padding: '12px 16px', borderRadius: '4px', width: '100%'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                My Profile
              </button>
            )}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="l-hero-container">
        <video
          className="l-video-bg"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          style={{ pointerEvents: 'none' }}
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
        </video>
        <div className="l-hero-scrim" />
        <div className="l-hero-fade" />
        <div className="l-wrap l-hero-content" style={{ padding: '8rem 1.25rem 6rem' }}>
          <p className="l-label">7-Day Interactive Programme</p>
          <h1 className="l-h1">Stop Blaming Yourself.<br />Your Attention Was Stolen.<br /><em>Let’s Take It Back.</em></h1>
          <div className="l-rule" />
          <p className="l-p" style={{ fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '520px' }}>
            The reset your brain has been waiting for—<br />
            7 days to a mind that finally finishes what it starts.
          </p>
          <button className="l-cta" onClick={isEnrolled ? onReturnToCourse : handleStartCheckout}>
            {isEnrolled ? 'Return to Course' : 'Start the Reset'}
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <div className="l-trust">
            <span><span className="l-dot" />interactive daily exercises</span>
            <span><span className="l-dot" />10-20 min/Day</span>
            <span><span className="l-dot" />Works on any device</span>
          </div>

        </div>
      </section>

      {/* SYMPTOM MIRROR */}
      <section id="symptoms" className="l-section l-section--alarm l-section--flush">
        <div className="l-wrap l-reveal">
          <p className="l-label">Does this sound familiar?</p>
          <h2 className="l-h2">Signs your attention<br /><em>is being hijacked</em></h2>
          <p className="l-p">Check what sounds familiar:</p>
          <ul className="l-checklist">
            {['You open your phone to do one thing and lose 30 minutes', 'You can\'t read 3 paragraphs without reaching for your phone', 'You start tasks but finish almost none of them', 'Your best ideas stay in your head because focus never arrives', 'You feel guilty scrolling but can\'t seem to stop', 'Deep work used to feel easy. Now it feels impossible.', 'Can\'t watch a 10 minute video without skipping.'].map((t, i) => (
              <li key={i} data-on={!!checkedSymptoms[i]} onClick={() => toggleSymptom(i)}>
                <div className="l-cb" />
                <span className="l-cb-text">{t}</span>
              </li>
            ))}
          </ul>
          <div className="l-card">
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#EDE8DC' }}>
              If you checked 3 or more — your attention hasn't broken. It's been <strong>trained this way.</strong><br /><br />
              And it can be retrained in 7 days.
            </p>
          </div>
        </div>
      </section>

      {/* MECHANISM */}
      <section className="l-section l-section--warm">
        <div className="l-wrap l-reveal">
          <p className="l-label">The real problem</p>
          <h2 className="l-h2">The problem isn't you.<br /><em>It's the system.</em></h2>
          <div className="l-rule" />
          <p className="l-p" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            Algorithms are engineered to hijack your dopamine. Every notification triggers a cortisol spike. You interrupt yourself every 3 minutes—and need 23 minutes to refocus.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="l-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontSize: '1.1rem', color: '#EDE8DC', lineHeight: 1.6, margin: 0 }}>
                This isn't another video course or PDF you forget.
              </p>
            </div>

            <p className="l-p" style={{ fontSize: '1.1rem', fontWeight: 400 }}>
              It's a <strong>7-day interactive reset</strong> — designed using proven science and psychology to change the system around you.
            </p>

            <div style={{ padding: '1rem 0', borderLeft: '3px solid #F5C842', paddingLeft: '1.5rem' }}>
              <p style={{ fontSize: '1.4rem', fontFamily: "'DM Serif Display', serif", color: '#F5C842', margin: 0, letterSpacing: '0.5px' }}>
                You don't just learn. <em>You do.</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7-DAY LADDER */}
      <section id="programme" className="l-section l-section--focus">
        <div className="l-wrap l-reveal">
          <p className="l-label">The programme</p>
          <h2 className="l-h2">Here's what changes —<br /><em>day by day.</em></h2>
          <p className="l-p" style={{ marginBottom: '2rem' }}>Each day features specific exercises and visible outcomes.</p>

          <div 
            className="l-carousel-viewport"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="l-carousel-track"
              style={{
                transform: `translateX(calc(-1 * (var(--card-w) / 2 + var(--card-m)) - (${activeIndex} * (var(--card-w) + 2 * var(--card-m))) + ${touchOffset}px))`,
                transition: touchStart !== null ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0, 0.2, 1)'
              }}
            >
              {DAYS.map((d, i) => (
                <div
                  key={d.n}
                  className={`l-carousel-card ${i === activeIndex ? 'active' : ''}`}
                  style={{ '--day-rgb': d.rgb }}
                  onClick={() => setActiveIndex(i)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '80px' }}>
                      <div style={{ height: '2px', background: d.color, boxShadow: `0 0 6px ${d.color}`, marginBottom: '4px' }} />
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', color: d.color, textTransform: 'uppercase' }}>Day {d.n}</span>
                    </div>
                  </div>

                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.25rem', color: '#EDE8DC', marginBottom: '0.5rem', lineHeight: '1.2' }}>{d.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(237,232,220,0.6)', marginBottom: '1.25rem', fontWeight: 300, minHeight: '3em' }}>{d.action}</div>

                  <div style={{ borderTop: '1px solid #2C2C26', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.65rem', color: '#6B6860', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Outcome:</div>
                    <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: d.color }}>{d.feel}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="l-carousel-nav">
            <button
              className="l-carousel-btn"
              onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous Day"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="l-carousel-dots">
              {DAYS.map((_, i) => (
                <div
                  key={i}
                  className={`l-carousel-dot ${i === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
            <button
              className="l-carousel-btn"
              onClick={() => setActiveIndex(prev => Math.min(DAYS.length - 1, prev + 1))}
              disabled={activeIndex === DAYS.length - 1}
              aria-label="Next Day"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="l-card" style={{ marginTop: '3rem' }}>
            <p style={{ color: '#EDE8DC', fontSize: '1rem' }}>By Day 7, you won't just feel better — you'll have a system that <strong>protects your attention from the inside out.</strong></p>
          </div>
        </div>
      </section>



      {/* INSIDE */}
      <section id="inside" className="l-section l-section--calm">
        <div className="l-wrap l-reveal">
          <p className="l-label">Your Focus Toolkit</p>
          <h2 className="l-h2">Everything you get to<br /><em>take back control.</em></h2>

          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '1.25rem', color: '#F5C842', fontFamily: "'DM Serif Display', serif", marginBottom: '0.5rem' }}>41 Interactive Tasks. Not theory — real action.</p>
            <p className="l-p" style={{ opacity: 0.7 }}>Works on any device. No downloads. No app stores. Open and start.</p>
          </div>

          <div className="l-feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="l-feature">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '12px' }}>
                    <strong>{f.title}</strong>
                    <span className="l-chip">{f.value}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'rgba(237,232,220,0.65)', fontWeight: 300 }}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="l-value-total">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6B6860', marginBottom: '8px' }}>Total Bundle Value</div>
            <div className="l-num" style={{ fontSize: '2rem', color: '#FF3B3B', textDecoration: 'line-through', opacity: 0.6, marginBottom: '2rem' }}>₹{BUNDLE_VALUE.toLocaleString('en-IN')}</div>

            <div style={{ fontSize: '1rem', color: '#F5C842', fontWeight: 600, marginBottom: '0.5rem' }}>You get everything for:</div>
            <div className="l-num" style={{ fontSize: '3.5rem', color: '#F5C842', lineHeight: 1 }}>₹{PRICE}</div>
            <div className="l-num" style={{ fontSize: '0.9rem', color: '#00E87A', marginTop: '8px', opacity: 0.8 }}>(You Save: ₹{(BUNDLE_VALUE - PRICE).toLocaleString('en-IN')})</div>
          </div>
        </div>
      </section>

      {/* FOR / NOT FOR */}
      <section className="l-section">
        <div className="l-wrap l-reveal">
          <p className="l-label">Be honest with yourself</p>
          <h2 className="l-h2">Who this is for —<br /><em>and who it isn't.</em></h2>
          <div className="l-split">
            <div className="l-split-col" style={{ borderTop: '2px solid #F5C842' }}>
              <h4 style={{ fontSize: '0.62rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', color: '#F5C842', fontFamily: "'DM Sans',sans-serif" }}>This is for you if</h4>
              <ul>
                {['You struggle to focus', 'Your screen time embarrasses you', 'You want structure, not just tips', 'You can commit to the process for 7 days'].map(t => (
                  <li key={t}><span style={{ color: '#F5C842' }}>→</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="l-split-col" style={{ borderTop: '2px solid #2C2C26' }}>
              <h4 style={{ fontSize: '0.62rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', color: '#6B6860', fontFamily: "'DM Sans',sans-serif" }}>Not for you if</h4>
              <ul>
                {['You want a magic fix with zero effort', 'You won\'t take action', 'You prefer passive short content'].map(t => (
                  <li key={t}><span style={{ color: '#6B6860' }}>×</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="l-section l-section--money" id="pricing">
        <div className="l-wrap l-reveal">
          <div className="l-pricing" style={{ marginTop: '0' }}>
            {/* Pricing display */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div className="l-num" style={{ fontSize: '1.8rem', color: '#6B6860', textDecoration: 'line-through' }}>₹{PREVIOUS_PRICE}</div>
              <div className="l-num" style={{ fontSize: '3.5rem', color: '#F5C842', lineHeight: 1 }}>₹{PRICE}</div>
            </div>
            <div className="l-num" style={{ fontSize: '0.9rem', color: '#00E87A', marginTop: '8px' }}>
              Launch price — you save ₹{PREVIOUS_PRICE - PRICE}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#6B6860', marginBottom: '1.25rem', marginTop: '10px' }}>Instant access • No subscription • Start today</div>

            <button className="l-cta" style={{ margin: '0 auto' }} onClick={isEnrolled ? onReturnToCourse : handleStartCheckout}>
              {isEnrolled ? 'Return to Course' : `Yes, I Want My Focus Back`}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', color: 'rgba(237,232,220,0.85)', fontWeight: 400 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E87A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              7-Day Money-Back Guarantee
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #2C2C26' }}>
              <div style={{ fontSize: '0.9rem', color: '#EDE8DC', fontWeight: 500, marginBottom: '4px' }}>Start today.</div>
              <div style={{ fontSize: '0.9rem', color: '#F5C842', fontWeight: 600 }}>See results in 7 days.</div>
            </div>

          </div>

          <div className="l-guarantee" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 style={{ color: '#F5C842', fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', marginBottom: '0.75rem' }}>7-Day Money-Back Guarantee</h3>
            <p style={{ color: 'rgba(237,232,220,0.8)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, fontWeight: 300 }}>
              Do the 7 days.<br />
              If your focus hasn&apos;t improved, email us within 7 days of finishing<br />
              and you get 100% back. No friction, no interrogation.
            </p>
          </div>
        </div>
        {/* THE CHOICE */}
        <section className="l-section l-section--alarm">
          <div className="l-wrap l-reveal" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <p className="l-label" style={{ color: '#F5C842' }}>DECISION TIME</p>
            <h2 id="c0" className="l-h2" style={{ marginBottom: '3rem' }}>The Choice Is Yours</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>

              {/* Option A */}
              <div id="c1" className="l-choice l-choice--bad">
                <h3 style={{ color: '#FF3B3B', fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: '1.25rem' }}>Option A — Leave This Page</h3>
                <p style={{ color: '#888', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  Leave now, keep losing hours every day, and stay stuck in the same cycle.
                </p>
              </div>

              {/* BRIDGE */}
              <p id="c3" style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '1.6rem',
                color: '#F5C842',
                margin: '1rem 0',
                fontStyle: 'italic',
                lineHeight: 1.4
              }}>
                "You already know which one you want."
              </p>

              {/* Option B */}
              <div id="c2" className="l-choice l-choice--good">
                <h3 style={{ color: '#00E87A', fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: '1.25rem' }}>Option B — Invest in Your Focus</h3>
                <p style={{ color: '#EDE8DC', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                  Invest now and take your attention back permanently—and move your life forward.
                </p>

                <button id="c4" className="l-cta l-cta--go" style={{ margin: '0 auto' }} onClick={isEnrolled ? onReturnToCourse : handleStartCheckout}>
                  {isEnrolled ? 'Return to Course' : 'Start My 7-Day Reset'}
                  <svg
                    width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <p style={{
                color: 'rgba(237, 232, 220, 0.5)',
                fontSize: '0.9rem',
                fontWeight: 500,
                textAlign: 'center',
                margin: '1rem 0 0 0',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF3B3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Every day you wait, your future self falls behind.
              </p>

            </div>
          </div>
        </section>
      </section>



      {/* FAQ */}
      <section id="faq" className="l-section">
        <div className="l-wrap l-reveal">
          <p className="l-label">Common questions</p>
          <h2 className="l-h2">Before you decide</h2>
          <div style={{ marginTop: '1.5rem' }}>
            {FAQS.map(([q, a], i) => (
              <div key={i} className="l-faq-item">
                <button className="l-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {q}
                  <span style={{ color: '#F5C842', fontSize: '0.78rem', flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
                </button>
                {openFaq === i && <div className="l-faq-a">{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="l-section l-section--warm" style={{ textAlign: 'center' }}>
        <div className="l-wrap l-reveal" style={{ position: 'relative' }}>
          <p className="l-label" style={{ textAlign: 'center' }}>7 days. That's all it takes to take control back.</p>
          <h1 className="l-h1" style={{ fontSize: 'clamp(2rem,5vw,2.8rem)', textAlign: 'center' }}>Your attention is <em>still there.</em><br />You just need to reclaim it.</h1>
          <p className="l-p" style={{ maxWidth: '420px', margin: '1.25rem auto 2.5rem', fontSize: '1rem', textAlign: 'center' }}>One programme. Proven protocols. One system that lasts.</p>
          <button className="l-cta" style={{ margin: '0 auto' }} onClick={isEnrolled ? onReturnToCourse : handleStartCheckout}>
            {isEnrolled ? 'Return to Course' : 'Start Day 1'}
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6B6860' }}>Instant access · Works on any device</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="l-footer">
        <div className="l-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

          <div className="l-brand">
            <span className="l-brand-mark" aria-hidden="true" />
            <span>Deeper Fix</span>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#6B6860', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            {!showContact ? (
              <button onClick={() => setShowContact(true)} style={{ background: 'none', border: 'none', color: 'rgba(237,232,220,0.7)', cursor: 'pointer', textDecoration: 'underline', padding: '4px 8px', fontSize: 'inherit' }}>Contact / Support</button>
            ) : (
              <>
                <div style={{ color: '#F5C842' }}>Contact / Support</div>
                <div style={{ color: 'rgba(237,232,220,0.8)' }}>
                  <a href="mailto:favazmk12@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>favazmk12@gmail.com</a>
                  <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
                  <a href="https://wa.me/919061926060" style={{ color: 'inherit', textDecoration: 'none' }}>WhatsApp: +91 9061926060</a>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            <button onClick={() => { setShowPrivacy(true); window.scrollTo(0, 0); }} style={{ background: 'none', border: 'none', color: '#6B6860', cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</button>
            <button onClick={() => { setShowTerms(true); window.scrollTo(0, 0); }} style={{ background: 'none', border: 'none', color: '#6B6860', cursor: 'pointer', textDecoration: 'underline' }}>Terms & Conditions</button>
          </div>

          <p style={{ fontSize: '0.72rem', color: '#4A4840', marginTop: '1rem' }}>© {new Date().getFullYear()} Deeper Fix. All rights reserved.</p>
        </div>
      </footer>

      </div>{/* /l-content */}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          onClose={() => setShowCheckoutModal(false)}
          onProceed={handlePayment}
          previousPrice={PREVIOUS_PRICE}
          price={PRICE}
          busy={checkoutBusy}
        />
      )}

      <Toast message={toast?.message} tone={toast?.tone} onDismiss={dismissToast} />

    </div>
  );
}
