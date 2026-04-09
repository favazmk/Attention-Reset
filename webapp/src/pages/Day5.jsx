import React from 'react';
import ClickBox from '../components/ClickBox';
import FillLine from '../components/FillLine';
import Mascot, { PAGE_PATTERNS } from '../components/Mascot';

export default function Day5({ data, updateData }) {
  const accent = 'var(--day5)';
  
  return (
    <div className="page-content" style={{ '--accent': accent, ...PAGE_PATTERNS.day5(accent) }}>
      <div className="spacer-sm" />
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: '0.5rem' }}>Day 05</p>
        <h2 style={{ margin: 0, color: 'var(--cream)' }}>The<br /><em>Fortress</em></h2>
      </div>
      <div className="day-rule" />
      <p style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
        Design a space where focus is the only option.
      </p>

      <Mascot day="day5" />

      <div className="card">
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>THE SCIENCE</h4>
        <p style={{ fontSize: '0.95rem' }}>
          <strong>Willpower is a finite battery.</strong> If you have to fight the urge to check your phone, you've already lost half your energy. Today we use Architecture — changing the environment so your brain has no choice but to work.
        </p>
      </div>

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE 3-POINT SWEEP
      </h4>

      {[
        { id: 'd5_c1', title: 'VISUAL SILENCE', desc: 'Clear everything off your desk except your computer/notebook and a drink. If it\'s not for the task, it\'s a distraction.' },
        { id: 'd5_c2', title: 'THE DIGITAL MOAT', desc: 'Install a site blocker (Cold Turkey / Freedom) and lock your top 3 distraction sites for the next 2 hours.' },
        { id: 'd5_c3', title: 'THE OUT-OF-SIGHT RULE', desc: 'Phone goes in a drawer in a different room. A phone on your desk reduces cognitive capacity even face-down.' }
      ].map((item) => (
        <div key={item.id} style={{ marginBottom: '1rem' }}>
          <ClickBox 
            id={item.id} label={item.title}
            checked={data[item.id] || false} onChange={(v) => updateData(item.id, v)} accentColor={accent}
          />
          <p style={{ fontSize: '0.85rem', color: 'var(--light-text)', paddingLeft: '44px', marginTop: '-8px' }}>
            {item.desc}
          </p>
        </div>
      ))}

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        THE FOCUS ANCHOR
      </h4>
      <div className="card">
        <h4 style={{ color: accent, fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '1px' }}>BUILD A SENSORY TRIGGER</h4>
        <p style={{ fontSize: '0.95rem' }}>
          Choose one scent (candle), playlist (lo-fi / white noise), or drink. <strong style={{color:'var(--cream)'}}>Use it ONLY in Fortress Mode.</strong> Your brain associates it with 'Go Time' within 2 weeks.
        </p>
      </div>

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        MY 3-STEP FOCUS RITUAL
      </h4>

      <FillLine id="d5_r1" label="Step 1 (e.g. Headphones on):" value={data.d5_r1 || ''} onChange={(v) => updateData('d5_r1', v)} accentColor={accent} placeholder="e.g., Put on noise-cancelling headphones" />
      <FillLine id="d5_r2" label="Step 2 (e.g. Phone in drawer):" value={data.d5_r2 || ''} onChange={(v) => updateData('d5_r2', v)} accentColor={accent} placeholder="e.g., Place phone in the kitchen drawer" />
      <FillLine id="d5_r3" label="Step 3 (e.g. Coffee sip):" value={data.d5_r3 || ''} onChange={(v) => updateData('d5_r3', v)} accentColor={accent} placeholder="e.g., Sip black coffee" />

      <div className="spacer-lg" />

      <h4 style={{ color: accent, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '1px' }}>
        REFLECTION
      </h4>
      <p style={{ marginBottom: '1.5rem' }}>What is the #1 item in your environment that tricks you into procrastinating? How did you neutralize it today?</p>

      <FillLine 
        id="d5_reflection"
        label="Your answer:"
        value={data.d5_reflection || ''}
        onChange={(v) => updateData('d5_reflection', v)}
        lines={2}
        accentColor={accent}
        placeholder="e.g., My Xbox controller. I put it in the closet before starting."
      />

      <div className="spacer-lg" />

      <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.25rem', margin: '2rem 0' }}>
        <p style={{ fontStyle: 'italic', color: accent, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
          "Environment is the invisible hand that shapes human behaviour."
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '1px' }}>— James Clear</p>
      </div>
    </div>
  );
}
