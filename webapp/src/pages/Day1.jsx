import React, { useState, useEffect } from 'react';
import ClickBox from '../components/ClickBox';
import FillLine from '../components/FillLine';
import Mascot, { PAGE_PATTERNS } from '../components/Mascot';
import confetti from 'canvas-confetti';

export default function Day1({ data, updateData }) {
  const accent = 'var(--day1)';
  const [triggered, setTriggered] = useState(false);

  // Track progress locally
  const tasks = [
    data.d1_c1, data.d1_c2, data.d1_c3,
    data.d1_urge_MORNING, data.d1_urge_AFTERNOON, data.d1_urge_EVENING,
    data.d1_reflection
  ];
  const completedTasks = tasks.filter(Boolean).length;
  const totalTasks = 7;

  useEffect(() => {
    if (completedTasks === totalTasks && !triggered) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTriggered(true);
    }
  }, [completedTasks, triggered]);
  
  return (
    <div className="page-content" style={{ '--accent': accent, ...PAGE_PATTERNS.day1(accent) }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: '0.5rem' }}>Day 01</p>
        <h2 style={{ margin: 0, color: 'var(--cream)' }}>The Digital<br /><em>Kill-Switch</em></h2>
      </div>

      <div className="day-rule" />
      <p style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
        Stop the pings. Start the progress.
      </p>

      <Mascot day="day1" />

      <div className="card">
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>THE SCIENCE</h4>
        <p style={{ fontSize: '0.95rem' }}>
          Every notification triggers a <strong>cortisol spike</strong> — the same stress hormone your ancestors got from predators. Over time your brain starts to <strong>expect interruption</strong>, making sustained focus feel physically uncomfortable.
        </p>
      </div>

      <div className="spacer-lg" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '2rem' }} />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE 3-MINUTE STEALTH SETUP
      </h4>
      <p style={{ marginBottom: '1.5rem' }}>Open your phone settings. Do these 3 things right now:</p>

      <ClickBox 
        id="d1_c1"
        label="Silence the Ghosts: Settings > Notifications. Turn OFF everything except Calls and Texts."
        checked={data.d1_c1 || false}
        onChange={(v) => updateData('d1_c1', v)}
        accentColor={accent}
      />
      <ClickBox 
        id="d1_c2"
        label="Go Greyscale: Accessibility > Display > Colour Filters. Enable greyscale. Removes ~40% of addictiveness."
        checked={data.d1_c2 || false}
        onChange={(v) => updateData('d1_c2', v)}
        accentColor={accent}
      />
      <ClickBox 
        id="d1_c3"
        label="Delete your #1 time-waster app today. You can reinstall it tomorrow if you really want to."
        checked={data.d1_c3 || false}
        onChange={(v) => updateData('d1_c3', v)}
        accentColor={accent}
      />

      <div className="spacer-lg" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '2rem' }} />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE GHOST-TOUCH CHALLENGE
      </h4>
      <p style={{ marginBottom: '1rem' }}>
        Every time you reach for your phone and there's nothing to see, mark a tally below. Count your urges before bed.
      </p>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
        {['MORNING', 'AFTERNOON', 'EVENING'].map((time) => (
          <div key={time} style={{ flex: 1, backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1rem', textAlign: 'center' }}>
            <h4 style={{ color: accent, marginBottom: '1rem' }}>{time}</h4>
            <input
              type="number"
              value={data[`d1_urge_${time}`] || ''}
              onChange={(e) => {
                const val = Math.min(50, Math.max(0, parseInt(e.target.value) || 0));
                updateData(`d1_urge_${time}`, val === 0 ? '' : val);
              }}
              onKeyDown={(e) => { if (['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}
              min="0" max="50"
              placeholder="0"
              style={{
                width: '56px', height: '44px', textAlign: 'center', fontSize: '1.4rem', fontFamily: 'var(--font-display)',
                backgroundColor: 'var(--bg)', color: 'var(--cream)', border: `1px solid var(--border)`,
                borderRadius: '3px', outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = accent}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>urges</p>
          </div>
        ))}
      </div>

      <div className="spacer-lg" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '2rem' }} />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        REFLECTION
      </h4>
      <p style={{ marginBottom: '1.5rem' }}>
        Without the red dots yelling at you today, what was the one thing you actually <i>noticed</i> in the real world?
      </p>

      <FillLine 
        id="d1_reflection"
        label=""
        value={data.d1_reflection || ''}
        onChange={(v) => updateData('d1_reflection', v)}
        lines={3}
        accentColor={accent}
        placeholder="e.g., I noticed the hum of the refrigerator for the first time."
      />

      <div className="spacer-lg" />

      <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.25rem', margin: '2rem 0' }}>
        <p style={{ fontStyle: 'italic', color: accent, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
          "Almost everything will work again if you unplug it for a few minutes. Including you."
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '1px' }}>— Anne Lamott</p>
      </div>

    </div>
  );
}
