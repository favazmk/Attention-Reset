import React, { useState, useEffect } from "react";
import ClickBox from "../components/ClickBox";
import FillLine from "../components/FillLine";
import DayProgressBar from "../components/DayProgressBar";
import Mascot, { PAGE_PATTERNS } from "../components/Mascot";
import confetti from "canvas-confetti";

export default function Day3({ data, updateData }) {
  const accent = "var(--day3)";
  const [triggered, setTriggered] = useState(false);

  const [showMissingAlert, setShowMissingAlert] = useState(false);

  const intensityDone = !!data.d3_level;
  const environmentDone = data.d3_c1 && data.d3_c2 && data.d3_c3;

  const getMissingTask = () => {
    if (!data.d3_level) return "Choose Your Intensity";
    if (!data.d3_c1) return "Check 'Close every browser tab'";
    if (!data.d3_c2) return "Check 'Put phone in drawer'";
    if (!data.d3_c3) return "Check 'Set your timer'";
    if (!data.d3_r1) return "Reflect: My one task was...";
    if (!data.d3_r2) return "Reflect: The hardest moment was...";
    if (!data.d3_r3) return "Select how you feel";
    return null;
  };
  const missingTask = getMissingTask();
  const allCompleted = !missingTask;

  const totalTasks = 7;
  const completedTasks = [
    !!data.d3_level,
    !!data.d3_c1,
    !!data.d3_c2,
    !!data.d3_c3,
    !!data.d3_r1,
    !!data.d3_r2,
    !!data.d3_r3,
  ].filter(Boolean).length;

  const handleFinishDay = () => {
    if (!allCompleted) {
      setShowMissingAlert(true);
      setTimeout(() => setShowMissingAlert(false), 3000);
      return;
    }
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    updateData("day3_finished", true);
  };
  const userStr = data.user_name ? data.user_name.trim().split(' ')[0] : '';
  const Name = userStr ? userStr.charAt(0).toUpperCase() + userStr.slice(1) : '';

  return (
    <div
      className="page-content"
      style={{ "--accent": accent, ...PAGE_PATTERNS.day3(accent) }}
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
          {Name ? `Time to go deep, ${Name}.` : "Day 3 OF 7"}
        </p>
        <h2 style={{ margin: 0, color: "var(--cream)" }}>
          The Monk
          <br />
          <em>Sprint</em>
        </h2>
      </div>

      <div className="day-rule" />

      <Mascot day="day3" />

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
          • <strong>Switching Cost</strong>: Every tab-switch or text-check kills 40% of your brainpower.<br/>
          • <strong>Energy Leaks</strong>: Multitasking is a lie; it's actually "rapid refocusing" that drains you.<br/>
          • <strong>One Task</strong>: Do one thing — completely — until the timer rings.
        </p>
      </div>

      <div className="reveal-timeline">
        <div className="reveal-node">
          {/* --- PHASE 1 --- */}
          <h3
            style={{
              fontSize: "1.2rem",
              color: accent,
              marginBottom: "1rem",
              borderLeft: `4px solid ${accent}`,
              paddingLeft: "12px",
            }}
          >
            PHASE 1: ENVIRONMENT SETUP
          </h3>

          <div
            style={{
              padding: "20px",
              background: "var(--dark-card)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.05)",
              marginBottom: "2rem",
            }}
          >
            <h4
              style={{
                color: "var(--cream)",
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "0.5px",
              }}
            >
              1. CHOOSE YOUR INTENSITY
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "10px",
                marginBottom: "2rem",
              }}
            >
              {[
                { id: "SPRINTER", time: "20 min", diff: "Easy" },
                { id: "RUNNER", time: "40 min", diff: "Medium" },
                { id: "MONK", time: "60 min", diff: "Hard" },
              ].map((level) => {
                const isSelected = data.d3_level === level.id;
                return (
                  <div
                    key={level.id}
                    onClick={() => updateData("d3_level", level.id)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor =
                          "rgba(74,158,191,0.5)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                    style={{
                      backgroundColor: "var(--bg)",
                      borderRadius: "6px",
                      padding: "1.25rem 0.75rem",
                      textAlign: "center",
                      cursor: "pointer",
                      border: isSelected
                        ? `2px solid ${accent}`
                        : "2px solid var(--border)",
                      transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                      boxShadow: isSelected
                        ? `0 0 18px -4px ${accent}66`
                        : "none",
                      transform: isSelected
                        ? "translateY(-2px)"
                        : "translateY(0)",
                      position: "relative",
                      userSelect: "none",
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          backgroundColor: accent,
                        }}
                      />
                    )}
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.75rem",
                        color: isSelected ? accent : "var(--cream)",
                        marginBottom: "0.4rem",
                        lineHeight: 1,
                      }}
                    >
                      {level.time}
                    </div>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: isSelected ? accent : "var(--muted)",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {level.id}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--muted)",
                        marginTop: "2px",
                        fontWeight: 300,
                      }}
                    >
                      {level.diff}
                    </div>
                  </div>
                );
              })}
            </div>

            {intensityDone && (
              <div className="reveal-section">
                <h4
                  style={{
                    color: "var(--cream)",
                    fontSize: "0.85rem",
                    marginBottom: "1rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  2. CLEAR THE DECK
                </h4>
                {[
                  {
                    id: "d3_c1",
                    text: "Close Tabs: Shut everything except your 1 primary work window.",
                  },
                  {
                    id: "d3_c2",
                    text: "Phone Jail: Move your phone to another room entirely.",
                  },
                  {
                    id: "d3_c3",
                    text: "The Countdown: Start your timer and don't touch it.",
                  },
                ].map((item) => (
                  <ClickBox
                    key={item.id}
                    id={item.id}
                    label={item.text}
                    checked={data[item.id] || false}
                    onChange={(v) => updateData(item.id, v)}
                    accentColor={accent}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="spacer-md" />

        {intensityDone && environmentDone && (
          <div className="reveal-section">
            <div className="reveal-node">
              {/* --- PHASE 2 --- */}
              <h3
                style={{
                  fontSize: "1.2rem",
                  color: accent,
                  marginBottom: "1rem",
                  borderLeft: `4px solid ${accent}`,
                  paddingLeft: "12px",
                }}
              >
                PHASE 2: SPRINT EXECUTION
              </h3>

              <div
                className="card"
                style={{
                  backgroundColor: "var(--mid-gray)",
                  marginBottom: "2rem",
                }}
              >
                <h4
                  style={{
                    color: accent,
                    fontSize: "0.75rem",
                    marginBottom: "8px",
                    letterSpacing: "1px",
                  }}
                >
                  THE ENTRY RITUAL (DO THIS FIRST)
                </h4>
                <p style={{ fontSize: "0.95rem" }}>
                  Put on headphones (even without music) or grab a glass of
                  water. This tells your brain:{" "}
                  <strong style={{ color: "var(--cream)" }}>
                    'The Sprint has started.'
                  </strong>{" "}
                  Repeat every session and it becomes automatic.
                </p>
              </div>

              <div
                style={{
                  border: `1px dashed ${accent}`,
                  borderRadius: "12px",
                  padding: "1.5rem",
                  background: "var(--bg)",
                }}
              >
                <h4
                  style={{
                    color: accent,
                    fontSize: "0.85rem",
                    marginBottom: "0.5rem",
                    letterSpacing: "1px",
                  }}
                >
                  THE PARKING LOT
                </h4>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--light-text)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Stray thought? Don't leave the task. Drop it here and keep
                  going.
                </p>

                {/* Condensed visual representation of parking lot */}
                {[
                  "e.g., Remember to text Mom",
                  "e.g., Buy milk on the way home",
                  "e.g., Check that email after this",
                ].map((placeholder, idx) => {
                  const i = idx + 1;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--border-c)",
                          fontSize: "0.85rem",
                          width: "16px",
                        }}
                      >
                        {i}.
                      </span>
                      <input
                        type="text"
                        value={data[`d3_park_${i}`] || ""}
                        onChange={(e) =>
                          updateData(`d3_park_${i}`, e.target.value)
                        }
                        placeholder={placeholder}
                        style={{
                          flex: 1,
                          background: "var(--dark-card)",
                          border: "1px solid var(--border-c)",
                          borderRadius: "6px",
                          color: "var(--cream)",
                          padding: "10px 12px",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = accent)}
                        onBlur={(e) =>
                          (e.target.style.borderColor = "var(--border-c)")
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="reveal-node">
              {/* --- PHASE 3 --- */}
              <h3
                style={{
                  fontSize: "1.2rem",
                  color: accent,
                  marginBottom: "1rem",
                  borderLeft: `4px solid ${accent}`,
                  paddingLeft: "12px",
                }}
              >
                PHASE 3: REFLECTION
              </h3>
              <p
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--light-text)",
                  fontSize: "0.9rem",
                }}
              >
                Fill this out immediately after your timer hits zero.
              </p>

              <div
                style={{
                  padding: "20px",
                  background: "var(--dark-card)",
                  borderRadius: "12px",
                }}
              >
                <FillLine
                  key="d3_r1"
                  id="d3_r1"
                  label="My one task was:"
                  value={data.d3_r1 || ""}
                  onChange={(v) => updateData("d3_r1", v)}
                  accentColor={accent}
                  placeholder="e.g., Drafting the project proposal"
                />
                <FillLine
                  key="d3_r2"
                  id="d3_r2"
                  label="The hardest moment was:"
                  value={data.d3_r2 || ""}
                  onChange={(v) => updateData("d3_r2", v)}
                  accentColor={accent}
                  placeholder="e.g., wanting to check mail so badly"
                />

                <label
                  className="fill-line-label"
                  style={{
                    color: accent,
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  I feel (select one):
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { label: "Productive", emoji: "⚡" },
                    { label: "Relieved", emoji: "😮‍💨" },
                    { label: "Tired", emoji: "😴" },
                    { label: "Surprised", emoji: "😯" },
                  ].map(({ label: feeling, emoji }) => {
                    const isSelected = data.d3_r3 === feeling;
                    return (
                      <div
                        key={feeling}
                        onClick={() => updateData("d3_r3", feeling)}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.borderColor = accent + "88";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.borderColor = "var(--border)";
                        }}
                        style={{
                          flex: 1,
                          minWidth: "100px",
                          textAlign: "center",
                          padding: "12px 8px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          userSelect: "none",
                          background: isSelected ? accent : "transparent",
                          color: isSelected ? "var(--bg)" : "var(--cream)",
                          border: isSelected
                            ? `2px solid ${accent}`
                            : "2px solid var(--border)",
                          fontWeight: isSelected ? 700 : 400,
                          fontSize: "0.875rem",
                          transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                          transform: isSelected
                            ? "translateY(-2px)"
                            : "translateY(0)",
                          boxShadow: isSelected
                            ? `0 4px 14px -4px ${accent}66`
                            : "none",
                        }}
                      >
                        <div
                          style={{ fontSize: "1.2rem", marginBottom: "4px" }}
                        >
                          {emoji}
                        </div>
                        {feeling}
                      </div>
                    );
                  })}
                </div>
              </div>

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
                  "The mind is not a vessel to be filled, but a fire to be
                  kindled."
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    letterSpacing: "1px",
                  }}
                >
                  - Plutarch
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="spacer-lg" />

      {!data.day3_finished ? (
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
            {Name ? Name + ', you' : 'You'} are someone capable of deep work. Day 3 done.
          </div>
        </div>
      )}
    </div>
  );
}
