import React, { useEffect } from 'react';

const DAY_COLORS = ['#FF3B3B','#F5C842','#3BB8E8','#B060FF','#00E5C0','#00E87A','#FF8C00'];

const DAYS = [
  { n:'01', color:'#FF3B3B', title:'The Digital Kill-Switch', action:'3-min phone setup',            feel:'Lighter. Less reactive.' },
  { n:'02', color:'#F5C842', title:'The Snap Audit',          action:'Identify your attention leaks', feel:'Aware. In control of what you\'re fighting.' },
  { n:'03', color:'#3BB8E8', title:'The Monk Sprint',         action:'First 20-min deep focus block', feel:'Surprised by what you finished.' },
  { n:'04', color:'#B060FF', title:'The Focus Sprints',       action:'4 rounds of interval deep work', feel:'Your brain starts to feel like yours again.' },
  { n:'05', color:'#00E5C0', title:'The Fortress',            action:'Redesign your focus environment', feel:'Work feels 10× less exhausting.' },
  { n:'06', color:'#00E87A', title:'The Dopamine Reset',      action:'Boredom walk + digital blackout', feel:'Calm you haven\'t felt in months.' },
  { n:'07', color:'#FF8C00', title:'The Attention OS',        action:'Build your personal focus system', feel:'You have a system. Not just intentions.' },
];

const FEATURES = [
  ["7 Day Protocols",       "One science-backed exercise per day"],
  ["Clickable Checklists",  "Track tasks as you complete them"],
  ["The Parking Lot",       "Capture stray thoughts without losing focus"],
  ["Intensity Selector",    "Sprinter / Runner / Monk — your pace"],
  ["Sprint Score Tracker",  "Log your focus quality each session"],
  ["Recovery Mission Log",  "Day 6 dopamine reset journal"],
  ["Attention OS Builder",  "Your permanent post-reset focus system"],
  ["Before vs. After Score","See exactly how far you've come"],
  ["Focus Ritual Builder",  "3-step personal ritual you keep forever"],
  ["Certificate of Completion", "Shareable proof you did the work"],
];

const FAQS = [
  ['Do I need to download anything?', 'No. It\'s a web app — open it in any browser on your phone, tablet, or laptop. Nothing to install. Your progress is auto-saved.'],
  ['What if I have ADHD or can\'t focus at all?', 'That\'s exactly who this was built for. Each day starts with a 5-minute win. You don\'t need to be focused to start — just open it.'],
  ['What if I\'ve tried this kind of thing before and quit?', 'Day 1 takes 10 minutes. The programme is designed for low-friction completion. You don\'t need motivation — you need a low starting point to begin.'],
  ['Will this work if I\'m on screens all day for work?', 'Yes. Day 5 (The Fortress) specifically addresses environment design for people who can\'t avoid screens.'],
  ['Is this a video course?', 'No. It\'s a focused, interactive web programme — designed for people with fractured attention who don\'t need another video queue to feel guilty about.'],
  ['How long does each day take?', 'Day 1 takes ~10 minutes. By Day 4 you\'re doing 25-minute focus sprints. Average: 20–30 min/day.'],
];

export default function Landing({ onEnroll }) {
  const [openFaq, setOpenFaq] = React.useState(null);

  // Inject landing-specific styles
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'landing-styles';
    style.textContent = `
      .l-section { padding: 5.5rem 0; border-top: 1px solid #2C2C26; }
      .l-wrap { max-width: 680px; margin: 0 auto; padding: 0 1.25rem; }
      .l-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #F5C842; margin-bottom: 0.75rem; }
      .l-h1 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(2.2rem,6vw,3.2rem); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.25rem; color: #EDE8DC; }
      .l-h2 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(1.7rem,4vw,2.3rem); line-height: 1.15; margin-bottom: 1rem; color: #EDE8DC; }
      .l-p { color: rgba(237,232,220,0.72); font-weight: 300; line-height: 1.75; }
      .l-rule { height: 1px; background: linear-gradient(90deg,#F5C842,transparent); margin: 1.5rem 0; opacity: 0.55; }
      .l-cta { display: block; width: 100%; max-width: 380px; background: #F5C842; color: #0E0E0B; font-family: 'DM Sans',sans-serif; font-weight: 700; font-size: 1rem; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; padding: 17px 36px; border-radius: 4px; border: none; cursor: pointer; text-align: center; transition: transform .2s, box-shadow .2s; }
      .l-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,200,66,.25); }
      .l-checklist { list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 1.5rem 0; }
      .l-checklist li { display: flex; align-items: flex-start; gap: 14px; padding: 13px 15px; background: #1C1C18; border: 1px solid #2C2C26; border-radius: 6px; font-size: 0.93rem; font-weight: 300; color: rgba(237,232,220,.85); transition: border-color .2s; }
      .l-checklist li:hover { border-color: rgba(245,200,66,.3); }
      .l-cb { width: 17px; height: 17px; border: 2px solid #3a3a34; border-radius: 3px; flex-shrink: 0; margin-top: 2px; }
      .l-card { background: #1C1C18; border: 1px solid #2C2C26; border-radius: 6px; padding: 1.5rem; position: relative; overflow: hidden; }
      .l-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #F5C842; box-shadow: 0 0 8px #F5C842; }
      .l-day-row { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid #2C2C26; align-items: flex-start; }
      .l-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 1.25rem; }
      .l-feature { background: #1C1C18; border: 1px solid #2C2C26; border-radius: 6px; padding: 1rem; font-size: 0.83rem; color: rgba(237,232,220,.78); font-weight: 300; }
      .l-feature strong { display: block; color: #EDE8DC; font-weight: 600; margin-bottom: 3px; font-size: 0.875rem; }
      .l-split { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 1.25rem; }
      .l-split-col { border: 1px solid #2C2C26; border-radius: 6px; padding: 1.25rem; }
      .l-split-col ul { list-style: none; display: flex; flex-direction: column; gap: 9px; }
      .l-split-col li { font-size: 0.84rem; color: rgba(237,232,220,.72); display: flex; gap: 8px; font-weight: 300; }
      .l-pricing { background: #1C1C18; border: 1px solid #2C2C26; border-radius: 8px; padding: 2rem; text-align: center; margin-top: 2rem; position: relative; overflow: hidden; }
      .l-pricing::before { content:''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,#FF3B3B,#F5C842,#FF8C00); box-shadow: 0 0 16px #F5C842; }
      .l-offer-list { list-style: none; text-align: left; margin: 1.25rem 0; display: flex; flex-direction: column; gap: 10px; }
      .l-offer-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 0.9rem; font-weight: 300; color: rgba(237,232,220,.85); }
      .l-offer-list li::before { content:'✓'; color:#F5C842; font-weight:700; flex-shrink:0; }
      .l-faq-item { border-bottom: 1px solid #2C2C26; }
      .l-faq-q { width: 100%; text-align: left; background: none; border: none; color: #EDE8DC; font-family: 'DM Sans',sans-serif; font-weight: 500; font-size: 0.95rem; padding: 1.2rem 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
      .l-faq-a { font-size: 0.88rem; color: rgba(237,232,220,.68); font-weight: 300; padding-bottom: 1.2rem; line-height: 1.7; }
      .l-trust { display: flex; gap: 1.25rem; flex-wrap: wrap; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid #2C2C26; }
      .l-trust span { font-size: 0.78rem; color: #6B6860; display: flex; align-items: center; gap: 6px; }
      .l-dot { width: 5px; height: 5px; border-radius: 50%; background: #F5C842; box-shadow: 0 0 5px #F5C842; flex-shrink: 0; }
      .l-author { display: flex; gap: 1.25rem; align-items: flex-start; margin-top: 1.5rem; }
      .l-avatar { width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg,#F5C842,#FF8C00); display: flex; align-items: center; justify-content: center; font-family: 'DM Serif Display',serif; font-size: 1.4rem; color: #0E0E0B; }
      .l-bump { margin-top: 1rem; padding: 1rem; background: rgba(245,200,66,.06); border: 1px dashed rgba(245,200,66,.3); border-radius: 6px; font-size: 0.84rem; font-weight: 300; color: rgba(237,232,220,.8); }
      .l-guarantee { border: 1px solid #2C2C26; border-radius: 8px; padding: 2rem; text-align: center; background: rgba(245,200,66,.03); }
      @media (max-width:600px) { .l-split, .l-feature-grid { grid-template-columns: 1fr; } .l-h1 { font-size: 2rem; } }
    `;
    document.head.appendChild(style);
    return () => { const s = document.getElementById('landing-styles'); if(s) s.remove(); };
  }, []);

  return (
    <div style={{ background: '#0E0E0B', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#EDE8DC' }}>

      {/* HERO */}
      <section style={{ padding: '7rem 0 5rem' }}>
        <div className="l-wrap">
          <p className="l-label">7-Day Interactive Programme</p>
          <h1 className="l-h1">You're Not Lazy.<br /><em>Your Attention Has Been<br />Engineered to Shatter.</em></h1>
          <div className="l-rule" />
          <p className="l-p" style={{ fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '520px' }}>
            A 7-day interactive web programme for people who can't read, work, or think deeply like they used to.
            One day. One exercise. Real change.
          </p>
          <button className="l-cta" onClick={onEnroll}>Start the Reset →</button>
          <div className="l-trust">
            <span><span className="l-dot" />7 interactive daily exercises</span>
            <span><span className="l-dot" />Works on any device</span>
            <span><span className="l-dot" />Auto-saved progress</span>
          </div>

          {/* App mockup */}
          <div style={{ marginTop: '3rem', background: '#1C1C18', border: '1px solid #2C2C26', borderRadius: '12px', overflow: 'hidden', maxWidth: '480px' }}>
            <div style={{ height: '32px', background: '#161612', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '6px', borderBottom: '1px solid #2C2C26' }}>
              {['#FF3B3B','#F5C842','#00E87A'].map((c,i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
              <span style={{ fontSize: '0.62rem', color: '#6B6860', marginLeft: '8px', letterSpacing: '1px' }}>7-DAY ATTENTION RESET</span>
            </div>
            <div style={{ padding: '2rem 1.5rem' }}>
              <div style={{ fontSize: '0.6rem', color: '#F5C842', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Day 01</div>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.3rem', color: '#EDE8DC', marginBottom: '1rem' }}>The Digital<br /><em>Kill-Switch</em></div>
              <div style={{ height: '1px', background: 'linear-gradient(90deg,#FF3B3B,transparent)', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '1.5rem' }}>
                {['#F5C842',...Array(6).fill('#2C2C26')].map((c,i) => (
                  <React.Fragment key={i}>
                    <div style={{ width: i===0?'12px':'8px', height: i===0?'12px':'8px', borderRadius: '50%', background: c, boxShadow: i===0?`0 0 8px ${c}`:'none', flexShrink: 0 }} />
                    {i < 6 && <div style={{ flex: 1, height: '1px', background: '#2C2C26' }} />}
                  </React.Fragment>
                ))}
              </div>
              {[1,0,0].map((checked, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: checked ? 'rgba(255,59,59,0.08)' : '#161612', borderRadius: '4px', border: `1px solid ${checked?'rgba(255,59,59,0.2)':'#2C2C26'}`, marginBottom: '8px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '2px', background: checked?'#FF3B3B':'transparent', border: checked?'none':'1.5px solid #3a3a34', flexShrink: 0 }} />
                  <div style={{ height: '7px', flex: 1, background: 'rgba(237,232,220,0.1)', borderRadius: '3px' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SYMPTOM MIRROR */}
      <section className="l-section">
        <div className="l-wrap">
          <p className="l-label">Does this sound familiar?</p>
          <h2 className="l-h2">Signs your attention<br /><em>is being hijacked</em></h2>
          <p className="l-p">Check what sounds familiar:</p>
          <ul className="l-checklist">
            {['You open your phone to do one thing and lose 30 minutes','You can\'t read 3 paragraphs without reaching for your phone','You start tasks but finish almost none of them','Your best ideas stay in your head because focus never arrives','You feel guilty scrolling but can\'t seem to stop','Deep work used to feel easy. Now it feels impossible.','You\'ve tried productivity hacks. None of them stuck.'].map((t,i) => (
              <li key={i}><div className="l-cb" />{t}</li>
            ))}
          </ul>
          <div className="l-card">
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#EDE8DC' }}>
              If you checked 3 or more — your attention hasn't broken. It's been <strong>trained to shatter.</strong><br /><br />
              And it can be retrained in 7 days.
            </p>
          </div>
        </div>
      </section>

      {/* MECHANISM */}
      <section className="l-section">
        <div className="l-wrap">
          <p className="l-label">The real problem</p>
          <h2 className="l-h2">You don't have a willpower problem.<br /><em>You have an overstimulation problem.</em></h2>
          <div className="l-rule" />
          <p className="l-p" style={{ marginBottom: '1.25rem' }}>
            Algorithms are engineered to hijack your dopamine. Every notification triggers a cortisol spike. The average person interrupts themselves every 3 minutes and takes 23 minutes to fully refocus. This isn't weakness — it's a <em>rigged game.</em>
          </p>
          <div className="l-card">
            <p style={{ fontSize: '1.05rem', color: '#EDE8DC', fontStyle: 'italic', lineHeight: 1.7 }}>
              "The 7-Day Attention Reset doesn't ask you to try harder.<br />It rewires the <strong>inputs.</strong>"
            </p>
          </div>
        </div>
      </section>

      {/* 7-DAY LADDER */}
      <section className="l-section">
        <div className="l-wrap">
          <p className="l-label">The programme</p>
          <h2 className="l-h2">Here's what changes —<br /><em>day by day.</em></h2>
          <p className="l-p" style={{ marginBottom: '2rem' }}>Each day has one exercise and one visible result.</p>
          <div>
            {DAYS.map((d) => (
              <div key={d.n} className="l-day-row">
                <div style={{ flexShrink: 0, width: '44px' }}>
                  <div style={{ height: '2px', background: d.color, boxShadow: `0 0 6px ${d.color}`, marginBottom: '4px' }} />
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', color: d.color }}>{d.n}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.05rem', color: '#EDE8DC', marginBottom: '2px' }}>{d.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6B6860', marginBottom: '4px', fontWeight: 300 }}>{d.action}</div>
                  <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: d.color }}>{d.feel}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="l-card" style={{ marginTop: '2rem' }}>
            <p style={{ color: '#EDE8DC', fontSize: '1rem' }}>By Day 7, you won't just feel better — you'll have a system that <strong>protects your attention from the inside out.</strong></p>
          </div>
        </div>
      </section>



      {/* INSIDE */}
      <section className="l-section">
        <div className="l-wrap">
          <p className="l-label">What's inside</p>
          <h2 className="l-h2">Everything inside<br /><em>the reset.</em></h2>
          <p className="l-p">Works on any device. No downloads. No app stores. Open and start.</p>
          <div className="l-feature-grid">
            {FEATURES.map(([t,d]) => (
              <div key={t} className="l-feature"><strong>{t}</strong>{d}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR / NOT FOR */}
      <section className="l-section">
        <div className="l-wrap">
          <p className="l-label">Be honest with yourself</p>
          <h2 className="l-h2">Who this is for —<br /><em>and who it isn't.</em></h2>
          <div className="l-split">
            <div className="l-split-col" style={{ borderTop: '2px solid #F5C842' }}>
              <h4 style={{ fontSize: '0.62rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', color: '#F5C842', fontFamily: "'DM Sans',sans-serif" }}>This is for you if</h4>
              <ul>
                {['You\'re a student, creator, freelancer, or remote worker','Your screen time embarrasses you','Apps and habit trackers haven\'t stuck','You want structure, not just tips','You can commit 20–30 min/day for 7 days'].map(t => (
                  <li key={t}><span style={{ color: '#F5C842' }}>→</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="l-split-col" style={{ borderTop: '2px solid #2C2C26' }}>
              <h4 style={{ fontSize: '0.62rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', color: '#6B6860', fontFamily: "'DM Sans',sans-serif" }}>Not for you if</h4>
              <ul>
                {['You want a magic fix with zero effort','You won\'t put your phone down for 30 minutes','You want passive video content'].map(t => (
                  <li key={t}><span style={{ color: '#6B6860' }}>×</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="l-section" id="pricing">
        <div className="l-wrap">
          <p className="l-label">One-time access</p>
          <h2 className="l-h2">Everything you get</h2>
          <ul className="l-offer-list">
            {['7-Day Attention Reset — interactive web programme','Day-by-day protocol with science-backed exercises','Clickable checklists + typed reflection fields','Parking Lot, Sprint Tracker, Intensity Selector','The Attention OS — your permanent focus system','Certificate of Completion (shareable)'].map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <div className="l-pricing">
            <div style={{ fontSize: '1rem', color: '#6B6860', textDecoration: 'line-through', marginBottom: '4px' }}>₹599</div>
            <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: '3rem', color: '#F5C842', marginBottom: '4px' }}>₹399</div>
            <div style={{ fontSize: '0.78rem', color: '#6B6860', marginBottom: '1.5rem' }}>One-time payment · Instant access · No subscription</div>
            <button className="l-cta" style={{ margin: '0 auto' }} onClick={onEnroll}>Yes, I Want My Focus Back →</button>

          </div>
        </div>
      </section>



      {/* FAQ */}
      <section className="l-section">
        <div className="l-wrap">
          <p className="l-label">Common questions</p>
          <h2 className="l-h2">Before you decide</h2>
          <div style={{ marginTop: '1.5rem' }}>
            {FAQS.map(([q,a], i) => (
              <div key={i} className="l-faq-item">
                <button className="l-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {q}
                  <span style={{ color: '#F5C842', fontSize: '0.78rem', flexShrink: 0, transform: openFaq===i?'rotate(180deg)':'none', transition: 'transform .2s' }}>▼</span>
                </button>
                {openFaq === i && <div className="l-faq-a">{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '8rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(245,200,66,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="l-wrap" style={{ position: 'relative' }}>
          <p className="l-label" style={{ textAlign: 'center' }}>7 days. That's all it takes.</p>
          <h1 className="l-h1" style={{ fontSize: 'clamp(2rem,5vw,2.8rem)', textAlign: 'center' }}>Your attention is <em>still in there.</em><br />It just needs 7 days.</h1>
          <p className="l-p" style={{ maxWidth: '420px', margin: '1.25rem auto 2.5rem', fontSize: '1rem', textAlign: 'center' }}>One programme. Seven exercises. One system that lasts.</p>
          <button className="l-cta" style={{ margin: '0 auto' }} onClick={onEnroll}>Start Day 1 →</button>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6B6860' }}>Instant access · Works on any device</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2C2C26', padding: '2rem 0', textAlign: 'center' }}>
        <div className="l-wrap">
          <p style={{ fontSize: '0.72rem', color: '#6B6860' }}>© 2025 Favaz MK · 7-Day Attention Reset</p>
        </div>
      </footer>
    </div>
  );
}
