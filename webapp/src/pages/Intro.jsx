import React from 'react';

export default function Intro({ data, updateData }) {
  const accent = 'var(--day0)';

  return (
    <div className="page-content" style={{ '--accent': accent }}>
      <div className="spacer-sm" />

      <p style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: '0.75rem' }}>
        Before you start
      </p>

      <h2 style={{ marginBottom: '1.5rem', color: 'var(--cream)' }}>
        Start with one<br /><em>small win.</em>
      </h2>

      <div className="day-rule" />

      <p style={{ fontSize: '1.05rem', marginBottom: '1rem', lineHeight: '1.75' }}>
        Your attention is the most valuable asset you own.
        Every app, notification, and endless scroll is competing for it — all day, every day.
      </p>

      <p style={{ fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: '1.75', color: 'var(--cream)', fontWeight: 500 }}>
        This 7-day reset helps you take it back.<br />
        One day. One win. At a time.
      </p>

      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ color: accent, marginBottom: '1.25rem' }}>How to use this</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { bold: 'One day at a time.', rest: ' Work chronologically. Don\'t skip ahead.' },
            { bold: 'No distractions.', rest: ' Turn on Do Not Disturb, or close your other tabs.' },
            { bold: 'Write it down.', rest: ' Fill every blank — writing rewires your brain faster than reading.' },
            { bold: 'Celebrate.', rest: ' Finished a day? Celebrate. Then show up tomorrow.' },
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: accent, fontSize: '0.8rem', marginTop: '3px', flexShrink: 0 }}>—</span>
              <span style={{ fontSize: '0.95rem', color: 'rgba(237,232,220,0.75)', fontWeight: 300 }}>
                <strong>{item.bold}</strong>{item.rest}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <h3 style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>Your 7-Day Journey</h3>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[
          { d: 1, title: 'The Digital Kill-Switch', desc: 'Stop the pings. Start the progress.', hex: 'var(--day1)' },
          { d: 2, title: 'The Snap Audit',          desc: 'Find your attention leaks in 5 minutes.', hex: 'var(--day2)' },
          { d: 3, title: 'The Monk Sprint',         desc: 'One task. Zero noise. 100% impact.', hex: 'var(--day3)' },
          { d: 4, title: 'The Focus Sprints',       desc: 'Level up your mental endurance.', hex: 'var(--day4)' },
          { d: 5, title: 'The Fortress',            desc: 'Design a space where focus is the only option.', hex: 'var(--day5)' },
          { d: 6, title: 'The Dopamine Reset',      desc: 'Recover your edge through strategic boredom.', hex: 'var(--day6)' },
          { d: 7, title: 'The Attention OS',        desc: 'Build a system that works so you don\'t have to.', hex: 'var(--day7)' },
        ].map((day) => (
          <div key={day.d} style={{ display: 'flex', padding: '14px 0', borderBottom: '1px solid var(--border)', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', flexShrink: 0 }}>
              <div style={{ width: '28px', height: '2px', background: day.hex, marginBottom: '4px' }} />
              <span style={{ fontWeight: 700, fontSize: '0.7rem', color: day.hex, letterSpacing: '1.5px' }}>
                {day.d.toString().padStart(2, '0')}
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--cream)', marginBottom: '2px', fontFamily: 'var(--font-display)' }}>{day.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300 }}>{day.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="spacer-lg" />
      <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: '1.25rem', marginTop: '1rem' }}>
        <p style={{ fontSize: '1.05rem', color: 'var(--cream)', fontWeight: 500, lineHeight: 1.6 }}>
          In 7 days, you'll feel more focused, more in control, and less distracted.
        </p>
      </div>
    </div>
  );
}
