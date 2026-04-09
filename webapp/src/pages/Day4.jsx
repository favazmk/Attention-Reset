import React, { useState, useEffect } from 'react';
import FillLine from '../components/FillLine';
import Mascot, { PAGE_PATTERNS } from '../components/Mascot';
import confetti from 'canvas-confetti';

export default function Day4({ data, updateData }) {
  const accent = 'var(--day4)';
  const [triggered, setTriggered] = useState(false);

  // Track progress locally
  const tasks = [
    data.d4_sprint_1_done, data.d4_score_1,
    data.d4_sprint_2_done, data.d4_score_2,
    data.d4_sprint_3_done, data.d4_score_3,
    data.d4_sprint_4_done, data.d4_score_4,
    data.d4_r1, data.d4_r2
  ];
  const completedTasks = tasks.filter(Boolean).length;
  const totalTasks = 10;

  useEffect(() => {
    if (completedTasks === totalTasks && !triggered) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTriggered(true);
    }
  }, [completedTasks, triggered]);
  
  return (
    <div className="page-content" style={{ '--accent': accent, ...PAGE_PATTERNS.day4(accent) }}>
      <div className="spacer-sm" />

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: '0.5rem' }}>Day 04</p>
        <h2 style={{ margin: 0, color: 'var(--cream)' }}>The Focus<br /><em>Sprints</em></h2>
      </div>
      <div className="day-rule" />
      <p style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
        Level up your mental endurance.
      </p>

      <Mascot day="day4" />

      <div className="card">
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>THE SCIENCE</h4>
        <p style={{ fontSize: '0.95rem' }}>
          <strong>Start small to win big.</strong> If you try to lift 100kg on Day 1 at the gym, you quit. Most people fail at focus because they attempt 2-hour sessions and burn out. Today: interval training for your brain.
        </p>
      </div>

      <div className="spacer-lg" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border-c)', marginBottom: '2rem' }} />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE 25/5 GAME — 4 ROUNDS
      </h4>
      <p style={{ marginBottom: '1.5rem' }}>Complete all 4 sprints. Score your focus after each:</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map((sprint) => {
          return (
            <div key={sprint} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--dark-card)', padding: '16px', borderRadius: '12px',
              border: `1px solid ${data[`d4_sprint_${sprint}_done`] ? accent : 'rgba(255,255,255,0.05)'}`,
              transition: 'border 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div 
                  onClick={() => updateData(`d4_sprint_${sprint}_done`, !data[`d4_sprint_${sprint}_done`])}
                  style={{
                    width: '24px', height: '24px', border: `2px solid ${accent}`, borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    background: data[`d4_sprint_${sprint}_done`] ? accent : 'var(--bg)',
                    transition: 'all 0.2s'
                  }}
                >
                  {data[`d4_sprint_${sprint}_done`] && <div style={{ color: 'var(--bg)', fontSize: '14px', fontWeight: 'bold' }}>✓</div>}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Sprint {sprint}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--light-text)' }}>25 min focus + 5 min break</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--light-text)' }}>Score:</span>
                <input 
                  type="number" 
                  value={data[`d4_score_${sprint}`] || ''}
                  onChange={(e) => {
                    const val = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
                    updateData(`d4_score_${sprint}`, e.target.value === '' ? '' : val);
                  }}
                  onKeyDown={(e) => { if (['e','E','+','-','.'].includes(e.key)) e.preventDefault(); }}
                  min="1" max="10"
                  placeholder="/10"
                  style={{
                    width: '50px', background: 'var(--bg)', border: `1px solid var(--border-c)`,
                    color: 'var(--cream)', padding: '8px', borderRadius: '6px', textAlign: 'center', outline: 'none',
                    fontSize: '0.9rem'
                  }}
                  onFocus={(e) => e.target.style.borderColor = accent}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-c)'}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ backgroundColor: '#1A0A1A' }}>
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>THE GOLDEN RULE OF BREAKS</h4>
        <p style={{ fontSize: '0.95rem' }}>
          During your 5-minute break: <strong style={{color:'var(--cream)'}}>DO NOT check your phone.</strong> Walk, stretch, or stare at a wall. Checking your phone extends re-focus time by up to 15 minutes.
        </p>
      </div>

      <div className="spacer-lg" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border-c)', marginBottom: '2rem' }} />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE 20-20-20 EYE RESET
      </h4>
      <p style={{ marginBottom: '1.5rem' }}>
        Every break: look at something <strong>20 feet away</strong> for <strong>20 seconds</strong>. Resets screen fatigue and lowers cortisol.
      </p>

      <div className="spacer-lg" />
      <hr style={{ border: 'none', borderTop: '1px solid var(--border-c)', marginBottom: '2rem' }} />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE PEAK FINDER
      </h4>

      <FillLine 
        id="d4_r1" label="My highest focus score was Sprint # __ — this tells me I'm sharpest at:" 
        value={data.d4_r1 || ''} onChange={(v) => updateData('d4_r1', v)} accentColor={accent} 
        placeholder="e.g., Early morning, right after coffee"
      />
      <FillLine 
        id="d4_r2" label="What distracted me most today:" 
        value={data.d4_r2 || ''} onChange={(v) => updateData('d4_r2', v)} accentColor={accent} 
        placeholder="e.g., Group chat notifications"
      />

      <div className="spacer-lg" />

      <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.25rem', margin: '2rem 0' }}>
        <p style={{ fontStyle: 'italic', color: accent, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
          "You will never reach your destination if you stop and throw stones at every dog that barks."
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '1px' }}>— Winston Churchill</p>
      </div>
    </div>
  );
}
