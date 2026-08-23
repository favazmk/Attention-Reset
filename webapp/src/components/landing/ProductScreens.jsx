import React from 'react';

/* ============================================================================
   PRODUCT SCREENS
   ----------------------------------------------------------------------------
   Faithful, static replicas of screens the buyer actually gets. Every string in
   this file is lifted from the real programme pages (Day1.jsx, Day2.jsx,
   Day7.jsx) — nothing here advertises a screen that doesn't exist.

   They are rebuilt rather than imported because the live pages are stateful,
   auth-gated and carry the whole app stylesheet with them. These are inert
   markup: no state, no handlers, aria-hidden at the frame level, and sized in
   `em` so one font-size on the frame scales an entire device down for mobile.
   ========================================================================== */

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function Task({ label, done }) {
  return (
    <div className="pm-task" data-done={done ? 'true' : 'false'}>
      <span className="pm-box">{done ? CHECK : null}</span>
      <span className="pm-task-label">{label}</span>
    </div>
  );
}

/** Circular step counter — mirrors DayProgressBar's sticky pill. */
function ProgressPill({ current, total, label = 'Day progress' }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  const offset = c - (current / total) * c;
  return (
    <div className="pm-pill">
      <svg className="pm-ring" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r={r} className="pm-ring-track" />
        <circle
          cx="12" cy="12" r={r}
          className="pm-ring-fill"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="pm-pill-text">
        <b>{label}</b>
        <i>{current} of {total} steps</i>
      </span>
    </div>
  );
}

/* -- Day 1 — the screen a buyer lands on first ----------------------------- */
export function ScreenDayOne() {
  return (
    <div className="pm-screen" style={{ '--pm-accent': '#00e87a' }}>
      <div className="pm-screen-scroll">
        <ProgressPill current={3} total={7} />

        <p className="pm-eyebrow">Day 1 of 7</p>
        <h3 className="pm-title">The Digital<br /><em>Kill-Switch</em></h3>
        <div className="pm-rule" />

        <div className="pm-card">
          <h4 className="pm-card-h">The Science</h4>
          <p className="pm-card-p">
            <b>Stress Spike</b> — notifications trigger cortisol, keeping your
            brain in “high-alert” mode.
          </p>
        </div>

        <h4 className="pm-section-h">The 3-Minute Stealth Setup</h4>
        <p className="pm-lede">Open your phone. Do these 4 things right now:</p>

        <Task done label="Set a daily Attention reset reminder for the next 6 days." />
        <Task done label="Silence the Ghosts: turn OFF all unnecessary notifications." />
        <Task done label="Go 40% Greyscale. Kills visual dopamine." />
        <Task label="Install “one sec” — adds friction before every app opens." />

        <div className="pm-cta">Finish Day 1</div>
      </div>
    </div>
  );
}

/* -- Day 2 — the audit, shown on the phone --------------------------------- */
export function ScreenDayTwo() {
  return (
    <div className="pm-screen" style={{ '--pm-accent': '#b060ff' }}>
      <div className="pm-screen-scroll">
        <ProgressPill current={5} total={8} label="Audit" />

        <p className="pm-eyebrow">Day 2 of 7</p>
        <h3 className="pm-title">The Snap<br /><em>Audit</em></h3>
        <div className="pm-rule" />

        <h4 className="pm-section-h">Your Attention Assassins</h4>

        <Task done label="Instagram / TikTok / Reels scrolling" />
        <Task done label="Email refresh (the infinite F5)" />
        <Task label="Desktop notification pings" />
        <Task done label="YouTube autoplay" />
        <Task label="WhatsApp group chats" />
      </div>
    </div>
  );
}

/* -- Day 7 — the system you leave with, shown on the tablet ---------------- */
export function ScreenDaySeven() {
  return (
    <div className="pm-screen" style={{ '--pm-accent': '#ff8c00' }}>
      <div className="pm-screen-scroll">
        <p className="pm-eyebrow">Day 7 of 7</p>
        <h3 className="pm-title">The Attention <em>OS</em></h3>
        <div className="pm-rule" />

        <h4 className="pm-section-h">The Before vs. After</h4>

        <div className="pm-score">
          <div className="pm-score-cell">
            <span className="pm-score-k">Before</span>
            <span className="pm-score-v pm-score-v--was">24</span>
          </div>
          <svg className="pm-score-arrow" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round"
               strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <div className="pm-score-cell">
            <span className="pm-score-k">After</span>
            <span className="pm-score-v pm-score-v--now">8</span>
          </div>
        </div>

        <h4 className="pm-section-h">Your Three Rules</h4>

        <div className="pm-field">
          <span className="pm-field-k">The Morning Rule</span>
          <span className="pm-field-v">No screens before I finish my first block.</span>
        </div>
        <div className="pm-field">
          <span className="pm-field-k">The Deep Work Rule</span>
          <span className="pm-field-v">Phone in another room, 90 minutes, once a day.</span>
        </div>
        <div className="pm-field">
          <span className="pm-field-k">The Shutdown Rule</span>
          <span className="pm-field-v pm-field-v--empty">Type your rule…</span>
        </div>
      </div>
    </div>
  );
}

/* -- Device frames ---------------------------------------------------------
   Pure CSS bezels. `aria-hidden` because the screens repeat copy that already
   exists in the surrounding sections as real text — a screen reader gets the
   claim without having to walk a decorative facsimile of the UI. */

export function Laptop({ children, className = '' }) {
  return (
    <div className={`pm-laptop ${className}`} aria-hidden="true">
      <div className="pm-laptop-lid">
        <div className="pm-laptop-cam" />
        <div className="pm-laptop-screen">{children}</div>
      </div>
      <div className="pm-laptop-base"><span className="pm-laptop-notch" /></div>
    </div>
  );
}

export function Phone({ children, className = '' }) {
  return (
    <div className={`pm-phone ${className}`} aria-hidden="true">
      <div className="pm-phone-body">
        <span className="pm-phone-island" />
        <div className="pm-phone-screen">{children}</div>
      </div>
    </div>
  );
}

export function Tablet({ children, className = '' }) {
  return (
    <div className={`pm-tablet ${className}`} aria-hidden="true">
      <div className="pm-tablet-body">
        <div className="pm-tablet-screen">{children}</div>
      </div>
    </div>
  );
}
