import React from 'react';
import ClickBox from '../components/ClickBox';
import FillLine from '../components/FillLine';
import Mascot, { PAGE_PATTERNS } from '../components/Mascot';

export default function Day6({ data, updateData }) {
  const accent = 'var(--day6)';
  
  return (
    <div className="page-content" style={{ '--accent': accent, ...PAGE_PATTERNS.day6(accent) }}>
      <div className="spacer-sm" />
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: '0.5rem' }}>Day 06</p>
        <h2 style={{ margin: 0, color: 'var(--cream)' }}>The Dopamine<br /><em>Reset</em></h2>
      </div>
      <div className="day-rule" />
      <p style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
        Recover your edge through strategic boredom.
      </p>

      <Mascot day="day6" />

      <p style={{ marginBottom: '1.5rem' }}>
        "Your brain is like a sponge. If it's constantly soaked in digital noise, it can't absorb new ideas. Today we wring it out."
      </p>

      <div className="card">
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '12px', letterSpacing: '1px' }}>THE SCIENCE IN 3 BULLETS</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>• <strong style={{color:'var(--cream)'}}>Sleep</strong> = Memory consolidation. One bad night = 40% drop in focus.</li>
          <li>• <strong style={{color:'var(--cream)'}}>Movement</strong> = New brain cells (BDNF protein). Even a 20-min walk counts.</li>
          <li>• <strong style={{color:'var(--cream)'}}>Boredom</strong> = Creativity. Your best ideas come when there's no noise to drown them out.</li>
        </ul>
      </div>

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        YOUR 3 RECOVERY MISSIONS
      </h4>

      {[
        { id: 'd6_m1', title: 'The Silent Walk', desc: '20 min, no phone/podcast. Notice 3 things you\'ve never seen before.' },
        { id: 'd6_m2', title: 'The 30-Min Buffer', desc: 'Phone goes to \'charging jail\' outside bedroom 30 min before bed.' },
        { id: 'd6_m3', title: 'The Morning Shield', desc: 'Don\'t touch your phone until after your first coffee or breakfast.' }
      ].map((mission, i) => (
        <div key={mission.id} style={{
          backgroundColor: 'var(--mid-gray)', borderRadius: '8px', padding: '16px', marginBottom: '12px',
          borderLeft: `4px solid ${accent}`
        }}>
          <ClickBox 
            id={mission.id} label={`MISSION ${i+1}: ${mission.title}`}
            checked={data[mission.id] || false} onChange={(v) => updateData(mission.id, v)} accentColor={accent}
          />
          <p style={{ fontSize: '0.85rem', color: 'var(--cream)', paddingLeft: '44px', marginTop: '-4px' }}>
            {mission.desc}
          </p>
        </div>
      ))}

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE IDEA CATCH
      </h4>
      <div className="card">
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>CAPTURE THE BREAKTHROUGH</h4>
        <p style={{ fontSize: '0.95rem' }}>
          During boredom your Default Mode Network activates — this is when creative breakthroughs happen. Carry paper on your walk. If a great idea hits, jot <strong style={{color:'var(--cream)'}}>one word</strong> and keep walking.
        </p>
      </div>

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE RECOVERY CHECK
      </h4>

      <div className="fill-line-container">
        <label className="fill-line-label" style={{ color: accent }}>How itchy was your thumb to check your phone during the walk? (1–10):</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="number"
            value={data.d6_r1 || ''}
            onChange={(e) => {
              const val = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
              updateData('d6_r1', e.target.value === '' ? '' : val);
            }}
            onKeyDown={(e) => { if (['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}
            min="1" max="10"
            placeholder="1–10"
            style={{
              width: '70px', height: '48px', textAlign: 'center', fontSize: '1.4rem',
              fontFamily: 'var(--font-display)', backgroundColor: 'var(--card)',
              color: 'var(--cream)', border: `1px solid var(--border)`, borderRadius: '4px', outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = accent}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>out of 10</span>
        </div>
      </div>
      <FillLine 
        id="d6_r2" label="The most interesting thought I had when there was nothing to distract me:" 
        value={data.d6_r2 || ''} onChange={(v) => updateData('d6_r2', v)} lines={2} accentColor={accent} 
        placeholder="e.g., I realized how to solve that bug at work"
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
