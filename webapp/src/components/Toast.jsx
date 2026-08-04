import React, { useEffect } from 'react';

const TONES = {
  info: { bg: 'rgba(245, 200, 66, 0.12)', border: 'rgba(245, 200, 66, 0.35)', fg: '#F5C842' },
  error: { bg: 'rgba(255, 59, 59, 0.12)', border: 'rgba(255, 59, 59, 0.35)', fg: '#FF6B6B' },
  success: { bg: 'rgba(0, 232, 122, 0.12)', border: 'rgba(0, 232, 122, 0.35)', fg: '#00E87A' },
};

export default function Toast({ message, tone = 'info', onDismiss, duration = 6000 }) {
  useEffect(() => {
    if (!message || !duration) return undefined;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  const c = TONES[tone] || TONES.info;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'min(440px, calc(100vw - 32px))',
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.fg,
        padding: '13px 20px',
        borderRadius: '10px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        fontSize: '0.88rem',
        fontWeight: 500,
        lineHeight: 1.5,
        zIndex: 100000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          opacity: 0.7,
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
          fontSize: '1.1rem',
        }}
      >
        ×
      </button>
    </div>
  );
}
