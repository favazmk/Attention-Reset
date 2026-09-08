import React from 'react';
import ClickBox from '../../components/ClickBox';
import FillLine from '../../components/FillLine';
import { PAGE_PATTERNS } from '../../components/pagePatterns';
import { WEEKS } from './content';

export default function DwIntro({ data, updateData, introError }) {
  const accent = '#F5C842';

  return (
    <div className="page-content" style={{ '--accent': accent, ...PAGE_PATTERNS.day7(accent) }}>
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
          4 Weeks · 28 Days
        </p>
        <h2 style={{ margin: 0, color: 'var(--cream)' }}>
          The Deep Work
          <br />
          <em>System</em>
        </h2>
      </div>

      <div className="day-rule" />

      <div className="card">
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '10px', letterSpacing: '1px' }}>
          WHERE THIS PICKS UP
        </h4>
        <p style={{ fontSize: '0.95rem', margin: 0 }}>
          The 7-day reset took the interference out. It stopped things taking your
          attention without asking.
        </p>
        <p style={{ fontSize: '0.95rem', margin: '0.75rem 0 0' }}>
          That is not the same as being able to do hard work for a long time. Clearing
          the noise removes what was stopping you — it does not build the capacity
          itself. That is what the next four weeks are for.
        </p>
      </div>

      <div className="reveal-timeline">
        <div className="reveal-node">
          <h4
            style={{
              color: accent,
              fontSize: '0.85rem',
              marginBottom: '1rem',
              letterSpacing: '1px',
            }}
          >
            THE FOUR WEEKS
          </h4>

          {WEEKS.map((w) => (
            <div
              key={w.key}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '14px 0',
                borderBottom: '1px solid var(--border)',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  color: w.color,
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '1.5px',
                  minWidth: '58px',
                  flexShrink: 0,
                }}
              >
                WEEK {w.n}
              </span>
              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    color: 'var(--cream)',
                    fontSize: '1.05rem',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {w.title}
                </span>
                <span
                  style={{
                    display: 'block',
                    color: 'rgba(237,232,220,0.6)',
                    fontSize: '0.88rem',
                    marginTop: '2px',
                    fontWeight: 300,
                  }}
                >
                  {w.promise}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="reveal-node">
          <h4
            style={{
              color: accent,
              fontSize: '0.85rem',
              marginBottom: '1rem',
              letterSpacing: '1px',
            }}
          >
            BEFORE YOU START
          </h4>
          <p style={{ marginBottom: '1.5rem' }}>
            One decision now, so week one has somewhere to go. Pick the window you will
            defend — the same slot, most days. It does not need to be long yet.
          </p>

          <FillLine
            id="dw_window"
            label="The window I will protect"
            value={data.dw_window || ''}
            onChange={(v) => updateData('dw_window', v)}
            placeholder="e.g., weekday mornings, 7:00–8:30, before anyone else is up"
            lines={2}
            accentColor={accent}
          />

          <FillLine
            id="dw_target"
            label="The one piece of work this is for"
            value={data.dw_target || ''}
            onChange={(v) => updateData('dw_target', v)}
            placeholder="e.g., finish the thesis chapter · ship the side project"
            lines={2}
            accentColor={accent}
          />

          <div style={{ marginTop: '1.5rem' }}>
            <ClickBox
              id="dw_commitment"
              label="I am starting this week, not next month."
              checked={data.dw_commitment || false}
              onChange={(v) => updateData('dw_commitment', v)}
              accentColor={accent}
              noStrike
              error={introError}
            />
          </div>

          {introError && (
            <p style={{ color: '#FF3B3B', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Name your window and commit before starting week one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
