import React from 'react';

export default function ClickBox({ id, label, checked, onChange, accentColor = 'var(--accent)', small = false, noStrike = false, error = false }) {
  return (
    <div 
      className={`clickbox-wrapper ${noStrike ? 'no-strike' : ''} ${error ? 'error-highlight' : ''}`}
      data-checked={checked}
      onClick={() => onChange(!checked)}
      style={{ '--accent': accentColor }}
    >
      <div className="checkbox-visual" style={error ? {borderColor: '#ff4444', boxShadow: '0 0 12px rgba(255,68,68,0.4)', background: 'rgba(255,68,68,0.1)'} : {}}></div>
      <div className="clickbox-label" style={{ fontSize: small ? '0.9rem' : '1rem', color: error ? '#ff4444' : undefined, transition: 'color 0.3s' }}>
        {label}
      </div>
    </div>
  );
}
