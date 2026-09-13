import React from 'react';
import { PAGE_PATTERNS } from '../../components/pagePatterns';
import { weekTaskIds } from './content';
import { TOTAL_DAYS, TOTAL_WEEKS } from './outline.js';

/**
 * The end of the programme, and its actual deliverable.
 *
 * Everything the user wrote across four weeks is assembled here into one
 * document — their window, their ceiling, the rules they kept, their review
 * ritual and their relapse protocol. Nothing on this page is generated; it is
 * their own answers played back as a single system they can keep.
 */
export default function DwCompletion({ data, weeks = [] }) {
  const accent = '#F5C842';

  const daysDone = weeks.reduce(
    (total, w) => total + weekTaskIds(w).filter((id) => data[id]).length,
    0
  );
  const weeksDone = weeks.filter((w) => data[`dw_${w.key}_finished`]).length;

  const system = [
    { k: 'The window I protect', v: data.dw_window, from: 'Set at the start' },
    { k: 'What it is for', v: data.dw_target, from: 'Set at the start' },
    { k: 'My longest clean block', v: data.dw_w1_ceiling, from: 'Week 1' },
    { k: 'My non-negotiable deep window', v: data.dw_w2_window, from: 'Week 2' },
    { k: 'Intake rules I kept', v: data.dw_w3_keep, from: 'Week 3' },
    { k: 'My weekly review', v: data.dw_w4_review, from: 'Week 4' },
    { k: 'My relapse protocol', v: data.dw_w4_relapse, from: 'Week 4' },
    { k: 'Defaults that run without me', v: data.dw_w4_defaults, from: 'Week 4' },
  ];

  const written = system.filter((row) => row.v?.trim());

  return (
    <div className="page-content" style={{ '--accent': accent, ...PAGE_PATTERNS.day7(accent) }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
          Programme complete
        </p>
        <h2 style={{ margin: 0, color: 'var(--cream)' }}>
          Your Deep Work
          <br />
          <em>System</em>
        </h2>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2.5rem',
          margin: '2.5rem 0',
          flexWrap: 'wrap',
        }}
      >
        {[
          { n: weeksDone, of: TOTAL_WEEKS, label: 'Weeks finished' },
          { n: daysDone, of: TOTAL_DAYS, label: 'Daily practices' },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '3rem',
                fontWeight: 800,
                color: 'var(--cream)',
                lineHeight: 1,
              }}
            >
              {s.n}
              <span style={{ color: 'var(--muted)', fontSize: '1.5rem' }}>/{s.of}</span>
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: accent,
                marginTop: '8px',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="day-rule" />

      {written.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0 }}>
            Your system gets assembled here from what you write during the four weeks.
            Go back and fill in the end-of-week reflections — they are the part you keep.
          </p>
        </div>
      ) : (
        <>
          <p style={{ margin: '1.5rem 0 2rem', color: 'rgba(237,232,220,0.75)' }}>
            This is what you wrote over four weeks, in one place. Screenshot it, or keep
            this page bookmarked — it is the thing that has to survive the week you stop
            paying attention to any of it.
          </p>

          <div
            style={{
              background: 'var(--card)',
              border: `1px solid ${accent}33`,
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {written.map((row, i) => (
              <div
                key={row.k}
                style={{
                  padding: '1.25rem 1.5rem',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '12px',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.65rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: accent,
                      fontWeight: 600,
                    }}
                  >
                    {row.k}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      flexShrink: 0,
                    }}
                  >
                    {row.from}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--cream)',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {row.v}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: '2.5rem', borderLeft: `3px solid ${accent}` }}>
        <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--cream)' }}>
          You did not get more disciplined. You built something that does not need you to
          be.
        </p>
      </div>
    </div>
  );
}
