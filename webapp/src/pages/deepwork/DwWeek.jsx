import React, { useState } from 'react';
import ClickBox from '../../components/ClickBox';
import FillLine from '../../components/FillLine';
import DayProgressBar from '../../components/DayProgressBar';
import { PAGE_PATTERNS } from '../../components/pagePatterns';
import { isWeekComplete, weekProgress, weekTaskIds } from './content';
import confetti from 'canvas-confetti';

/**
 * One week of the Deep Work System.
 *
 * All four weeks render through here — the differences live in content.js. That
 * keeps the four pages genuinely identical in behaviour rather than four
 * near-copies that drift apart the first time one gets a fix.
 */
export default function DwWeek({ week, data, updateData }) {
  const accent = week.color;
  const [showMissing, setShowMissing] = useState(false);

  const { done, total } = weekProgress(week, data);
  const complete = isWeekComplete(week, data);
  const finishedKey = `dw_${week.key}_finished`;

  const handleFinish = () => {
    if (!complete) {
      setShowMissing(true);
      setTimeout(() => setShowMissing(false), 3000);
      return;
    }
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    updateData(finishedKey, true);
  };

  const taskIds = weekTaskIds(week);

  return (
    <div
      className="page-content"
      style={{ '--accent': accent, ...PAGE_PATTERNS[week.pattern](accent) }}
    >
      <DayProgressBar current={done} total={total} accentColor={accent} />

      <div style={{ marginBottom: '1.5rem' }}>
        <p
          style={{
            fontSize: '0.85rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: accent,
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}
        >
          Week {week.n} of 4
        </p>
        <h2 style={{ margin: 0, color: 'var(--cream)' }}>{week.title}</h2>
        <p style={{ marginTop: '0.75rem', fontSize: '1.05rem', color: 'rgba(237,232,220,0.8)' }}>
          {week.promise}
        </p>
      </div>

      <div className="day-rule" />

      {/* The shift — what changes relative to the reset they already did */}
      <div
        className="card"
        style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
      >
        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.62rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '4px',
            }}
          >
            Until now
          </div>
          <div style={{ color: 'rgba(237,232,220,0.7)', fontSize: '0.95rem' }}>
            {week.shift.from}
          </div>
        </div>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.62rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: accent,
              marginBottom: '4px',
            }}
          >
            This week
          </div>
          <div style={{ color: 'var(--cream)', fontSize: '0.95rem', fontWeight: 500 }}>
            {week.shift.to}
          </div>
        </div>
      </div>

      {/* Why */}
      <div className="card">
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '10px', letterSpacing: '1px' }}>
          WHY THIS WEEK
        </h4>
        {week.why.map((para, i) => (
          <p key={i} style={{ fontSize: '0.95rem', margin: i === 0 ? 0 : '0.75rem 0 0' }}>
            {para}
          </p>
        ))}
      </div>

      {/* The practice */}
      <div className="reveal-timeline">
        <div className="reveal-node">
          <h4
            style={{
              color: accent,
              fontSize: '0.85rem',
              marginBottom: '0.75rem',
              letterSpacing: '1px',
            }}
          >
            {week.practice.heading.toUpperCase()}
          </h4>
          <p style={{ marginBottom: '1.5rem' }}>{week.practice.intro}</p>

          {week.practice.days.map((label, i) => (
            <ClickBox
              key={taskIds[i]}
              id={taskIds[i]}
              label={`Day ${i + 1} — ${label}`}
              checked={data[taskIds[i]] || false}
              onChange={(v) => updateData(taskIds[i], v)}
              accentColor={accent}
            />
          ))}
        </div>

        <div className="reveal-node">
          <h4
            style={{
              color: accent,
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              letterSpacing: '1px',
            }}
          >
            END OF WEEK {week.n}
          </h4>

          {week.reflect.map((field) => (
            <FillLine
              key={field.id}
              id={field.id}
              label={field.label}
              value={data[field.id] || ''}
              onChange={(v) => updateData(field.id, v)}
              placeholder={field.placeholder}
              lines={field.lines}
              accentColor={accent}
            />
          ))}
        </div>
      </div>

      <div className="card" style={{ borderLeft: `3px solid ${accent}` }}>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--cream)' }}>{week.close}</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {data[finishedKey] ? (
          <p style={{ color: accent, fontWeight: 600, margin: 0 }}>
            Week {week.n} complete. Use Next to continue.
          </p>
        ) : (
          <button
            className="primary-btn"
            onClick={handleFinish}
            style={{
              width: 'auto',
              margin: '0 auto',
              backgroundColor: complete ? accent : 'transparent',
              color: complete ? 'var(--bg)' : 'var(--muted)',
              border: complete ? 'none' : '1px solid var(--border)',
            }}
          >
            Finish Week {week.n}
          </button>
        )}

        {showMissing && (
          <p style={{ color: '#FF3B3B', marginTop: '1rem', fontSize: '0.9rem' }}>
            {done} of {total} done — tick every day and fill in the reflections first.
          </p>
        )}
      </div>
    </div>
  );
}
