import React, { useState } from "react";
import FillLine from "../components/FillLine";
import DayProgressBar from "../components/DayProgressBar";
import Mascot from "../components/Mascot";
import { PAGE_PATTERNS } from "../components/pagePatterns";
import confetti from "canvas-confetti";

export default function Day4({ data, updateData }) {
  const accent = "var(--day4)";

  const [showMissingAlert, setShowMissingAlert] = useState(false);

  const getMissingTask = () => {
    if (!data.d4_sprint_1_done) return "Complete Sprint 1";
    if (!data.d4_score_1) return "Score Sprint 1";
    if (!data.d4_best_sprint)
      return "Fill 'My highest focus score was Sprint #'";
    if (!data.d4_r1) return "Fill 'this tells me I'm sharpest at...'";
    if (!data.d4_r2) return "Fill 'What distracted me most today'";
    return null;
  };
  const missingTask = getMissingTask();
  const allCompleted = !missingTask;

  const totalTasks = 5;
  const completedTasks = [
    !!data.d4_sprint_1_done,
    !!data.d4_score_1,
    !!data.d4_best_sprint,
    !!data.d4_r1,
    !!data.d4_r2,
  ].filter(Boolean).length;

  const sprint1Done = data.d4_sprint_1_done && data.d4_score_1;

  const handleFinishDay = () => {
    if (!allCompleted) {
      setShowMissingAlert(true);
      setTimeout(() => setShowMissingAlert(false), 3000);
      return;
    }
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    updateData("day4_finished", true);
  };
  const userStr = data.user_name ? data.user_name.trim().split(' ')[0] : '';
  const Name = userStr ? userStr.charAt(0).toUpperCase() + userStr.slice(1) : '';

  return (
    <div
      className="page-content"
      style={{ "--accent": accent, ...PAGE_PATTERNS.day4(accent) }}
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
          {Name ? `Let's level up, ${Name}.` : "Day 4 OF 7"}
        </p>
        <h2 style={{ margin: 0, color: "var(--cream)" }}>
          The Focus
          <br />
          <em>Sprints</em>
        </h2>
      </div>

      <div className="day-rule" />

      <Mascot day="day4" />

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
          • <strong>The 100kg Error</strong>: Attempting 2-hour sessions on Day 1 is why most people fail and burn out.<br/>
          • <strong>Brain Interval Training</strong>: Like a muscle, your focus needs "sets" and "rest" to grow without injury.<br/>
          • <strong>The 25/5 Method</strong>: Focus for 25 mins, flush the cache for 5. Repeat until you win the day.
        </p>
      </div>

      <div className="spacer-lg" />
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
            THE 25/5 GAME — 4 ROUNDS
          </h4>
          <p style={{ marginBottom: "1.5rem" }}>
            Start with completing 1 sprint. Score your focus after each:
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "2rem",
            }}
          >
            {[1, 2, 3, 4].map((sprint) => {
              const isDisabled =
                sprint > 1 && !data[`d4_sprint_${sprint - 1}_done`];

              return (
                <div
                  key={sprint}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--dark-card)",
                    padding: "16px",
                    borderRadius: "12px",
                    border: `1px solid ${data[`d4_sprint_${sprint}_done`] ? accent : "rgba(255,255,255,0.05)"}`,
                    opacity: isDisabled ? 0.3 : 1,
                    pointerEvents: isDisabled ? "none" : "auto",
                    transition: "border 0.2s, opacity 0.3s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      onClick={() =>
                        !isDisabled &&
                        updateData(
                          `d4_sprint_${sprint}_done`,
                          !data[`d4_sprint_${sprint}_done`],
                        )
                      }
                      style={{
                        width: "24px",
                        height: "24px",
                        border: `2px solid ${accent}`,
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        background: data[`d4_sprint_${sprint}_done`]
                          ? accent
                          : "var(--bg)",
                        transition: "all 0.2s",
                      }}
                    >
                      {data[`d4_sprint_${sprint}_done`] && (
                        <div
                          style={{
                            color: "var(--bg)",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                        Sprint {sprint}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--light-text)",
                        }}
                      >
                        25 min focus + 5 min break
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--light-text)" }}
                    >
                      Score:
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={data[`d4_score_${sprint}`] || ""}
                      onChange={(e) => {
                        const val = Math.min(
                          10,
                          Math.max(1, parseInt(e.target.value) || 1),
                        );
                        updateData(
                          `d4_score_${sprint}`,
                          e.target.value === "" ? "" : val,
                        );
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key))
                          e.preventDefault();
                      }}
                      min="1"
                      max="10"
                      disabled={isDisabled}
                      placeholder="/10"
                      style={{
                        width: "50px",
                        background: "var(--bg)",
                        border: `1px solid var(--muted)`,
                        color: "var(--cream)",
                        padding: "8px",
                        borderRadius: "6px",
                        textAlign: "center",
                        outline: "none",
                        fontSize: "0.9rem",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = accent)}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--muted)")
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {sprint1Done && (
          <div className="reveal-section reveal-node">
            <div className="card" style={{ backgroundColor: "rgba(245, 200, 66, 0.08)", borderColor: "rgba(245, 200, 66, 0.2)" }}>
              <h4
                style={{
                  color: accent,
                  fontSize: "0.75rem",
                  marginBottom: "8px",
                  letterSpacing: "1px",
                }}
              >
                THE BREAK PROTOCOL
              </h4>
              <p style={{ fontSize: "0.95rem", margin: 0 }}>
                • <strong>The Golden Rule</strong>: DO NOT check your phone. Walking or stretching is a reset; checking your phone is a 15-minute re-focus penalty.<br/>
                • <strong>20-20-20 Reset</strong>: Look 20ft away for 20 seconds. Kills screen fatigue and lowers cortisol instantly.
              </p>
            </div>

            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "1px",
              }}
            >
              THE PEAK FINDER
            </h4>

            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "1rem",
                  color: "var(--cream)",
                  fontSize: "0.95rem",
                }}
              >
                My highest focus score was Sprint #
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={data.d4_best_sprint || ""}
                  onChange={(e) => {
                    const val = Math.min(
                      10,
                      Math.max(1, parseInt(e.target.value) || 1),
                    );
                    updateData(
                      "d4_best_sprint",
                      e.target.value === "" ? "" : val,
                    );
                  }}
                  style={{
                    width: "45px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--cream)",
                    padding: "6px",
                    textAlign: "center",
                    borderRadius: "4px",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = accent)}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key))
                      e.preventDefault();
                  }}
                />
              </div>
              <FillLine
                id="d4_r1"
                label="— this tells me I'm sharpest at:"
                value={data.d4_r1 || ""}
                onChange={(v) => updateData("d4_r1", v)}
                accentColor={accent}
                placeholder="e.g., Early morning, right after coffee"
              />
            </div>
            <FillLine
              id="d4_r2"
              label="What distracted me most today:"
              value={data.d4_r2 || ""}
              onChange={(v) => updateData("d4_r2", v)}
              accentColor={accent}
              placeholder="e.g., Group chat notifications"
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
                "You will never reach your destination if you stop and throw
                stones at every dog that barks."
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  letterSpacing: "1px",
                }}
              >
                - Winston Churchill
              </p>
            </div>
            <div className="spacer-md" />
          </div>
        )}
      </div>

      <div className="spacer-lg" />

      {!data.day4_finished ? (
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
            {Name ? Name + ', you' : 'You'} are someone who builds mental endurance. Day 4 done.
          </div>
        </div>
      )}
    </div>
  );
}
