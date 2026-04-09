import React from 'react';

export default function FillLine({ id, label, value, onChange, placeholder = "Type here...", lines = 1, accentColor = 'var(--accent)' }) {
  const isTextArea = lines > 1;

  return (
    <div className="fill-line-container" style={{ '--accent': accentColor }}>
      {label && <label htmlFor={id} className="fill-line-label">{label}</label>}
      {isTextArea ? (
        <textarea
          id={id}
          className="fill-line-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={lines}
        />
      ) : (
        <input
          id={id}
          type="text"
          className="fill-line-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
