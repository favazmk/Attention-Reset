import React, { useState } from "react";
import ClickBox from "../components/ClickBox";
import FillLine from "../components/FillLine";
import DayProgressBar from "../components/DayProgressBar";
import Mascot from "../components/Mascot";
import { PAGE_PATTERNS } from "../components/pagePatterns";
import confetti from "canvas-confetti";

export default function Day1({ data, updateData }) {
  const accent = "var(--day1)";
  const [showMissingAlert, setShowMissingAlert] = useState(false);

  const setupDone = data.d1_c0 && data.d1_c1 && data.d1_c2 && data.d1_c3;
  const challengeDone = data.d1_c4;
  const procrastinationDone = !!(data.d1_p1?.trim() || data.d1_p2?.trim() || data.d1_p3?.trim());

  const getMissingTask = () => {
    if (!data.d1_c0) return "Set Reminder";
    if (!data.d1_c1) return "Silence the Ghosts";
    if (!data.d1_c2) return "Go Greyscale";
    if (!data.d1_c3) return "Install 'one sec'";
    if (!data.d1_c4) return "Steadfast Attention Challenge";
    if (!data.d1_p1 && !data.d1_p2 && !data.d1_p3) return "List 1 procrastination task";
    if (!data.d1_mission_ack) return "Accept Mission";
    return null;
  };
  const missingTask = getMissingTask();
  const allCompleted = !missingTask;

  const totalTasks = 7;
  const completedTasks = [
    data.d1_c0,
    data.d1_c1,
    data.d1_c2,
    data.d1_c3,
    data.d1_c4,
    procrastinationDone,
    data.d1_mission_ack
  ].filter(Boolean).length;

  const handleFinishDay = () => {
    if (!allCompleted) {
      setShowMissingAlert(true);
      setTimeout(() => setShowMissingAlert(false), 3000);
      return;
    }
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    updateData("day1_finished", true);
  };
  const userStr = data.user_name ? data.user_name.trim().split(' ')[0] : '';
  const Name = userStr ? userStr.charAt(0).toUpperCase() + userStr.slice(1) : '';

  return (
    <div
      className="page-content"
      style={{ "--accent": accent, ...PAGE_PATTERNS.day1(accent) }}
    >
      <DayProgressBar
        current={completedTasks}
        total={totalTasks}
        accentColor={accent}
      />

      <div style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontSize: "0.85rem",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: accent,
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          {Name ? `Alright ${Name}, let's begin.` : "Day 1 OF 7"}
        </p>
        <h2 style={{ margin: 0, color: "var(--cream)" }}>
          The Digital
          <br />
          <em>Kill-Switch</em>
        </h2>
      </div>

      <div className="day-rule" />

      <Mascot day="day1" />

      <div className="card">
        <h4
          style={{
            color: accent,
            fontSize: "0.75rem",
            marginBottom: "8px",
            letterSpacing: "1px",
          }}
        >
          THE SCIENCE
        </h4>
        <p style={{ fontSize: "0.95rem", margin: 0 }}>
          • <strong>Stress Spike</strong>: Notifications trigger cortisol, keeping your brain in "high-alert" mode.<br/>
          • <strong>Anticipation</strong>: Your brain learns to expect interruption, making focus feel "wrong."<br/>
          • <strong>Hardware Hack</strong>: Stopping the pings is the only way to lower your baseline stress.
        </p>
      </div>

      <div className="reveal-timeline">
        <div className="reveal-node">
          <h4
            style={{
              color: accent,
              fontSize: "0.85rem",
              marginBottom: "1rem",
              letterSpacing: "1px",
            }}
          >
            THE 3-MINUTE STEALTH SETUP
          </h4>
          <p style={{ marginBottom: "1.5rem" }}>
            Open your phone. Do these 4 things right now:
          </p>

          <ClickBox
            id="d1_c0"
            label="Set a daily Attention reset reminder for the next 6 days."
            checked={data.d1_c0 || false}
            onChange={(v) => updateData("d1_c0", v)}
            accentColor={accent}
          />
          <ClickBox
            id="d1_c1"
            label="Silence the Ghosts: Turn OFF all unnecessary notifications."
            checked={data.d1_c1 || false}
            onChange={(v) => updateData("d1_c1", v)}
            accentColor={accent}
          />
          <ClickBox
            id="d1_c2"
            label="Go 40% Greyscale: Settings > Accessibility > Display (Set to 40%). Kills visual dopamine."
            checked={data.d1_c2 || false}
            onChange={(v) => updateData("d1_c2", v)}
            accentColor={accent}
          />
          <ClickBox
            id="d1_c3"
            label="Install 'one sec': Force friction onto every addictive app."
            checked={data.d1_c3 || false}
            onChange={(v) => updateData("d1_c3", v)}
            accentColor={accent}
          />
        </div>

        {setupDone && (
          <div className="reveal-section reveal-node">
            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "1px",
              }}
            >
              THE STEADFAST ATTENTION CHALLENGE
            </h4>
            <p style={{ marginBottom: "1.5rem" }}>
              Watch a 10+ minute useful YouTube video. But follow these rules:
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 2rem 0",
                color: "var(--cream)",
                fontSize: "0.95rem",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <span style={{ color: accent, marginRight: "8px" }}>•</span>No
                changing speed
              </li>
              <li style={{ marginBottom: "8px" }}>
                <span style={{ color: accent, marginRight: "8px" }}>•</span>No
                opening comments
              </li>
              <li style={{ marginBottom: "8px" }}>
                <span style={{ color: accent, marginRight: "8px" }}>•</span>No
                skipping
              </li>
              <li style={{ marginBottom: "8px" }}>
                <span style={{ color: accent, marginRight: "8px" }}>•</span>No
                switching apps
              </li>
            </ul>

            <ClickBox
              id="d1_c4"
              label="I successfully watched a 10+ min video without speeding it up or reading comments."
              checked={data.d1_c4 || false}
              onChange={(v) => updateData("d1_c4", v)}
              accentColor={accent}
            />
          </div>
        )}

        {setupDone && challengeDone && (
          <div className="reveal-section reveal-node">
            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "1px",
              }}
            >
              THE PROCRASTINATION DUMP
            </h4>
            <p style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              List 3 things you've been procrastinating on for a long time. We're going to clear this backlog.
            </p>

            <FillLine
              id="d1_p1"
              label="1."
              value={data.d1_p1 || ""}
              onChange={(v) => updateData("d1_p1", v)}
              accentColor={accent}
              placeholder="e.g., Fixing that leaky faucet / Cleaning my inbox"
            />
            <FillLine
              id="d1_p2"
              label="2."
              value={data.d1_p2 || ""}
              onChange={(v) => updateData("d1_p2", v)}
              accentColor={accent}
              placeholder="e.g., Researching that course I wanted to take"
            />
            <FillLine
              id="d1_p3"
              label="3."
              value={data.d1_p3 || ""}
              onChange={(v) => updateData("d1_p3", v)}
              accentColor={accent}
              placeholder="e.g., Calling that old friend"
            />

            <div className="spacer-md" />

            {procrastinationDone && (
              <div className="reveal-section reveal-node">
                <h4
                  style={{
                    color: accent,
                    fontSize: "0.85rem",
                    marginBottom: "1rem",
                    letterSpacing: "1px",
                  }}
                >
                  MISSION
                </h4>
                <div style={{ 
                  padding: '24px', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '12px', 
                  border: `1px dashed ${accent}44`,
                  marginBottom: '2rem'
                }}>
                  <p style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 600, 
                    color: accent, 
                    marginBottom: '0.6rem',
                    fontFamily: 'var(--font-serif)'
                  }}>
                    Your observation starts now.
                  </p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--cream)', lineHeight: '1.6', marginBottom: '1.2rem' }}>
                    Today, notice one thing you usually ignore. <br />
                    The silence, a taste, or the urge to reach for your phone. <br /><br />
                    <strong>Just notice it. Record it tomorrow.</strong>
                  </p>
                  
                  <ClickBox
                    id="d1_mission_ack"
                    label="I accept my observation mission."
                    checked={data.d1_mission_ack || false}
                    onChange={(v) => updateData("d1_mission_ack", v)}
                    accentColor={accent}
                  />
                </div>
              </div>
            )}

            <div className="spacer-lg" />

            <div
              style={{
                borderLeft: "1px solid var(--border)",
                paddingLeft: "1.25rem",
                margin: "2rem 0",
              }}
            >
              <p
                style={{
                  fontStyle: "italic",
                  color: accent,
                  fontSize: "0.95rem",
                  marginBottom: "0.4rem",
                }}
              >
                "Almost everything will work again if you unplug it for a few
                minutes. Including you."
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  letterSpacing: "1px",
                }}
              >
                - Anne Lamott
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="spacer-lg" />

      {!data.day1_finished ? (
        <div style={{ marginTop: '2rem' }}>
          {showMissingAlert && (
            <div className="missing-task-alert">
              ⚠️ Finish "{missingTask}" first
            </div>
          )}
          <button
            className={`finish-day-btn ${allCompleted ? "btn-shine" : "incomplete"}`}
            onClick={handleFinishDay}
          >
            I did it all
          </button>
        </div>
      ) : (
        <div className="identity-lock">
          <div className="identity-lock-title">Identity Check</div>
          <div className="identity-lock-text">
            {Name ? Name + ', you' : 'You'} are someone who values intention over impulse. Day 1 done.
          </div>
        </div>
      )}
    </div>
  );
}
