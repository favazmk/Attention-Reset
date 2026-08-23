import React, { useEffect, useLayoutEffect, useRef } from 'react';
import PrivacyPolicy from '../components/PrivacyPolicy';
import TermsAndConditions from '../components/TermsAndConditions';
import CheckoutModal from '../components/CheckoutModal';
import Toast from '../components/Toast';
import JourneyRail from '../components/landing/JourneyRail';
import StatBand from '../components/landing/StatBand';
import AttentionLoop from '../components/landing/AttentionLoop';
import {
  Laptop,
  Phone,
  Tablet,
  ScreenDayOne,
  ScreenDayTwo,
  ScreenDaySeven,
} from '../components/landing/ProductScreens';
import { authedPost } from '../api';
import '../styles/landing.css';

const PRICE = 99;
const PREVIOUS_PRICE = 399;
const BUNDLE_VALUE = 2094;

// `rgb` mirrors `color` as a triplet so the journey rail can tint its active
// row through rgba(var(--day-rgb), a) without a runtime colour conversion.
const DAYS = [
  { n: '01', color: '#00E87A', rgb: '0,232,122', title: 'The Digital Kill-Switch', action: 'Stop the pings. Start the progress.', feel: 'Lighter. Less reactive.' },
  { n: '02', color: '#B060FF', rgb: '176,96,255', title: 'The Snap Audit', action: 'Find your attention leaks in 5 minutes.', feel: 'Aware. In control of what you\'re fighting.' },
  { n: '03', color: '#3BB8E8', rgb: '59,184,232', title: 'The Monk Sprint', action: 'One task. Zero noise. 100% impact.', feel: 'Surprised by what you finished.' },
  { n: '04', color: '#F5C842', rgb: '245,200,66', title: 'The Focus Sprints', action: 'Level up your mental endurance.', feel: 'Your brain starts to feel like yours again.' },
  { n: '05', color: '#00E5C0', rgb: '0,229,192', title: 'The Fortress', action: 'Design a space where focus is the only option.', feel: 'Work feels 10× less exhausting.' },
  { n: '06', color: '#FF3B3B', rgb: '255,59,59', title: 'The Dopamine Reset', action: 'Recover your edge through strategic boredom.', feel: 'Calm you haven\'t felt in months.' },
  { n: '07', color: '#FF8C00', rgb: '255,140,0', title: 'The Attention OS', action: 'Build a system that works so you don\'t have to.', feel: 'You have a system. Not just intentions.' },
];

const SYMPTOMS = [
  'You open your phone to do one thing and lose 30 minutes',
  'You can\'t read 3 paragraphs without reaching for your phone',
  'You start tasks but finish almost none of them',
  'Your best ideas stay in your head because focus never arrives',
  'You feel guilty scrolling but can\'t seem to stop',
  'Deep work used to feel easy. Now it feels impossible.',
  'Can\'t watch a 10 minute video without skipping.',
];

// The "before" column is the symptom list the reader has already ticked; the
// "after" column is the programme's own day-by-day outcomes, each tagged with
// the day that produces it. Nothing here is a new claim.
const BEFORE = [SYMPTOMS[0], SYMPTOMS[2], SYMPTOMS[1], SYMPTOMS[5], SYMPTOMS[4]];
const AFTER_DAYS = ['01', '02', '03', '05', '07'];

const STATS = [
  { value: 7, label: 'Days', note: 'One reset, start to finish' },
  { value: '10–20', label: 'Minutes a day', note: 'Day 1 takes 10 minutes' },
  { value: 41, label: 'Interactive tasks', note: 'Not theory — real action' },
];

const FEATURES = [
  {
    title: '7-Day Protocols',
    value: '₹599 value',
    desc: 'Science-backed daily missions designed to rebuild your focus step by step.',
  },
  {
    title: '27 Clickable Checklists',
    value: '₹499 value',
    desc: 'Action-based tasks you complete in real time — not just read.',
  },
  {
    title: '1 Attention OS Builder',
    value: '₹99 value',
    desc: 'Your permanent post-reset system to protect your focus long-term.',
  },
  {
    title: '1 Before vs. After Score',
    value: '₹199 value',
    desc: 'See exactly how far you\'ve come — in numbers.',
  },
  {
    title: '3-Step Focus Ritual Builder',
    value: '₹299 value',
    desc: 'A repeatable ritual that trains your brain to enter deep work on command.',
  },
  {
    title: '11 Focus Blueprint & Audit insights',
    value: '₹399 value',
    desc: 'A clear breakdown of your distractions, patterns, and reclaimed time.',
  },
];

const FAQS = [
  ['Do I need to download anything?', 'No. It\'s a web app — open it in any browser on your phone, tablet, or laptop. Nothing to install. Your progress is auto-saved.'],
  ['What if I have ADHD or can\'t focus at all?', 'That\'s exactly who this was built for. Each day starts with a 5-minute win. You don\'t need to be focused to start — just open it.'],
  ['What if I\'ve tried this kind of thing before and quit?', 'Day 1 takes 10 minutes. The programme is designed for low-friction completion. You don\'t need motivation — you need a low starting point to begin.'],
  ['Will this work if I\'m on screens all day for work?', 'Yes. Day 5 (The Fortress) specifically addresses environment design for people who can\'t avoid screens.'],
  ['Is this a video course?', 'No. It\'s a focused, interactive web programme — designed for people with fractured attention who don\'t need another video queue to feel guilty about.'],
  ['Why will this work when other things didn’t?', 'Because this isn’t information. It’s structured action.'],
];

const ARROW = (
  <svg
    width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function Landing({ onPaymentSuccess, onStartReset, isLoggedIn, isEnrolled, onReturnToCourse, onOpenProfile }) {
  const [openFaq, setOpenFaq] = React.useState(null);
  const [checkedSymptoms, setCheckedSymptoms] = React.useState({});
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const [showSticky, setShowSticky] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const [checkoutBusy, setCheckoutBusy] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const dismissToast = React.useCallback(() => setToast(null), []);

  const rootRef = useRef(null);

  const checkedCount = Object.values(checkedSymptoms).filter(Boolean).length;

  useEffect(() => {
    const handleScroll = () => {
      // Show the sticky bar and the header CTA once the hero is behind us.
      setShowSticky(window.scrollY > 700);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  // Every CTA on the page funnels through here so enrolment state is handled in
  // exactly one place.
  const primaryAction = isEnrolled ? onReturnToCourse : handleStartCheckout;

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

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="l-header">
        <div className="l-wrap l-header-inner">
          <div className="l-brand">
            <span className="l-brand-mark" aria-hidden="true" />
            <span>Deeper Fix</span>
          </div>
          <nav className="l-header-nav">
            <a href="#symptoms" className="l-header-link">Symptoms</a>
            <a href="#programme" className="l-header-link">The Programme</a>
            <a href="#inside" className="l-header-link">What&apos;s Inside</a>
            <a href="#pricing" className="l-header-link">Pricing</a>
            <a href="#faq" className="l-header-link">FAQ</a>
          </nav>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="l-btn-nav"
              onClick={primaryAction}
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
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              style={{ background: 'none', border: 'none', color: '#EDE8DC', cursor: 'pointer', padding: '4px', display: 'none', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            <a href="#inside" onClick={() => setIsMenuOpen(false)}>What&apos;s Inside</a>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                My Profile
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────
          Two columns: the promise on the left, the actual product on the
          right. The video that used to carry this section alone is now the
          light source behind it. */}
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

        <div className="l-wrap l-hero-content">
          <div className="l-hero-grid">

            <div className="l-hero-copy">
              <p className="l-label">7-Day Interactive Programme</p>
              <h1 className="l-h1">Stop Blaming Yourself.<br />Your Attention Was Stolen.<br /><em>Let’s Take It Back.</em></h1>
              <div className="l-rule" />
              <p className="l-p" style={{ fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '480px' }}>
                The reset your brain has been waiting for — 7 days of guided,
                interactive exercises that rebuild how you focus.
              </p>
              <button className="l-cta" onClick={primaryAction}>
                {isEnrolled ? 'Return to Course' : 'Start the Reset'}
                {ARROW}
              </button>
              <div className="l-trust">
                <span><span className="l-dot" />41 interactive tasks</span>
                <span><span className="l-dot" />10–20 min/day</span>
                <span><span className="l-dot" />Works on any device</span>
              </div>
            </div>

            {/* The product itself, not a stock photograph of one.
                A laptop lid squeezed into a 330px column renders its own UI at
                7px, so narrow viewports get the phone instead — same screen,
                legible, and the frame someone on a phone recognises. */}
            <div className="l-hero-device">
              <div className="l-at-wide">
                <Laptop className="l-float">
                  <ScreenDayOne />
                </Laptop>
              </div>
              <div className="l-at-narrow">
                <Phone className="l-float l-phone-hero">
                  <ScreenDayOne />
                </Phone>
              </div>
              <p className="l-showcase-cap">Day 1, exactly as you’ll see it</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── SYMPTOM MIRROR + THE LOOP ───────────────────────────────────
          The pain, made visible before it is described. */}
      <section id="symptoms" className="l-section l-section--alarm l-section--flush">
        <div className="l-wrap l-reveal">
          <p className="l-label">Does this sound familiar?</p>
          <h2 className="l-h2">Signs your attention<br /><em>is being hijacked</em></h2>

          <AttentionLoop />

          <p className="l-p" style={{ marginBottom: 0 }}>Check what sounds familiar:</p>
          <ul className="l-checklist">
            {SYMPTOMS.map((t, i) => (
              <li
                key={i}
                data-on={!!checkedSymptoms[i]}
                role="checkbox"
                aria-checked={!!checkedSymptoms[i]}
                tabIndex={0}
                onClick={() => toggleSymptom(i)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleSymptom(i);
                  }
                }}
              >
                <div className="l-cb" />
                <span className="l-cb-text">{t}</span>
              </li>
            ))}
          </ul>
          <div className="l-card">
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#EDE8DC', margin: 0 }}>
              {checkedCount >= 3
                ? <>You checked {checkedCount}. Your attention hasn&apos;t broken. It&apos;s been <strong>trained this way.</strong></>
                : <>If you checked 3 or more — your attention hasn&apos;t broken. It&apos;s been <strong>trained this way.</strong></>}
              <br /><br />
              And it can be retrained in 7 days.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE REALISATION ─────────────────────────────────────────────
          Typography-led. No cards, no grid — this section is one thought. */}
      <section className="l-section l-section--warm">
        <div className="l-wrap l-reveal" style={{ maxWidth: '820px' }}>
          <p className="l-label">The real problem</p>
          <h2 className="l-h2" style={{ fontSize: 'clamp(2.1rem, 6.5vw, 3.6rem)', marginBottom: 'var(--l-6)' }}>
            The problem isn&apos;t you.<br /><em>It&apos;s the system.</em>
          </h2>
          <div className="l-rule" />
          <p className="l-p" style={{ fontSize: '1.15rem', marginBottom: 'var(--l-6)' }}>
            Algorithms are engineered to hijack your dopamine. Every notification
            triggers a cortisol spike. You interrupt yourself every 3 minutes — and
            need 23 minutes to refocus.
          </p>
          <p className="l-p" style={{ fontSize: '1.15rem', marginBottom: 'var(--l-6)' }}>
            So the fix isn&apos;t more willpower. It&apos;s changing the system
            around you — which is what the next 7 days do, one deliberate step at
            a time.
          </p>
          <div style={{ padding: '0.25rem 0 0.25rem 1.5rem', borderLeft: '3px solid #F5C842' }}>
            <p style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontFamily: "'DM Serif Display', serif", color: '#F5C842', margin: 0, letterSpacing: '0.5px' }}>
              You don&apos;t just learn. <em>You do.</em>
            </p>
          </div>
        </div>
      </section>

      {/* ── STAT BAND ───────────────────────────────────────────────────
          A breath between two dense sections, carried entirely by numbers. */}
      <section className="l-section l-section--flush" style={{ paddingTop: 'var(--l-7)', paddingBottom: 'var(--l-7)' }}>
        <div className="l-wrap l-reveal">
          <StatBand stats={STATS} />
        </div>
      </section>

      {/* ── THE 7-DAY JOURNEY ───────────────────────────────────────────
          Scroll-driven: the spine fills and each day lights as you reach it. */}
      <section id="programme" className="l-section l-section--focus">
        <div className="l-wrap l-reveal">
          <p className="l-label">The programme</p>
          <h2 className="l-h2">Here&apos;s what changes —<br /><em>day by day.</em></h2>
          <p className="l-p">Each day features specific exercises and a visible outcome.</p>

          <JourneyRail days={DAYS} />

          <div className="l-card" style={{ marginTop: 'var(--l-7)' }}>
            <p style={{ color: '#EDE8DC', fontSize: '1rem', margin: 0 }}>
              By Day 7, you won&apos;t just feel better — you&apos;ll have a system that <strong>protects your attention from the inside out.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── PRODUCT SHOWCASE ────────────────────────────────────────────
          Removes the last piece of uncertainty: what am I actually buying? */}
      <section className="l-section l-section--calm">
        <div className="l-wrap l-reveal">
          <p className="l-label">See it before you buy it</p>
          <h2 className="l-h2">This isn&apos;t another PDF.</h2>

          <div className="l-showcase">
            <div className="l-showcase-devices">
              <div className="l-showcase-item">
                <Tablet>
                  <ScreenDaySeven />
                </Tablet>
                <p className="l-showcase-cap">Day 7 — your attention system</p>
              </div>
              <div className="l-showcase-item">
                <Phone>
                  <ScreenDayTwo />
                </Phone>
                <p className="l-showcase-cap">Day 2 — the audit</p>
              </div>
            </div>

            <div>
              <p className="l-p" style={{ fontSize: '1.05rem', marginBottom: 'var(--l-5)' }}>
                It&apos;s a web programme you work through, not a document you file
                away. You tick real boxes, write real answers, and finish each day
                with something you actually did.
              </p>
              <ul className="l-ba-col" style={{ listStyle: 'none', padding: 'var(--l-5)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--l-3)' }}>
                {[
                  'Opens in any browser — phone, tablet or laptop',
                  'No downloads, no app stores',
                  'Progress saves automatically as you go',
                  'Come back to it whenever you want',
                ].map((t) => (
                  <li key={t} style={{ display: 'flex', gap: 'var(--l-3)', fontSize: '0.92rem', fontWeight: 300, color: 'rgba(237,232,220,0.85)' }}>
                    <span className="l-ba-mark" style={{ color: '#00E87A' }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEFORE → AFTER ──────────────────────────────────────────────
          Left column is the symptom list; right column is the programme's own
          day-by-day outcomes. No claim appears here that isn't already made
          somewhere it can be checked. */}
      <section className="l-section">
        <div className="l-wrap l-reveal">
          <p className="l-label">The shift</p>
          <h2 className="l-h2">Where you are now —<br /><em>and where 7 days puts you.</em></h2>

          <div className="l-ba">
            <div className="l-ba-col l-ba-col--before">
              <div className="l-ba-k">Right now</div>
              <ul>
                {BEFORE.map((t) => (
                  <li key={t}><span className="l-ba-mark">—</span>{t}</li>
                ))}
              </ul>
            </div>

            <div className="l-ba-bridge">7 Days</div>

            <div className="l-ba-col l-ba-col--after">
              <div className="l-ba-k">After the reset</div>
              <ul>
                {AFTER_DAYS.map((n) => {
                  const day = DAYS.find((d) => d.n === n);
                  return (
                    <li key={n}>
                      <span className="l-ba-mark">✓</span>
                      <span>
                        {day.feel}
                        <span style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(237,232,220,0.34)', marginTop: '4px' }}>
                          Day {day.n} · {day.title}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ───────────────────────────────────────────────
          A ledger of components rather than six identical tiles. */}
      <section id="inside" className="l-section l-section--warm">
        <div className="l-wrap l-reveal">
          <p className="l-label">Your Focus Toolkit</p>
          <h2 className="l-h2">Everything you get to<br /><em>take back control.</em></h2>
          <p className="l-p" style={{ fontSize: '1.05rem' }}>
            41 interactive tasks across 7 days. Every component below is part of
            the programme you get access to the moment you join.
          </p>

          <div className="l-bundle">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="l-bundle-row">
                <div className="l-bundle-i">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <p className="l-bundle-t">{f.title}</p>
                  <p className="l-bundle-d">{f.desc}</p>
                </div>
                <span className="l-chip">{f.value}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 'var(--l-5)', textAlign: 'right', fontSize: '0.82rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#6B6860' }}>
            Total listed value —{' '}
            <span className="l-num" style={{ color: 'rgba(237,232,220,0.72)' }}>
              ₹{BUNDLE_VALUE.toLocaleString('en-IN')}
            </span>
          </p>
        </div>
      </section>

      {/* ── WHO IT'S FOR ────────────────────────────────────────────────── */}
      <section className="l-section">
        <div className="l-wrap l-reveal">
          <p className="l-label">Be honest with yourself</p>
          <h2 className="l-h2">Who this is for —<br /><em>and who it isn&apos;t.</em></h2>
          <div className="l-split">
            <div className="l-split-col" style={{ borderTop: '2px solid #F5C842' }}>
              <h4 className="l-split-k l-split-k--yes">This is for you if</h4>
              <ul>
                {['You struggle to focus', 'Your screen time embarrasses you', 'You want structure, not just tips', 'You can commit to the process for 7 days'].map(t => (
                  <li key={t}><span style={{ color: '#F5C842' }}>→</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="l-split-col" style={{ borderTop: '2px solid #2C2C26' }}>
              <h4 className="l-split-k l-split-k--no">Not for you if</h4>
              <ul>
                {['You want a magic fix with zero effort', 'You won\'t take action', 'You prefer passive short content'].map(t => (
                  <li key={t}><span style={{ color: '#6B6860' }}>×</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section className="l-section l-section--money" id="pricing">
        <div className="l-wrap l-reveal">
          <p className="l-label" style={{ justifyContent: 'center', display: 'flex' }}>The price</p>
          <h2 className="l-h2" style={{ textAlign: 'center', marginBottom: 'var(--l-6)' }}>
            Everything you need to<br /><em>reset your attention.</em>
          </h2>

          <div className="l-pricing" style={{ marginTop: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div className="l-num" style={{ fontSize: '1.8rem', color: '#6B6860', textDecoration: 'line-through' }}>₹{PREVIOUS_PRICE}</div>
              <div className="l-num" style={{ fontSize: 'clamp(3.5rem, 12vw, 5rem)', color: '#F5C842', lineHeight: 1 }}>₹{PRICE}</div>
            </div>
            <div className="l-num" style={{ fontSize: '0.9rem', color: '#00E87A', marginTop: '8px' }}>
              Launch price — you save ₹{PREVIOUS_PRICE - PRICE}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#6B6860', marginBottom: '1.75rem', marginTop: '10px' }}>
              One-time payment • No subscription • Instant access
            </div>

            <button className="l-cta" style={{ margin: '0 auto' }} onClick={primaryAction}>
              {isEnrolled ? 'Return to Course' : 'Take Back My Attention'}
              {ARROW}
            </button>

            <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #2C2C26', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <h3 style={{ color: '#F5C842', fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', margin: 0 }}>7-Day Money-Back Guarantee</h3>
              <p style={{ color: 'rgba(237,232,220,0.75)', fontSize: '0.92rem', lineHeight: 1.65, margin: 0, fontWeight: 300, maxWidth: '46ch' }}>
                Do the 7 days. If your focus hasn&apos;t improved, email us within
                7 days of finishing and you get 100% back. No friction, no
                interrogation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE CHOICE ──────────────────────────────────────────────────── */}
      <section className="l-section l-section--alarm">
        <div className="l-wrap l-reveal" style={{ textAlign: 'center', maxWidth: '620px' }}>
          <p className="l-label" style={{ justifyContent: 'center', display: 'flex' }}>Decision time</p>
          <h2 className="l-h2" style={{ marginBottom: '2.5rem' }}>The Choice Is Yours</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center' }}>

            <div className="l-choice l-choice--bad">
              <h3 style={{ color: '#FF3B3B', fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', marginBottom: '1rem' }}>Option A — Leave This Page</h3>
              <p style={{ color: '#888', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                Close the tab and keep the same habits. Nothing changes, and
                nothing is lost except the thing you came here about.
              </p>
            </div>

            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.35rem, 4vw, 1.7rem)',
              color: '#F5C842',
              margin: '0.5rem 0',
              fontStyle: 'italic',
              lineHeight: 1.4,
            }}>
              “You already know which one you want.”
            </p>

            <div className="l-choice l-choice--good">
              <h3 style={{ color: '#00E87A', fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', marginBottom: '1rem' }}>Option B — Invest in Your Focus</h3>
              <p style={{ color: '#EDE8DC', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Spend ₹99 and 10–20 minutes a day for a week, and walk away with a
                system that protects your attention.
              </p>

              <button className="l-cta l-cta--go" style={{ margin: '0 auto' }} onClick={primaryAction}>
                {isEnrolled ? 'Return to Course' : 'Start My 7-Day Reset'}
                {ARROW}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="l-section">
        <div className="l-wrap l-reveal" style={{ maxWidth: '760px' }}>
          <p className="l-label">Common questions</p>
          <h2 className="l-h2">Before you decide</h2>
          <div style={{ marginTop: '1.5rem' }}>
            {FAQS.map(([q, a], i) => (
              <div key={i} className="l-faq-item">
                <button
                  className="l-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  {q}
                  <span aria-hidden="true" style={{ color: '#F5C842', fontSize: '0.78rem', flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
                </button>
                {openFaq === i && <div className="l-faq-a">{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="l-section l-section--warm" style={{ textAlign: 'center' }}>
        <div className="l-wrap l-reveal">
          <p className="l-label" style={{ justifyContent: 'center', display: 'flex' }}>7 days. That&apos;s all it takes.</p>
          <h1 className="l-h1" style={{ fontSize: 'clamp(2.2rem, 7vw, 4rem)', textAlign: 'center', maxWidth: '15ch', margin: '0 auto var(--l-6)' }}>
            Your attention is <em>still yours.</em>
          </h1>
          <p className="l-p" style={{ maxWidth: '440px', margin: '0 auto 2.5rem', fontSize: '1.05rem', textAlign: 'center' }}>
            You just need to take it back. One programme, seven days, one system
            that lasts.
          </p>
          <button className="l-cta" style={{ margin: '0 auto' }} onClick={primaryAction}>
            {isEnrolled ? 'Return to Course' : 'Start Day 1'}
            {ARROW}
          </button>
          <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#6B6860' }}>
            ₹{PRICE} one-time · Instant access · Works on any device
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
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
            <button onClick={() => { setShowTerms(true); window.scrollTo(0, 0); }} style={{ background: 'none', border: 'none', color: '#6B6860', cursor: 'pointer', textDecoration: 'underline' }}>Terms &amp; Conditions</button>
          </div>

          <p style={{ fontSize: '0.72rem', color: '#4A4840', marginTop: '1rem' }}>© {new Date().getFullYear()} Deeper Fix. All rights reserved.</p>
        </div>
      </footer>

      </div>{/* /l-content */}

      {/* ── STICKY CTA (mobile) ─────────────────────────────────────────
          Hidden above the hero and while checkout is open, so it never
          competes with the thing it is trying to sell. */}
      <div className="l-sticky" data-show={showSticky && !showCheckoutModal ? 'true' : 'false'}>
        <div className="l-sticky-copy">
          <div className="l-sticky-t">7-Day Attention Reset</div>
          <div className="l-sticky-p">
            {isEnrolled ? (
              <span style={{ fontSize: '0.95rem' }}>You&apos;re enrolled</span>
            ) : (
              <><s>₹{PREVIOUS_PRICE}</s>₹{PRICE}</>
            )}
          </div>
        </div>
        <button
          className="l-cta"
          onClick={primaryAction}
          tabIndex={showSticky ? 0 : -1}
        >
          {isEnrolled ? 'Resume' : 'Start the Reset'}
          {ARROW}
        </button>
      </div>

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
