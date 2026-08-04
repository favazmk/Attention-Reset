import React from 'react';
import useModalA11y from '../hooks/useModalA11y';

export default function CheckoutModal({ onClose, onProceed, previousPrice, price, busy }) {
  const dialogRef = useModalA11y(onClose);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(14, 14, 11, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        tabIndex={-1}
        style={{
          background: '#1C1C18',
          border: '1px solid #2C2C26',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '440px',
          padding: '28px',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          outline: 'none',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close checkout"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2
          id="checkout-title"
          style={{
            fontSize: '1.4rem',
            fontFamily: "'DM Serif Display', serif",
            color: '#EDE8DC',
            margin: '0 0 8px 0',
          }}
        >
          Order Summary
        </h2>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#6B6860',
            margin: '0 0 24px 0',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          7-Day Attention Reset
        </p>

        {/* Price Breakdown */}
        <div
          style={{
            background: '#0E0E0B',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid #2C2C26',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '0.95rem',
            }}
          >
            <span style={{ color: '#EDE8DC' }}>7-Day Attention Reset</span>
            <span style={{ color: '#6B6860', textDecoration: 'line-through' }}>₹{previousPrice}</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '0.95rem',
              color: '#00E87A',
            }}
          >
            <span>Launch discount</span>
            <span>-₹{previousPrice - price}</span>
          </div>

          <div style={{ borderTop: '1px solid #2C2C26', margin: '12px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#EDE8DC', fontWeight: 600, fontSize: '1.1rem' }}>Total</span>
            <span
              style={{
                color: '#F5C842',
                fontWeight: 700,
                fontSize: '1.5rem',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              ₹{price}
            </span>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={() => onProceed()}
          disabled={busy}
          style={{
            width: '100%',
            padding: '16px',
            background: busy ? '#2C2C26' : '#F5C842',
            color: busy ? '#6B6860' : '#0E0E0B',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: busy ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'transform 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={(e) => {
            if (!busy) e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {busy ? 'Opening payment…' : 'Proceed to Payment'}
          {!busy && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          )}
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: '#6B6860' }}>
          Secured by <strong>Razorpay</strong>
        </div>
      </div>
    </div>
  );
}
