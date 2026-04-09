import React from 'react';
import FillLine from '../components/FillLine';
import Mascot, { PAGE_PATTERNS } from '../components/Mascot';

export default function Day7({ data, updateData }) {
  const accent = 'var(--day7)';
  
  return (
    <div className="page-content" style={{ '--accent': accent, ...PAGE_PATTERNS.day7(accent) }}>
      <div className="spacer-sm" />
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: '0.5rem' }}>Day 07</p>
        <h2 style={{ margin: 0, color: 'var(--cream)' }}>The Attention<br /><em>OS</em></h2>
      </div>
      <div className="day-rule" />
      <p style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
        Build a system that works so you don't have to.
      </p>

      <Mascot day="day7" />

      <div className="card" style={{ backgroundColor: '#1A1200' }}>
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>THE AUTOMATION SECRET</h4>
        <p style={{ fontStyle: 'italic', color: accent, marginBottom: '8px' }}>
          "You don't rise to the level of your goals — you fall to the level of your systems." — James Clear
        </p>
        <p style={{ fontSize: '0.95rem' }}>
          Today we stop <i>trying</i> to focus and start <i>defaulting</i> to it. We set the rules so your brain doesn't have to decide every morning.
        </p>
      </div>

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        YOUR ATTENTION OPERATING SYSTEM
      </h4>
      <p style={{ marginBottom: '1.5rem' }}>Fill in your 3 Core Rules:</p>

      {[
        { id: 'd7_r1', title: 'THE MORNING RULE', prompt: 'I will not touch my phone until:', placeholder: 'e.g., I finish my first glass of water' },
        { id: 'd7_r2', title: 'THE DEEP WORK RULE', prompt: 'Time of my daily Monk Sprint:', placeholder: 'e.g., 8:00 AM - 9:00 AM' },
        { id: 'd7_r3', title: 'THE SHUTDOWN RULE', prompt: 'Time my phone goes to charging jail:', placeholder: 'e.g., 9:00 PM' }
      ].map((rule) => (
        <div key={rule.id} style={{ marginBottom: '1.5rem' }}>
          <h5 style={{ color: accent, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '4px' }}>{rule.title}</h5>
          <FillLine 
            id={rule.id} label={rule.prompt}
            value={data[rule.id] || ''} onChange={(v) => updateData(rule.id, v)} accentColor={accent} placeholder={rule.placeholder}
          />
        </div>
      ))}

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE BEFORE VS. AFTER
      </h4>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '2rem' }}>
        <div style={{ flex: 1, backgroundColor: 'var(--card)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border)' }}>
          <h5 style={{ color: accent, fontSize: '0.65rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>Day 1 Score (Urges)</h5>
          <input
            type="number"
            value={data['d1_total_score'] || ''}
            onChange={(e) => updateData('d1_total_score', Math.max(0, parseInt(e.target.value) || 0) || '')}
            onKeyDown={(e) => { if (['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}
            min="0"
            placeholder="e.g., 24"
            style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--cream)', padding: '10px 8px', borderRadius: '4px', textAlign: 'center', outline: 'none', fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}
            onFocus={(e) => e.target.style.borderColor = accent}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <div style={{ flex: 1, backgroundColor: 'var(--card)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border)' }}>
          <h5 style={{ color: accent, fontSize: '0.65rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>Day 7 Score (Urges)</h5>
          <input
            type="number"
            value={data['d7_total_score'] || ''}
            onChange={(e) => updateData('d7_total_score', Math.max(0, parseInt(e.target.value) || 0) || '')}
            onKeyDown={(e) => { if (['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}
            min="0"
            placeholder="e.g., 8"
            style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--cream)', padding: '10px 8px', borderRadius: '4px', textAlign: 'center', outline: 'none', fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}
            onFocus={(e) => e.target.style.borderColor = accent}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      </div>

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE 90-DAY VISION
      </h4>
      <p style={{ marginBottom: '1.5rem', fontStyle: 'italic' }}>
        "If I keep this system for 90 days, the one big project I will finally finish is:"
      </p>

      <FillLine 
        id="d7_vision" label="" 
        value={data.d7_vision || ''} onChange={(v) => updateData('d7_vision', v)} lines={2} accentColor={accent} 
        placeholder="e.g., Finally launch my side hustle's landing page."
      />

    </div>
  );
}
