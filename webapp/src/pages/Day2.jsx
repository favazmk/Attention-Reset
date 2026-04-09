import React, { useState, useEffect } from 'react';
import ClickBox from '../components/ClickBox';
import FillLine from '../components/FillLine';
import Mascot, { PAGE_PATTERNS } from '../components/Mascot';
import confetti from 'canvas-confetti';

export default function Day2({ data, updateData }) {
  const accent = 'var(--day2)';
  const [triggered, setTriggered] = useState(false);

  const assassins = [
    { id: 'd2_a1', text: 'Instagram / TikTok / Reels scrolling' },
    { id: 'd2_a2', text: 'Email refresh (the infinite F5)' },
    { id: 'd2_a3', text: 'The "quick" news / weather check that turns into 30 minutes' },
    { id: 'd2_a4', text: 'Desktop notification pings' },
    { id: 'd2_a5', text: 'The "I\'ll just look this up" Google rabbit hole' },
    { id: 'd2_a6', text: 'YouTube autoplay' },
    { id: 'd2_a7', text: 'WhatsApp group chats' },
    { id: 'd2_a8', text: 'People interrupting while you work' }
  ];

  const completedChecks = assassins.filter(a => data[a.id]).length;

  useEffect(() => {
    if (completedChecks === 8 && !triggered) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTriggered(true);
    }
  }, [completedChecks, triggered]);

  
  return (
    <div className="page-content" style={{ '--accent': accent, ...PAGE_PATTERNS.day2(accent) }}>
      <div className="spacer-sm" />
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: '0.5rem' }}>Day 02</p>
        <h2 style={{ margin: 0, color: 'var(--cream)' }}>The Snap<br /><em>Audit</em></h2>
      </div>
      <div className="day-rule" />
      <p style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
        Find your leaks in 5 minutes.
      </p>

      <Mascot day="day2" />

      <div className="card">
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>THE STAT THAT CHANGES EVERYTHING</h4>
        <p style={{ fontSize: '0.95rem' }}>
          <span style={{ color: accent, fontWeight: 'bold' }}>Every interruption costs 23 minutes of focus recovery.</span> Most people interrupt themselves every 3 minutes — meaning they never actually reach deep focus at all.
        </p>
      </div>

      <div className="spacer-lg" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border-c)', marginBottom: '2rem' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ color: accent, fontSize: '0.85rem', letterSpacing: '1px', margin: 0 }}>YOUR ATTENTION ASSASSINS</h4>
        <span style={{ fontSize: '0.75rem', color: 'var(--light-text)' }}>{completedChecks} / 8 Found</span>
      </div>
      
      <p style={{ marginBottom: '1.5rem' }}>Check everything that stole your time in the last 48 hours:</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
        {assassins.map((item) => (
          <ClickBox 
            key={item.id}
            id={item.id}
            label={item.text}
            checked={data[item.id] || false}
            onChange={(v) => updateData(item.id, v)}
            accentColor={accent}
            small={true}
          />
        ))}
      </div>

      <div className="spacer-lg" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border-c)', marginBottom: '2rem' }} />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE 60-SECOND POWER MOVE
      </h4>
      <div className="card" style={{ backgroundColor: '#1A1800' }}>
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>THE INSTANT WIN</h4>
        <p style={{ fontSize: '0.95rem' }}>
          Flip your phone face down and move it to the other side of the room. <strong style={{color: 'var(--cream)'}}>Done? You just improved your focus by ~20%.</strong> Research shows even a phone face-down on your desk consumes working memory — just by existing in your peripheral vision.
        </p>
      </div>

      <div className="spacer-lg" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border-c)', marginBottom: '2rem' }} />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        REFLECTION
      </h4>
      <p style={{ marginBottom: '1.5rem', fontStyle: 'italic', color: 'var(--cream)' }}>
        "If I reclaimed the 2 hours I lose to these assassins..."
      </p>

      <div style={{ padding: '16px', background: 'var(--mid-gray)', borderRadius: '8px' }}>
        <FillLine 
          id="d2_ref_1"
          label="I lose 2 hours to:"
          value={data.d2_ref_1 || ''}
          onChange={(v) => updateData('d2_ref_1', v)}
          accentColor={accent}
          placeholder="e.g., Doomscrolling Twitter"
        />
        
        <FillLine 
          id="d2_ref_2"
          label="I would finally have time to:"
          value={data.d2_ref_2 || ''}
          onChange={(v) => updateData('d2_ref_2', v)}
          accentColor={accent}
          placeholder="e.g., Read 3 chapters of my book"
        />
      </div>

      <div className="spacer-lg" />

      <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.25rem', margin: '2rem 0' }}>
        <p style={{ fontStyle: 'italic', color: accent, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
          "What you pay attention to is what becomes your life."
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '1px' }}>— Winifred Gallagher</p>
      </div>
    </div>
  );
}
