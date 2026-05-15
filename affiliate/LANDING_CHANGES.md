# Landing.jsx — 4 changes to make the coupon system work

## CHANGE 1 — Add new state variables
## Find this line (around line 85):
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

## ADD THESE LINES RIGHT AFTER IT:

  // ── Coupon state ────────────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = React.useState('');
  const [couponApplied, setCouponApplied] = React.useState(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [couponError, setCouponError] = React.useState('');
  const [showCouponInput, setShowCouponInput] = React.useState(false);

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


## CHANGE 2 — Replace handlePayment function
## Find this block (around line 111):
  const handlePayment = async () => {

## REPLACE THE ENTIRE handlePayment FUNCTION WITH THIS:

  const handlePayment = async () => {
    if (!isLoggedIn) {
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


## CHANGE 3 — Replace the pricing section in JSX
## In the PRICING section (around line 782), find:
            <div style={{ fontSize: '1.4rem', color: '#6B6860', textDecoration: 'line-through', marginBottom: '2px', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>₹599</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '3rem', color: '#F5C842', marginBottom: '4px', fontWeight: 700 }}>₹399</div>
            <div style={{ fontSize: '0.78rem', color: '#6B6860', marginBottom: '1.5rem' }}>Instant access • No subscription • Start today</div>
            <button className="l-cta" style={{ margin: '0 auto' }} onClick={isEnrolled ? onReturnToCourse : handlePayment}>
              {isEnrolled ? 'Return to Course' : 'Yes, I Want My Focus Back'}
              ...
            </button>

## REPLACE WITH:

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

            {/* Coupon input */}
            {!isEnrolled && (
              <div style={{ marginBottom: '1.25rem' }}>
                {!couponApplied ? (
                  !showCouponInput ? (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      style={{ background: 'none', border: 'none', color: 'rgba(237,232,220,0.5)', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Have a coupon code?
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                        placeholder="ENTER CODE"
                        style={{
                          background: '#0E0E0B',
                          border: couponError ? '1px solid #FF3B3B' : '1px solid #2C2C26',
                          color: '#EDE8DC',
                          padding: '10px 14px',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          fontFamily: 'monospace',
                          letterSpacing: '2px',
                          width: '160px',
                          outline: 'none',
                        }}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        style={{
                          background: '#F5C842',
                          color: '#0E0E0B',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '10px 18px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          letterSpacing: '1px',
                          fontFamily: "'DM Sans', sans-serif",
                          opacity: couponLoading || !couponCode.trim() ? 0.6 : 1,
                        }}
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                  )
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#00E87A' }}>✓ Code <strong>{couponApplied.code}</strong> applied</span>
                    <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#6B6860', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif" }}>Remove</button>
                  </div>
                )}
                {couponError && <div style={{ color: '#FF3B3B', fontSize: '0.8rem', marginTop: '6px' }}>{couponError}</div>}
              </div>
            )}

            <button className="l-cta" style={{ margin: '0 auto' }} onClick={isEnrolled ? onReturnToCourse : handlePayment}>
              {isEnrolled ? 'Return to Course' : `Yes, I Want My Focus Back`}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>


## CHANGE 4 — App.jsx: add admin panel route
## In App.jsx, find the import block at the top and ADD:
  import AffiliateAdmin from './pages/AffiliateAdmin';

## Find the state declarations block and ADD:
  const [showAdmin, setShowAdmin] = useState(false);

## In useEffect (or anywhere near the top of the component), ADD:
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setShowAdmin(true);
    }
  }, []);

## In the JSX return, BEFORE the existing return content, ADD this at the very top of the return:
  if (showAdmin) {
    return <AffiliateAdmin user={user} onBack={() => { setShowAdmin(false); window.location.hash = ''; }} />;
  }
