import React, { useEffect } from 'react';

export default function ConfirmModal({ onClose, onConfirm, title, message, confirmText = "Confirm" }) {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(14, 14, 11, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999, // Ensure it's above ProfileModal if layered
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: '#1C1C18',
        border: '1px solid #2C2C26',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '420px',
        padding: '32px 24px',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        animation: 'slideIn 0.3s cubic-bezier(0.2, 0, 0.2, 1)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', color: '#6B6860',
            cursor: 'pointer', padding: '4px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#EDE8DC'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6B6860'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Warning Icon */}
        <div style={{ 
          width: '48px', height: '48px', 
          borderRadius: '50%', 
          background: 'rgba(255, 59, 59, 0.1)', 
          border: '1px solid rgba(255, 59, 59, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FF3B3B',
          marginBottom: '20px',
          boxShadow: '0 0 16px rgba(255, 59, 59, 0.2)'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>

        <h2 style={{ 
          fontSize: '1.4rem', 
          fontFamily: 'var(--font-display)', 
          color: '#EDE8DC', 
          margin: '0 0 12px 0',
          letterSpacing: '-0.01em'
        }}>
          {title}
        </h2>
        
        <p style={{ 
          fontSize: '0.95rem', 
          color: 'rgba(237,232,220,0.8)', 
          lineHeight: '1.6',
          margin: '0 0 32px 0',
          fontWeight: '300'
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button 
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px', background: 'transparent',
              border: '1px solid #2C2C26', color: '#EDE8DC', borderRadius: '6px',
              cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-body)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = '#6B6860';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#2C2C26';
            }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '14px', background: '#FF3B3B',
              border: 'none', color: '#0E0E0B', borderRadius: '6px',
              cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
              letterSpacing: '0.5px', textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(255, 59, 59, 0.3)',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-body)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 59, 59, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 59, 59, 0.3)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
