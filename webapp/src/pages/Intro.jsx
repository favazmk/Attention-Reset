import React, { useState } from 'react';
import ClickBox from '../components/ClickBox';

export default function Intro({ data, updateData, introError }) {
  const accent = 'var(--day0)';
  const [nameSaved, setNameSaved] = useState(false);

  return (
    <div className="page-content" style={{ '--accent': accent }}>
      <div className="spacer-sm" />

      <p style={{ fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase', color: accent, fontWeight: 600, marginBottom: '0.75rem' }}>
        Before you begin
      </p>

      <h2 style={{ marginBottom: '1.5rem', color: 'var(--cream)' }}>
        Start small,<br />
        <em>Take control today.</em>
      </h2>

      <div className="day-rule" />

      <p
        style={{
          fontSize: "1.1rem",
          marginBottom: "2.5rem",
          lineHeight: "1.6",
          color: "var(--cream)",
        }}
      >
        Your attention is being auctioned to the highest bidder.
        <br />
        <strong>This is where you stop the sale.</strong>
      </p>

      <div className="card" style={{ marginBottom: '2.5rem', background: '#0c0c0c', border: `1px solid ${accent}` }}>
        <h4 style={{ color: accent, marginBottom: '0.75rem', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Before we begin—</h4>
        <p style={{ color: 'rgba(237,232,220,0.85)', fontSize: '0.95rem', marginBottom: '1rem' }}>What should we call you?</p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Enter your name..."
            autoCapitalize="words"
            value={data.user_name || ''}
            onChange={(e) => {
              updateData('user_name', e.target.value);
              setNameSaved(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && data.user_name?.trim()) setNameSaved(true);
            }}
            style={{ flex: '1 1 200px', minWidth: 0, padding: '16px', background: '#131311', border: '1px solid #2C2C26', color: '#EDE8DC', borderRadius: '8px', outline: 'none', fontSize: '1.05rem', fontFamily: 'inherit' }}
          />
          <button
            onClick={() => data.user_name?.trim() && setNameSaved(true)}
            style={{
              flex: '1 1 auto',
              padding: '16px 24px',
              background: nameSaved ? '#00E87A' : '#131311',
              color: nameSaved ? '#000' : '#EDE8DC',
              border: `1px solid ${nameSaved ? '#00E87A' : '#2C2C26'}`,
              borderRadius: '8px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {nameSaved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ color: accent, marginBottom: '1.25rem' }}>How this works:</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            'Do one day at a time',
            'Focus fully, avoid multitasking',
            'Complete each step',
            'Come back tomorrow',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ color: accent, fontSize: '1.2rem', lineHeight: 1 }}>•</span>
              <span style={{ fontSize: '1rem', color: 'rgba(237,232,220,0.85)', fontWeight: 400 }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <h3 style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>Your 7-Day Journey</h3>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {[
          {
            d: 1,
            title: "The Digital Kill-Switch",
            desc: "Stop the pings. Start the progress.",
            hex: "var(--day1)",
          },
          {
            d: 2,
            title: "The Snap Audit",
            desc: "Find your attention leaks in 5 minutes.",
            hex: "var(--day2)",
          },
          {
            d: 3,
            title: "The Monk Sprint",
            desc: "One task. Zero noise. 100% impact.",
            hex: "var(--day3)",
          },
          {
            d: 4,
            title: "The Focus Sprints",
            desc: "Level up your mental endurance.",
            hex: "var(--day4)",
          },
          {
            d: 5,
            title: "The Fortress",
            desc: "Design a space where focus is the only option.",
            hex: "var(--day5)",
          },
          {
            d: 6,
            title: "The Dopamine Reset",
            desc: "Recover your edge through strategic boredom.",
            hex: "var(--day6)",
          },
          {
            d: 7,
            title: "The Attention OS",
            desc: "Build a system that works so you don't have to.",
            hex: "var(--day7)",
          },
        ].map((day) => (
          <div
            key={day.d}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(8px)";
              e.currentTarget.style.borderColor = day.hex;
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            style={{
              display: "flex",
              padding: "16px 12px",
              borderBottom: "1px solid var(--border)",
              alignItems: "center",
              gap: "20px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "default",
              borderRadius: "4px",
              marginLeft: "-12px",
              width: "calc(100% + 24px)",
            }}
          >
            <div style={{ width: "52px", flexShrink: 0 }}>
              <div
                style={{
                  width: "28px",
                  height: "2px",
                  background: day.hex,
                  marginBottom: "4px",
                }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: day.hex,
                  letterSpacing: "1.5px",
                }}
              >
                {day.d.toString().padStart(2, "0")}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "var(--cream)",
                  marginBottom: "2px",
                  fontFamily: "var(--font-display)",
                }}
              >
                {day.title}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted)",
                  fontWeight: 300,
                }}
              >
                {day.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="spacer-md" />

      <div className="spacer-md" />

      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--muted)', fontWeight: 300, marginBottom: '0.5rem' }}>
          You already know your attention is slipping.
        </p>
        <p style={{ fontSize: '1.5rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
          IT'S TIME TO FIX IT.
        </p>
      </div>

      <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: '1.25rem', marginBottom: '3rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--cream)', fontWeight: 500, lineHeight: 1.8 }}>
          In 7 days:<br />
          You’ll think clearer, Work deeper, And feel in control again.
        </p>
      </div>

      <div
        className="card"
        style={{
          border: `1px solid ${accent}`,
          boxShadow: `0 0 20px ${accent}22`,
          padding: "24px",
          background: "rgba(255,255,255,0.01)",
          marginBottom: "1rem",
        }}
      >
        <h4 style={{ color: accent, marginBottom: "1.25rem" }}>
          THE COMMITMENT CONTRACT
        </h4>
        <ClickBox
          id="intro_commitment"
          label="I commit for 7 days. I will regain control of my mind. No skipping. No excuses."
          checked={data.intro_commitment || false}
          onChange={(v) => updateData("intro_commitment", v)}
          accentColor={accent}
          noStrike={true}
          error={introError && !data.intro_commitment}
        />
      </div>
    </div>
  );
}
