import React from 'react';

export default function ProfileModal({ user, onClose, onSignOut, clearProgress }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(14, 14, 11, 0.8)',
      backdropFilter: 'blur(4px)',
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
        maxWidth: '400px',
        padding: '24px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', color: '#888',
            cursor: 'pointer', padding: '4px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: '#EDE8DC', margin: '0 0 24px 0' }}>Profile Settings</h2>

        {/* Account Info */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', marginBottom: '8px' }}>Email Address</label>
          <div style={{ padding: '12px', background: '#0E0E0B', borderRadius: '8px', border: '1px solid #2C2C26', color: '#EDE8DC', fontSize: '0.9rem' }}>
            {user?.email}
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ borderTop: '1px solid #2C2C26', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={clearProgress}
            style={{
              width: '100%', padding: '12px', background: 'transparent',
              border: '1px solid rgba(255, 59, 59, 0.3)', color: '#FF3B3B', borderRadius: '8px',
              cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s'
            }}
          >
            Reset All Progress
          </button>
          <button 
            onClick={onSignOut}
            style={{
              width: '100%', padding: '12px', background: '#2C2C26',
              border: 'none', color: '#EDE8DC', borderRadius: '8px',
              cursor: 'pointer', fontWeight: '500'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
