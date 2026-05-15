import React, { useEffect } from 'react';
import PrivacyPolicy from '../components/PrivacyPolicy';
import TermsAndConditions from '../components/TermsAndConditions';
import CheckoutModal from '../components/CheckoutModal';

const DAY_COLORS = ['#00E87A', '#B060FF', '#3BB8E8', '#F5C842', '#00E5C0', '#FF3B3B', '#FF8C00'];

const DAYS = [
  { n: '01', color: '#00E87A', title: 'The Digital Kill-Switch', action: 'Stop the pings. Start the progress.', feel: 'Lighter. Less reactive.' },
  { n: '02', color: '#B060FF', title: 'The Snap Audit', action: 'Find your attention leaks in 5 minutes.', feel: 'Aware. In control of what you\'re fighting.' },
  { n: '03', color: '#3BB8E8', title: 'The Monk Sprint', action: 'One task. Zero noise. 100% impact.', feel: 'Surprised by what you finished.' },
  { n: '04', color: '#F5C842', title: 'The Focus Sprints', action: 'Level up your mental endurance.', feel: 'Your brain starts to feel like yours again.' },
  { n: '05', color: '#00E5C0', title: 'The Fortress', action: 'Design a space where focus is the only option.', feel: 'Work feels 10× less exhausting.' },
  { n: '06', color: '#FF3B3B', title: 'The Dopamine Reset', action: 'Recover your edge through strategic boredom.', feel: 'Calm you haven\'t felt in months.' },
  { n: '07', color: '#FF8C00', title: 'The Attention OS', action: 'Build a system that works so you don\'t have to.', feel: 'You have a system. Not just intentions.' },
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

  // ── Coupon state ────────────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = React.useState('');
  const [couponApplied, setCouponApplied] = React.useState(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [couponError, setCouponError] = React.useState('');
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);

  const ORIGINAL_PRICE = 399;
  const finalPrice = couponApplied
    ? Math.round(ORIGINAL_PRICE * (1 - couponApplied.discount_percent / 100))
    : ORIGINAL_PRICE;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponApplied(data);
        setCouponError('');
      } else {
        setCouponApplied(null);
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Could not validate coupon. Try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponCode('');
    setCouponError('');
  };
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchOffset, setTouchOffset] = React.useState(0);

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

  useEffect(() => {
    if (isLoggedIn && !isEnrolled && sessionStorage.getItem('auto_open_checkout') === 'true') {
      sessionStorage.removeItem('auto_open_checkout');
      setTimeout(() => {
        setShowCheckoutModal(true);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isEnrolled]);

  const handleStartCheckout = () => {
    if (isEnrolled) return;
    setShowCheckoutModal(true);
  };

  const handlePayment = async () => {
    if (!isLoggedIn) {
      setShowCheckoutModal(false);
      sessionStorage.setItem('auto_open_checkout', 'true');
      onStartReset('signup');
      return;
    }

    try {
      // 1. Create order — pass coupon code if applied
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupon_code: couponApplied?.code || null,
        }),
      });
      const order = await response.json();

      if (!response.ok) throw new Error(order.error || 'Failed to create order');

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "7-Day Attention Reset",
        description: couponApplied
          ? `${couponApplied.discount_percent}% off with code ${couponApplied.code}`
          : "Reclaim your focus in one week",
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify payment
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              coupon_code: couponApplied?.code || null,
              final_amount: finalPrice,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyRes.ok) {
            if (window.fbq) {
              window.fbq('track', 'Purchase', {
                value: finalPrice,
                currency: 'INR',
              }, {
                eventID: response.razorpay_order_id,
              });
            }
            onPaymentSuccess();
          } else {
            alert("Payment verification failed: " + verifyData.message);
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#F5C842" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  const toggleSymptom = (i) => {
    setCheckedSymptoms(prev => ({ ...prev, [i]: !prev[i] }));
  };

  // Inject landing-specific styles
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'landing-styles';
    style.textContent = `
      .l-section { padding: 5.5rem 0; border-top: 1px solid #2C2C26; }
      .l-wrap { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
      .l-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #F5C842; margin-bottom: 0.75rem; }
      .l-h1 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(2.5rem, 7vw, 4.2rem); line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 1.5rem; color: #EDE8DC; }
      .l-h2 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(1.8rem, 5vw, 2.8rem); line-height: 1.1; margin-bottom: 1.25rem; color: #EDE8DC; }
      .l-p { color: #EDE8DC; font-weight: 300; line-height: 1.75; max-width: 70ch; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
      .l-rule { height: 1px; background: linear-gradient(90deg,#F5C842,transparent); margin: 1.5rem 0; opacity: 0.55; }
      .l-cta { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; max-width: 380px; background: #F5C842; color: #0E0E0B; font-family: 'DM Sans',sans-serif; font-weight: 700; font-size: 1rem; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; padding: 17px 36px; border-radius: 4px; border: none; cursor: pointer; text-align: center; transition: transform .2s, box-shadow .2s; }
      .l-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,200,66,.25); }
      .l-checklist { list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 1.5rem 0; }
      .l-checklist li { display: flex; align-items: flex-start; gap: 14px; padding: 13px 15px; background: #1C1C18; border: 1px solid #2C2C26; border-radius: 6px; font-size: 0.93rem; font-weight: 300; color: rgba(237,232,220,.85); transition: border-color .2s; }
      .l-checklist li:hover { border-color: rgba(245,200,66,.3); }
      .l-cb { width: 17px; height: 17px; border: 2px solid #3a3a34; border-radius: 3px; flex-shrink: 0; margin-top: 2px; }
      .l-card { background: #1C1C18; border: 1px solid #2C2C26; border-radius: 6px; padding: 1.5rem; position: relative; overflow: hidden; }
      .l-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #F5C842; box-shadow: 0 0 8px #F5C842; }
      .l-day-row { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid #2C2C26; align-items: flex-start; }
      .l-feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 1.25rem; }
      .l-feature { background: #1C1C18; border: 1px solid #2C2C26; border-radius: 6px; padding: 1.25rem; font-size: 0.86rem; color: rgba(237,232,220,.78); font-weight: 300; }
      .l-feature strong { display: block; color: #EDE8DC; font-weight: 600; margin-bottom: 3px; font-size: 0.875rem; }
      .l-split { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 1.25rem; }
      .l-split-col { border: 1px solid #2C2C26; border-radius: 6px; padding: 1.25rem; }
      .l-split-col ul { list-style: none; display: flex; flex-direction: column; gap: 9px; }
      .l-split-col li { font-size: 0.84rem; color: rgba(237,232,220,.72); display: flex; gap: 8px; font-weight: 300; }
      .l-pricing { background: #1C1C18; border: 1px solid #2C2C26; border-radius: 8px; padding: 2rem; text-align: center; margin-top: 2rem; position: relative; overflow: hidden; }
      .l-pricing::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,#FF3B3B,#F5C842,#FF8C00); box-shadow: 0 0 16px #F5C842; }
      .l-offer-list { list-style: none; text-align: left; margin: 1.25rem 0; display: flex; flex-direction: column; gap: 10px; }
      .l-offer-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 0.9rem; font-weight: 300; color: rgba(237,232,220,.85); }
      .l-offer-list li::before { content:'✓'; color:#F5C842; font-weight:700; flex-shrink:0; }
      .l-faq-item { border-bottom: 1px solid #2C2C26; }
      .l-faq-q { width: 100%; text-align: left; background: none; border: none; color: #EDE8DC; font-family: 'DM Sans',sans-serif; font-weight: 500; font-size: 0.95rem; padding: 1.2rem 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
      .l-faq-a { font-size: 0.88rem; color: rgba(237,232,220,.68); font-weight: 300; padding-bottom: 1.2rem; line-height: 1.7; }
      .l-trust { display: flex; gap: 1.25rem; flex-wrap: wrap; margin-top: 1.25rem; }
      .l-trust span { font-size: 0.8rem; color: #EDE8DC; display: flex; align-items: center; gap: 6px; text-shadow: 0 1px 3px rgba(0,0,0,0.8); font-weight: 500; }
      .l-dot { width: 5px; height: 5px; border-radius: 50%; background: #F5C842; box-shadow: 0 0 5px #F5C842; flex-shrink: 0; }
      .l-author { display: flex; gap: 1.25rem; align-items: flex-start; margin-top: 1.5rem; }
      .l-avatar { width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg,#F5C842,#FF8C00); display: flex; align-items: center; justify-content: center; font-family: 'DM Serif Display',serif; font-size: 1.4rem; color: #0E0E0B; }
      .l-bump { margin-top: 1rem; padding: 1rem; background: rgba(245,200,66,.06); border: 1px dashed rgba(245,200,66,.3); border-radius: 6px; font-size: 0.84rem; font-weight: 300; color: rgba(237,232,220,.8); }
      .l-guarantee { border: 1px solid #2C2C26; border-radius: 8px; padding: 2rem; text-align: center; background: rgba(245,200,66,0.03); }
      
      /* Carousel Styles */
      .l-carousel-viewport { 
        position: relative; 
        overflow: hidden; 
        padding: 2rem 0;
        margin: 0 -1.25rem; 
        -webkit-mask-image: linear-gradient(to right, transparent, black 25%, black 75%, transparent);
        mask-image: linear-gradient(to right, transparent, black 25%, black 75%, transparent);
        --card-w: 280px;
        --card-m: 10px;
      }
      .l-carousel-track { 
        display: flex; 
        transition: transform 0.6s cubic-bezier(0.2, 0, 0.2, 1); 
        padding: 0 50%;
        width: max-content;
      }
      .l-carousel-card { 
        flex: 0 0 var(--card-w); 
        padding: 1.5rem; 
        background: #1C1C18; 
        border: 1px solid #2C2C26; 
        border-radius: 12px; 
        margin: 0 var(--card-m); 
        transition: all 0.5s cubic-bezier(0.2, 0, 0.2, 1);
        cursor: pointer;
        opacity: 0.4;
        transform: scale(0.9);
      }
      .l-carousel-card.active { 
        opacity: 1; 
        transform: scale(1); 
        border-color: rgba(245,200,66,0.4); 
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      .l-carousel-nav {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin-top: 2rem;
      }
      .l-carousel-btn {
        background: none;
        border: 1px solid #2C2C26;
        color: #EDE8DC;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      .l-carousel-btn:hover:not(:disabled) {
        border-color: #F5C842;
        color: #F5C842;
      }
      .l-carousel-btn:disabled {
        opacity: 0.2;
        cursor: not-allowed;
      }
      .l-carousel-dots {
        display: flex;
        gap: 8px;
      }
      .l-carousel-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #2C2C26;
        cursor: pointer;
        transition: all 0.3s;
      }
      .l-carousel-dot.active {
        background: #F5C842;
        transform: scale(1.5);
      }
      .l-hero-container { position: relative; overflow: hidden; width: 100%; }
      .l-video-bg { 
        position: absolute; 
        inset: 0;
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
        z-index: 0; 
        display: block;
      }
      .l-hero-content { position: relative; z-index: 2; width: 100%; }
      .l-hero-fade {
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 252px;
        background: linear-gradient(to bottom, transparent, #0E0E0B);
        z-index: 1;
        pointer-events: none;
      }
      .l-header { position: sticky; top: 0; z-index: 100; background: rgba(14, 14, 11, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(44, 44, 38, 0.5); padding: 1rem 0; }
      .l-header-inner { display: flex; justify-content: space-between; align-items: center; }
      .l-header-nav { display: flex; gap: 24px; align-items: center; }
      .l-header-link { color: rgba(237, 232, 220, 0.8); text-decoration: none; font-size: 0.85rem; font-weight: 500; transition: color 0.2s; }
      .l-header-link:hover { color: #F5C842; }
      @media (max-width:960px) {
        .l-feature-grid { grid-template-columns: 1fr 1fr; }
      }
      .l-mobile-menu-btn { display: none; }
      .l-desktop-auth { display: flex; }
      .l-mobile-nav { display: none; }
      @media (max-width:820px) {
        .l-header-nav { display: none; }
        .l-desktop-auth { display: none; }
        .l-mobile-menu-btn { display: flex !important; }
        .l-mobile-nav { display: flex; flex-direction: column; background: #0E0E0B; padding: 1rem 1.25rem; border-top: 1px solid #2C2C26; position: absolute; top: 100%; left: 0; right: 0; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
        .l-mobile-nav a { color: #EDE8DC; text-decoration: none; padding: 16px 0; font-size: 1rem; border-bottom: 1px solid rgba(44,44,38,0.5); font-weight: 400; }
        .l-mobile-nav a:last-of-type { border-bottom: none; }
      }
      @media (max-width:640px) { 
        .l-split, .l-feature-grid { grid-template-columns: 1fr; } 
        .l-h1 { font-size: 2.2rem; }
        .l-carousel-viewport { --card-w: 260px; }
      }
    `;
    document.head.appendChild(style);
    return () => { const s = document.getElementById('landing-styles'); if (s) s.remove(); };
  }, []);

  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => { setShowPrivacy(false); window.scrollTo(0, 0); }} />;
  }

  if (showTerms) {
    return <TermsAndConditions onBack={() => { setShowTerms(false); window.scrollTo(0, 0); }} />;
  }

  return (
    <div style={{ background: '#0E0E0B', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#EDE8DC' }}>

      {/* HEADER */}
      <header className="l-header">
        <div className="l-wrap l-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontFamily: "'DM Serif Display', serif", color: '#EDE8DC', letterSpacing: '0.5px' }}>Deeper Fix</span>
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
              onClick={isEnrolled ? onReturnToCourse : handleStartCheckout}
              style={{
                opacity: showSticky ? 1 : 0,
                pointerEvents: showSticky ? 'auto' : 'none',
                transform: `translateX(${showSticky ? '0' : '10px'})`,
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                background: 'linear-gradient(135deg, #F5C842, #FF8C00)',
                color: '#0E0E0B',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(245,200,66,0.2)'
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
                <button 
                  onClick={() => onStartReset('signin')}
                  style={{
                    background: 'transparent', border: '1px solid rgba(245,200,66,0.3)', color: '#F5C842',
                    padding: '8px 16px', borderRadius: '4px', fontSize: '0.8rem', letterSpacing: '1px',
                    textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  Course Login
                </button>
              ) : (
                <button 
                  onClick={onOpenProfile} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px',
                    color: 'rgba(237,232,220,0.8)', background: 'rgba(28,28,24,0.6)', border: '1px solid rgba(237,232,220,0.1)', cursor: 'pointer',
                    fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 16px', borderRadius: '4px'
                  }}
                >
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
      <section id="symptoms" className="l-section" style={{ borderTop: 'none' }}>
        <div className="l-wrap">
          <p className="l-label">Does this sound familiar?</p>
          <h2 className="l-h2">Signs your attention<br /><em>is being hijacked</em></h2>
          <p className="l-p">Check what sounds familiar:</p>
          <ul className="l-checklist">
            {['You open your phone to do one thing and lose 30 minutes', 'You can\'t read 3 paragraphs without reaching for your phone', 'You start tasks but finish almost none of them', 'Your best ideas stay in your head because focus never arrives', 'You feel guilty scrolling but can\'t seem to stop', 'Deep work used to feel easy. Now it feels impossible.', 'Can\'t watch a 10 minute video without skipping.'].map((t, i) => {
              const active = checkedSymptoms[i];
              return (
                <li
                  key={i}
                  onClick={() => toggleSymptom(i)}
                  style={{
                    cursor: 'pointer',
                    borderColor: active ? 'rgba(255,59,59,0.4)' : '#2C2C26',
                    backgroundColor: active ? 'rgba(255,59,59,0.05)' : '#1C1C18',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div className="l-cb" style={{
                    backgroundColor: active ? '#FF3B3B' : 'transparent',
                    borderColor: active ? '#FF3B3B' : '#3a3a34',
                    boxShadow: active ? '0 0 10px rgba(255,59,59,0.4)' : 'none'
                  }} />
                  <span style={{ color: active ? '#FF3B3B' : 'rgba(237,232,220,.85)', transition: 'color 0.2s' }}>{t}</span>
                </li>
              );
            })}
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
      <section className="l-section">
        <div className="l-wrap">
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
      <section id="programme" className="l-section">
        <div className="l-wrap">
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
      <section id="inside" className="l-section">
        <div className="l-wrap">
          <p className="l-label">Your Focus Toolkit</p>
          <h2 className="l-h2">Everything you get to<br /><em>take back control.</em></h2>

          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '1.25rem', color: '#F5C842', fontFamily: "'DM Serif Display', serif", marginBottom: '0.5rem' }}>41 Interactive Tasks. Not theory — real action.</p>
            <p className="l-p" style={{ opacity: 0.7 }}>Works on any device. No downloads. No app stores. Open and start.</p>
          </div>

          <div className="l-feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="l-feature" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '12px' }}>
                    <strong style={{ margin: 0, fontSize: '0.95rem' }}>{f.title}</strong>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#F5C842',
                      whiteSpace: 'nowrap',
                      padding: '2px 6px',
                      border: '1px solid rgba(245,200,66,0.3)',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      fontFamily: "'Inter', 'DM Sans', sans-serif"
                    }}>
                      {f.value}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'rgba(237,232,220,0.65)', fontWeight: 300 }}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '3.5rem',
            padding: '2.5rem',
            background: 'rgba(245,200,66,0.03)',
            border: '1px solid rgba(245,200,66,0.15)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#6B6860', marginBottom: '8px' }}>Total Bundle Value</div>
            <div style={{ fontSize: '2rem', fontFamily: "'Inter', sans-serif", color: '#FF3B3B', textDecoration: 'line-through', opacity: 0.6, marginBottom: '2rem', fontWeight: 700 }}>₹2,094</div>

            <div style={{ fontSize: '1rem', color: '#F5C842', fontWeight: 600, marginBottom: '0.5rem' }}>You get everything for:</div>
            <div style={{ fontSize: '3.5rem', fontFamily: "'Inter', sans-serif", color: '#F5C842', lineHeight: 1, fontWeight: 700 }}>₹399</div>
            <div style={{ fontSize: '0.9rem', color: '#00E87A', fontWeight: 600, marginTop: '8px', opacity: 0.8, fontFamily: "'Inter', sans-serif" }}>(You Save: ₹1,695)</div>
          </div>
        </div>
      </section>

      {/* FOR / NOT FOR */}
      <section className="l-section">
        <div className="l-wrap">
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
      <section className="l-section" id="pricing">
        <div className="l-wrap">
          <div className="l-pricing" style={{ marginTop: '0' }}>
            {/* Pricing display */}
            <div style={{ fontSize: '1.4rem', color: '#6B6860', textDecoration: 'line-through', marginBottom: '2px', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>₹599</div>

            {couponApplied ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '2rem', color: '#6B6860', textDecoration: 'line-through', fontWeight: 700 }}>₹{ORIGINAL_PRICE}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '3rem', color: '#00E87A', lineHeight: 1, fontWeight: 700 }}>₹{finalPrice}</div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#00E87A', fontWeight: 600, marginTop: '6px', fontFamily: "'Inter', sans-serif" }}>
                  🎉 {couponApplied.discount_percent}% off via <strong>{couponApplied.influencer_name}</strong> — You save ₹{ORIGINAL_PRICE - finalPrice}
                </div>
              </div>
            ) : (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '3rem', color: '#F5C842', marginBottom: '4px', fontWeight: 700 }}>₹{ORIGINAL_PRICE}</div>
            )}

            <div style={{ fontSize: '0.78rem', color: '#6B6860', marginBottom: '1.25rem', marginTop: '4px' }}>Instant access • No subscription • Start today</div>

            {/* Coupon input moved to CheckoutModal */}

            <button className="l-cta" style={{ margin: '0 auto' }} onClick={isEnrolled ? onReturnToCourse : handleStartCheckout}>
              {isEnrolled ? 'Return to Course' : `Yes, I Want My Focus Back`}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', color: 'rgba(237,232,220,0.85)', fontWeight: 400 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E87A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              7-Day Money-Back Guarantee — No questions asked
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
              Finish the reset.<br />
              If your focus doesn't improve — get 100% back.<br />
              No questions. No friction.
            </p>
          </div>
        </div>
        {/* THE CHOICE */}
        <section className="l-section" style={{ background: '#0E0E0B', borderTop: '1px solid #2C2C26' }}>
          <div className="l-wrap" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <p className="l-label" style={{ color: '#F5C842' }}>DECISION TIME</p>
            <h2 id="c0" className="l-h2" style={{ marginBottom: '3rem' }}>The Choice Is Yours</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>

              {/* Option A */}
              <div id="c1" style={{
                background: 'rgba(255, 59, 59, 0.03)',
                border: '1px solid rgba(255, 59, 59, 0.15)',
                padding: '2.5rem',
                borderRadius: '12px',
                textAlign: 'left',
                width: '100%',
                boxSizing: 'border-box'
              }}>
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
              <div id="c2" style={{
                background: 'rgba(0, 232, 122, 0.03)',
                border: '2px solid rgba(0, 232, 122, 0.4)',
                padding: '2.5rem',
                borderRadius: '12px',
                textAlign: 'left',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <h3 style={{ color: '#00E87A', fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: '1.25rem' }}>Option B — Invest in Your Focus</h3>
                <p style={{ color: '#EDE8DC', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                  Invest now and take your attention back permanently—and move your life forward.
                </p>

                <button id="c4" className="l-cta" style={{ margin: '0 auto', background: '#00E87A', boxShadow: '0 8px 16px rgba(0, 232, 122, 0.2)', width: 'fit-content', padding: '16px 48px' }} onClick={isEnrolled ? onReturnToCourse : handleStartCheckout}>
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
        <div className="l-wrap">
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
      <section style={{ padding: '8rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(245,200,66,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="l-wrap" style={{ position: 'relative' }}>
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
      <footer style={{ borderTop: '1px solid #2C2C26', padding: '4rem 1.25rem', textAlign: 'center', background: '#0A0A08' }}>
        <div className="l-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontFamily: "'DM Serif Display', serif", color: '#EDE8DC', letterSpacing: '0.5px' }}>© Deeper Fix</span>
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
      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal 
          onClose={() => setShowCheckoutModal(false)}
          onProceed={handlePayment}
          originalPrice={ORIGINAL_PRICE}
          finalPrice={finalPrice}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          couponApplied={couponApplied}
          setCouponApplied={setCouponApplied}
          couponLoading={couponLoading}
          couponError={couponError}
          applyCoupon={applyCoupon}
        />
      )}

    </div>
  );
}
