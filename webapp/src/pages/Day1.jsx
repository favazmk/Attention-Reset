import React, { useState, useEffect } from "react";
import ClickBox from "../components/ClickBox";
import FillLine from "../components/FillLine";
import DayProgressBar from "../components/DayProgressBar";
import Mascot, { PAGE_PATTERNS } from "../components/Mascot";
import confetti from "canvas-confetti";

export default function Day1({ data, updateData }) {
  const accent = "var(--day1)";
  const [triggered, setTriggered] = useState(false);
  const [showMissingAlert, setShowMissingAlert] = useState(false);

  const setupDone = data.d1_c0 && data.d1_c1 && data.d1_c2 && data.d1_c3;
  const challengeDone = data.d1_c4;

  const getMissingTask = () => {
    if (!data.d1_c0) return "Set Reminder";
    if (!data.d1_c1) return "Silence the Ghosts";
    if (!data.d1_c2) return "Go Greyscale";
    if (!data.d1_c3) return "Install 'one sec'";
    if (!data.d1_c4) return "Steadfast Attention Challenge";
    if (!data.d1_reflection) return "Reflection";
    return null;
  };
  const missingTask = getMissingTask();
  const allCompleted = !missingTask;

  const totalTasks = 6;
  const completedTasks = [
    data.d1_c0,
    data.d1_c1,
    data.d1_c2,
    data.d1_c3,
    data.d1_c4,
    !!data.d1_reflection
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
              REFLECTION
            </h4>
            <p style={{ marginBottom: "1.5rem" }}>
              With fewer notifications today, what was one thing you actually{" "}
              <i>noticed</i> in the real world?
            </p>

            <FillLine
              id="d1_reflection"
              label=""
              value={data.d1_reflection || ""}
              onChange={(v) => updateData("d1_reflection", v)}
              lines={3}
              accentColor={accent}
              placeholder="e.g., I noticed the hum of the refrigerator for the first time."
            />

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
