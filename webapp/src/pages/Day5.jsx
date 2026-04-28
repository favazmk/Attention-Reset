import React, { useState } from "react";
import ClickBox from "../components/ClickBox";
import FillLine from "../components/FillLine";
import DayProgressBar from "../components/DayProgressBar";
import Mascot, { PAGE_PATTERNS } from "../components/Mascot";
import confetti from "canvas-confetti";

export default function Day5({ data, updateData }) {
  const accent = "var(--day5)";

  const [showMissingAlert, setShowMissingAlert] = useState(false);

  const getMissingTask = () => {
    if (!data.d5_c1) return "Check Phase 1 Rule 1";
    if (!data.d5_c2) return "Check Phase 1 Rule 2";
    if (!data.d5_c3) return "Check Phase 1 Rule 3";
    if (!data.d5_r1) return "Fill Phase 2 Step 1";
    if (!data.d5_r2) return "Fill Phase 2 Step 2";
    if (!data.d5_r3) return "Fill Phase 2 Step 3";
    if (!data.d5_reflection) return "Reflection";
    return null;
  };
  const missingTask = getMissingTask();
  const allCompleted = !missingTask;

  const totalTasks = 7;
  const completedTasks = [
    !!data.d5_c1,
    !!data.d5_c2,
    !!data.d5_c3,
    !!data.d5_r1,
    !!data.d5_r2,
    !!data.d5_r3,
    !!data.d5_reflection,
  ].filter(Boolean).length;

  const sweepDone = data.d5_c1 && data.d5_c2 && data.d5_c3;
  const ritualDone = !!data.d5_r1 && !!data.d5_r2 && !!data.d5_r3;

  const handleFinishDay = () => {
    if (!allCompleted) {
      setShowMissingAlert(true);
      setTimeout(() => setShowMissingAlert(false), 3000);
      return;
    }
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    updateData("day5_finished", true);
  };
  const userStr = data.user_name ? data.user_name.trim().split(' ')[0] : '';
  const Name = userStr ? userStr.charAt(0).toUpperCase() + userStr.slice(1) : '';

  return (
    <div
      className="page-content"
      style={{ "--accent": accent, ...PAGE_PATTERNS.day5(accent) }}
    >
      <DayProgressBar
        current={completedTasks}
        total={totalTasks}
        accentColor={accent}
      />

      <div className="spacer-sm" />

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
          {Name ? `Build your walls, ${Name}.` : "Day 5 OF 7"}
        </p>
        <h2 style={{ margin: 0, color: "var(--cream)" }}>
          The
          <br />
          <em>Fortress</em>
        </h2>
      </div>
      
      <div className="day-rule" />

      <Mascot day="day5" />

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
          • <strong>Energy Management</strong>: Willpower is a finite battery. Stop fighting against your environment.<br/>
          • <strong>Choice Architecture</strong>: Change your physical space so your brain defaults to work instead of distraction.<br/>
          • <strong>The Goal</strong>: Build a fortress where focus is the path of least resistance.
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
            THE 3-POINT SWEEP
          </h4>

          {[
            {
              id: "d5_c1",
              title: "VISUAL SILENCE",
              desc: "Clear your desk of everything except 1 tool and 1 drink.",
            },
            {
              id: "d5_c2",
              title: "THE DIGITAL MOAT",
              desc: "Lock your top 3 distraction sites for the next 2 hours.",
            },
            {
              id: "d5_c3",
              title: "THE OUT-OF-SIGHT RULE",
              desc: "Move your phone to a different room; even face-down, it steals brainpower.",
            },
          ].map((item) => (
            <div key={item.id} style={{ marginBottom: "1rem" }}>
              <ClickBox
                id={item.id}
                label={item.title}
                checked={data[item.id] || false}
                onChange={(v) => updateData(item.id, v)}
                accentColor={accent}
              />
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--light-text)",
                  paddingLeft: "44px",
                  marginTop: "-8px",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {sweepDone && (
          <div className="reveal-section reveal-node">
            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "1px",
              }}
            >
              THE FOCUS ANCHOR
            </h4>
            <div className="card">
              <h4
                style={{
                  color: accent,
                  fontSize: "0.75rem",
                  marginBottom: "8px",
                  letterSpacing: "1px",
                }}
              >
                BUILD A SENSORY TRIGGER
              </h4>
              <p style={{ fontSize: "0.95rem" }}>
                Choose one scent (candle), playlist (lo-fi / white noise), or
                drink.{" "}
                <strong style={{ color: "var(--cream)" }}>
                  Use it ONLY in Fortress Mode.
                </strong>{" "}
                Your brain associates it with 'Go Time' within 2 weeks.
              </p>
            </div>

            <div className="spacer-lg" />

            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "1px",
              }}
            >
              MY 3-STEP FOCUS RITUAL
            </h4>

            <FillLine
              id="d5_r1"
              label="Step 1:"
              value={data.d5_r1 || ""}
              onChange={(v) => updateData("d5_r1", v)}
              accentColor={accent}
              placeholder="e.g., Put on noise-cancelling headphones"
            />
            <FillLine
              id="d5_r2"
              label="Step 2:"
              value={data.d5_r2 || ""}
              onChange={(v) => updateData("d5_r2", v)}
              accentColor={accent}
              placeholder="e.g., Place phone in the kitchen drawer"
            />
            <FillLine
              id="d5_r3"
              label="Step 3:"
              value={data.d5_r3 || ""}
              onChange={(v) => updateData("d5_r3", v)}
              accentColor={accent}
              placeholder="e.g., Sip black coffee"
            />
          </div>
        )}

        {sweepDone && ritualDone && (
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
              What is the #1 item in your environment that tricks you into
              procrastinating? How did you neutralize it today?
            </p>

            <FillLine
              id="d5_reflection"
              label="Your answer:"
              value={data.d5_reflection || ""}
              onChange={(v) => updateData("d5_reflection", v)}
              lines={2}
              accentColor={accent}
              placeholder="e.g., My Xbox controller. I put it in the closet before starting."
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
                "Environment is the invisible hand that shapes human behaviour."
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  letterSpacing: "1px",
                }}
              >
                - James Clear
              </p>
            </div>
            <div className="spacer-md" />
          </div>
        )}
      </div>

      <div className="spacer-lg" />

      {!data.day5_finished ? (
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
            {Name ? Name + ', you' : 'You'} are someone who engineers their environment. Day 5 done.
          </div>
        </div>
      )}
    </div>
  );
}
