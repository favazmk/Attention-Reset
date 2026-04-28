import React, { useState, useEffect } from "react";
import ClickBox from "../components/ClickBox";
import FillLine from "../components/FillLine";
import DayProgressBar from "../components/DayProgressBar";
import Mascot, { PAGE_PATTERNS } from "../components/Mascot";
import confetti from "canvas-confetti";

export default function Day2({ data, updateData }) {
  const accent = "var(--day2)";
  const [triggered, setTriggered] = useState(false);

  const assassins = [
    { id: "d2_a1", text: "Instagram / TikTok / Reels scrolling" },
    { id: "d2_a2", text: "Email refresh (the infinite F5)" },
    {
      id: "d2_a3",
      text: 'The "quick" news / weather check that turns into 30 minutes',
    },
    { id: "d2_a4", text: "Desktop notification pings" },
    { id: "d2_a5", text: 'The "I\'ll just look this up" Google rabbit hole' },
    { id: "d2_a6", text: "YouTube autoplay" },
    { id: "d2_a7", text: "WhatsApp group chats" },
    { id: "d2_a8", text: "People interrupting while you work" },
  ];

  const completedChecks = assassins.filter((a) => data[a.id]).length;
  // Require at least 1 check to progress the reveal logic
  const assassinsDone = completedChecks > 0;

  const getMissingTask = () => {
    if (!data.d2_ref_1) return "Estimate how many hours you lose";
    if (!data.d2_ref_3) return "Identify your peak flow activity";
    if (!data.d2_ref_2) return "Reflect on what you would do with that time";
    return null;
  };
  const missingTask = getMissingTask();
  const allCompleted = !missingTask;

  const totalTasks = 4;
  const completedTasks = [
    completedChecks > 0,
    !!data.d2_ref_1,
    !!data.d2_ref_3,
    !!data.d2_ref_2,
  ].filter(Boolean).length;

  const [showMissingAlert, setShowMissingAlert] = useState(false);

  const handleFinishDay = () => {
    if (!allCompleted) {
      setShowMissingAlert(true);
      setTimeout(() => setShowMissingAlert(false), 3000);
      return;
    }
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    updateData("day2_finished", true);
  };
  const userStr = data.user_name ? data.user_name.trim().split(' ')[0] : '';
  const Name = userStr ? userStr.charAt(0).toUpperCase() + userStr.slice(1) : '';

  return (
    <div
      className="page-content"
      style={{ "--accent": accent, ...PAGE_PATTERNS.day2(accent) }}
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
          {Name ? `Let's find your leaks, ${Name}.` : "Day 2 OF 7"}
        </p>
        <h2 style={{ margin: 0, color: "var(--cream)" }}>
          The Snap
          <br />
          <em>Audit</em>
        </h2>
      </div>

      <div className="day-rule" />

      <Mascot day="day2" />

      <div className="card">
        <h4
          style={{
            color: accent,
            fontSize: "0.75rem",
            marginBottom: "8px",
            letterSpacing: "1px",
          }}
        >
          THE STAT THAT CHANGES EVERYTHING
        </h4>
        <p style={{ fontSize: "0.95rem" }}>
          <span style={{ color: accent, fontWeight: "bold" }}>
            Every interruption costs 23 minutes of focus recovery.
          </span>{" "}
          Most people interrupt themselves every 3 minutes — meaning they never
          actually reach deep focus at all.
        </p>
      </div>

      <div className="reveal-timeline">
        <div className="reveal-node">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              YOUR ATTENTION ASSASSINS
            </h4>
            <span style={{ fontSize: "0.75rem", color: "var(--light-text)" }}>
              {completedChecks} / 8 Found
            </span>
          </div>

          <p style={{ marginBottom: "1.5rem" }}>
            Check everything that stole your time in the last 48 hours:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "8px",
            }}
          >
            {assassins.map((item) => (
              <ClickBox
                key={item.id}
                id={item.id}
                label={item.text}
                checked={data[item.id] || false}
                onChange={(v) => updateData(item.id, v)}
                accentColor={accent}
                small={true}
              />
            ))}
          </div>
        </div>

        {assassinsDone && (
          <div className="reveal-section reveal-node">
            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "1px",
              }}
            >
              THE 60-SECOND POWER MOVE
            </h4>
            <div className="card" style={{ backgroundColor: "#1A1800" }}>
              <h4
                style={{
                  color: accent,
                  fontSize: "0.75rem",
                  marginBottom: "8px",
                  letterSpacing: "1px",
                }}
              >
                THE INSTANT WIN
              </h4>
              <p style={{ fontSize: "0.95rem" }}>
                Flip your phone face down and move it to the other side of the
                room.{" "}
                <strong style={{ color: "var(--cream)" }}>
                  Done? You just improved your focus by ~20%.
                </strong>{" "}
                Research shows even a phone face-down on your desk consumes
                working memory — just by existing.
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
              REFLECTION
            </h4>
            <div
              style={{
                padding: "16px",
                background: "var(--mid-gray)",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              <h5 style={{ color: "var(--cream)", marginBottom: "1rem", fontSize: "1.1rem" }}>
                How many hours/day do you lose to these distractions?
              </h5>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "1.5rem",
                }}
              >
                {["<1 H", "1–2 H", "3–4 H", "4+ H"].map((opt) => {
                  const isSelected = data.d2_ref_1 === opt;

                  const baseBg = isSelected
                    ? accent
                    : "rgba(255, 255, 255, 0.05)";
                  const hoverBg = isSelected
                    ? accent
                    : "rgba(255, 255, 255, 0.08)";

                  const baseBorder = isSelected
                    ? accent
                    : "rgba(255, 255, 255, 0.12)";
                  const hoverBorder = isSelected ? accent : accent;

                  const baseShadow = isSelected
                    ? `0 0 10px ${accent}40`
                    : "0 2px 4px rgba(0,0,0,0.1)";
                  const hoverShadow = isSelected
                    ? `0 0 15px ${accent}60`
                    : "0 4px 12px rgba(0,0,0,0.2)";

                  return (
                    <button
                      key={opt}
                      onClick={() => updateData("d2_ref_1", opt)}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = hoverBorder;
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.backgroundColor = hoverBg;
                          e.currentTarget.style.boxShadow = hoverShadow;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = baseBorder;
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.backgroundColor = baseBg;
                          e.currentTarget.style.boxShadow = baseShadow;
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "12px 10px",
                        backgroundColor: baseBg,
                        color: isSelected ? "var(--bg)" : "var(--cream)",
                        border: `1px solid ${baseBorder}`,
                        borderRadius: "6px",
                        boxShadow: baseShadow,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: isSelected ? "bold" : "normal",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <FillLine
                id="d2_ref_3"
                label="The Time Expansion: Which specific distraction if removed today would make you feel like you've unlocked a 26-hour day?"
                value={data.d2_ref_3 || ""}
                onChange={(v) => updateData("d2_ref_3", v)}
                accentColor={accent}
                placeholder="e.g., No Instagram scrolling until 6 PM"
              />

              <div className="spacer-sm" />

              <FillLine
                id="d2_ref_2"
                label="If I reclaimed those wasted hours, I would finally have time to:"
                value={data.d2_ref_2 || ""}
                onChange={(v) => updateData("d2_ref_2", v)}
                accentColor={accent}
                placeholder="e.g., Read 3 chapters of my book"
              />
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
                "What you pay attention to is what becomes your life."
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  letterSpacing: "1px",
                }}
              >
                - Winifred Gallagher
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="spacer-lg" />

      {!data.day2_finished ? (
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
            {Name ? Name + ', you' : 'You'} are someone who sees their time clearly. Day 2 done.
          </div>
        </div>
      )}
    </div>
  );
}
