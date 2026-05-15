import React from 'react';

export default function CheckoutModal({
  onClose,
  onProceed,
  originalPrice,
  finalPrice,
  couponCode,
  setCouponCode,
  couponApplied,
  setCouponApplied,
  couponLoading,
  couponError,
  applyCoupon
}) {
  const [showInput, setShowInput] = React.useState(false);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(14, 14, 11, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#1C1C18',
        border: '1px solid #2C2C26',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', color: '#888',
            cursor: 'pointer', padding: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 style={{ fontSize: '1.4rem', fontFamily: "'DM Serif Display', serif", color: '#EDE8DC', margin: '0 0 8px 0' }}>Order Summary</h2>
        <p style={{ fontSize: '0.9rem', color: '#6B6860', margin: '0 0 24px 0', fontFamily: "'DM Sans', sans-serif" }}>7-Day Attention Reset</p>

        {/* Price Breakdown */}
        <div style={{ background: '#0E0E0B', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #2C2C26' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: '#EDE8DC' }}>Original Price</span>
            <span style={{ color: '#EDE8DC', textDecoration: couponApplied ? 'line-through' : 'none', opacity: couponApplied ? 0.5 : 1 }}>₹{originalPrice}</span>
          </div>

          {couponApplied && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: '#00E87A' }}>
              <span>Discount ({couponApplied.discount_percent}%)</span>
              <span>-₹{originalPrice - finalPrice}</span>
            </div>
          )}

          <div style={{ borderTop: '1px solid #2C2C26', margin: '12px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#EDE8DC', fontWeight: 600, fontSize: '1.1rem' }}>Total</span>
            <span style={{ color: couponApplied ? '#00E87A' : '#F5C842', fontWeight: 700, fontSize: '1.5rem', fontFamily: "'Inter', sans-serif" }}>₹{finalPrice}</span>
          </div>
        </div>

        {/* Coupon Section */}
        <div style={{ marginBottom: '28px' }}>
          {!couponApplied ? (
            !showInput ? (
              <button
                onClick={() => setShowInput(true)}
                style={{
                  background: 'none', border: 'none', color: '#F5C842',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  padding: 0, textDecoration: 'underline', textUnderlineOffset: '4px'
                }}
              >
                Have a coupon code?
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: '8px',
                    border: '1px solid #2C2C26', background: '#0E0E0B',
                    color: '#EDE8DC', fontSize: '0.9rem', outline: 'none',
                    fontFamily: 'monospace', letterSpacing: '1px'
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  style={{
                    padding: '0 20px', background: couponCode.trim() ? '#F5C842' : '#2C2C26',
                    color: couponCode.trim() ? '#0E0E0B' : '#6B6860',
                    border: 'none', borderRadius: '8px', fontWeight: 600, cursor: couponCode.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: 'rgba(0,232,122,0.1)',
              border: '1px solid rgba(0,232,122,0.3)', borderRadius: '8px'
            }}>
              <span style={{ color: '#00E87A', fontSize: '0.85rem', fontWeight: 600 }}>
                ✓ Code {couponApplied.code} applied
              </span>
              <button
                onClick={() => {
                  setCouponApplied(null);
                  setCouponCode('');
                }}
                style={{
                  background: 'none', border: 'none', color: '#FF3B3B',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0
                }}
              >
                Remove
              </button>
            </div>
          )}
          {couponError && <div style={{ color: '#FF3B3B', fontSize: '0.8rem', marginTop: '8px' }}>{couponError}</div>}
        </div>

        {/* Proceed Button */}
        <button
          onClick={onProceed}
          style={{
            width: '100%', padding: '16px',
            background: '#F5C842', color: '#0E0E0B',
            border: 'none', borderRadius: '8px',
            fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Proceed to Payment
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: '#6B6860' }}>
          Secured by <strong>Razorpay</strong>
        </div>

      </div>
    </div>
  );
}
