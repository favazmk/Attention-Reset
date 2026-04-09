import React from 'react';

export default function ClickBox({ id, label, checked, onChange, accentColor = 'var(--accent)', small = false }) {
  return (
    <div 
      className="clickbox-wrapper" 
      data-checked={checked}
      onClick={() => onChange(!checked)}
      style={{ '--accent': accentColor }}
    >
      <div className="checkbox-visual"></div>
      <div className="clickbox-label" style={{ fontSize: small ? '0.9rem' : '1rem' }}>
        {label}
      </div>
    </div>
  );
}
