import React from 'react';

export default function ClickBox({
  id,
  label,
  checked,
  onChange,
  accentColor = 'var(--accent)',
  small = false,
  noStrike = false,
  error = false,
}) {
  // A real checkbox role rather than a clickable div: ticking boxes is the primary
  // interaction in the whole programme, so it has to work from the keyboard and
  // announce its state to a screen reader.
  const toggle = () => onChange(!checked);

  return (
    <div
      id={id}
      role="checkbox"
      aria-checked={!!checked}
      aria-invalid={error || undefined}
      tabIndex={0}
      className={`clickbox-wrapper ${noStrike ? 'no-strike' : ''} ${error ? 'error-highlight' : ''}`}
      data-checked={checked}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      }}
      style={{ '--accent': accentColor }}
    >
      <div
        className="checkbox-visual"
        aria-hidden="true"
        style={
          error
            ? {
                borderColor: '#ff4444',
                boxShadow: '0 0 12px rgba(255,68,68,0.4)',
                background: 'rgba(255,68,68,0.1)',
              }
            : {}
        }
      ></div>
      <div
        className="clickbox-label"
        style={{
          fontSize: small ? '0.9rem' : '1rem',
          color: error ? '#ff4444' : undefined,
          transition: 'color 0.3s',
        }}
      >
        {label}
      </div>
    </div>
  );
}
