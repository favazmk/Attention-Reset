import React, { useState } from "react";
import FillLine from "../components/FillLine";
import DayProgressBar from "../components/DayProgressBar";
import Mascot from "../components/Mascot";
import { PAGE_PATTERNS } from "../components/pagePatterns";
import confetti from "canvas-confetti";

export default function Day7({ data, updateData }) {
  const accent = "var(--day7)";

  const [showMissingAlert, setShowMissingAlert] = useState(false);

  const getMissingTask = () => {
    if (!data.d7_r1) return "Fill: The Morning Rule";
    if (!data.d7_r2) return "Fill: The Deep Work Rule";
    if (!data.d7_r3) return "Fill: The Shutdown Rule";
    if (data.d1_total_score === undefined || data.d1_total_score === "")
      return "Fill: Day 1 Urge Score";
    if (data.d7_total_score === undefined || data.d7_total_score === "")
      return "Fill: Day 7 Urge Score";
    if (!data.d7_vision) return "Fill: The 30-Day Vision";
    if (!data.d7_testimonial_tags) return "Select: What changed";
    if (!data.d7_testimonial) return "Fill: Your Response";
    if (!data.d7_testimonial_before) return "Fill: Before Experience";
    if (!data.d7_testimonial_after) return "Fill: After Experience";
    return null;
  };
  const missingTask = getMissingTask();
  const allCompleted = !missingTask;

  const totalTasks = 10;
  const completedTasks = [
    !!data.d7_r1,
    !!data.d7_r2,
    !!data.d7_r3,
    data.d1_total_score !== undefined && data.d1_total_score !== "",
    data.d7_total_score !== undefined && data.d7_total_score !== "",
    !!data.d7_vision,
    !!data.d7_testimonial_tags,
    !!data.d7_testimonial,
    !!data.d7_testimonial_before,
    !!data.d7_testimonial_after,
  ].filter(Boolean).length;

  const osDone = !!data.d7_r1 && !!data.d7_r2 && !!data.d7_r3;
  const scoreDone =
    data.d1_total_score !== undefined &&
    data.d1_total_score !== "" &&
    data.d7_total_score !== undefined &&
    data.d7_total_score !== "";

  const handleFinishDay = () => {
    if (!allCompleted) {
      setShowMissingAlert(true);
      setTimeout(() => setShowMissingAlert(false), 3000);
      return;
    }
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    updateData("day7_finished", true);
  };

  const d1Score = parseInt(data.d1_total_score);
  const d7Score = parseInt(data.d7_total_score);
  const showImprovement = !isNaN(d1Score) && !isNaN(d7Score) && d1Score > 0;
  const improvement = showImprovement
    ? Math.round(((d1Score - d7Score) / d1Score) * 100)
    : null;
  const userStr = data.user_name ? data.user_name.trim().split(' ')[0] : '';
  const Name = userStr ? userStr.charAt(0).toUpperCase() + userStr.slice(1) : '';

  return (
    <div
      className="page-content"
      style={{ "--accent": accent, ...PAGE_PATTERNS.day7(accent) }}
    >
      <DayProgressBar current={completedTasks} total={totalTasks} accentColor={accent} />

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
          {Name ? `Your legacy system, ${Name}.` : "Day 7 OF 7"}
        </p>
        <h2 style={{ margin: 0, color: "var(--cream)" }}>
          The Attention
          <br />
          <em>OS</em>
        </h2>
      </div>
      
      <div className="day-rule" />

      <Mascot day="day7" />

      <div className="card" style={{ backgroundColor: "#1A1200" }}>
        <h4
          style={{
            color: accent,
            fontSize: "0.75rem",
            marginBottom: "8px",
            letterSpacing: "1px",
          }}
        >
          THE AUTOMATION SECRET
        </h4>
        <p style={{ fontStyle: "italic", color: accent, marginBottom: "8px" }}>
          "You don't rise to the level of your goals - you fall to the level of
          your systems." - James Clear
        </p>
        <p style={{ fontSize: "0.95rem" }}>
          Today we stop <i>trying</i> to focus and start <i>defaulting</i> to
          it. We set the rules so your brain doesn't have to decide every
          morning.
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
            YOUR ATTENTION OPERATING SYSTEM
          </h4>
          <p style={{ marginBottom: "1.5rem" }}>Fill in your 3 Core Rules:</p>

          {[
            {
              id: "d7_r1",
              title: "THE MORNING RULE",
              prompt: "I will not touch my phone until:",
              placeholder: "e.g., I finish my first glass of water",
            },
            {
              id: "d7_r2",
              title: "THE DEEP WORK RULE",
              prompt: "Time of my daily Monk Sprint:",
              placeholder: "e.g., 8:00 AM - 9:00 AM",
            },
            {
              id: "d7_r3",
              title: "THE SHUTDOWN RULE",
              prompt: "Time my phone goes to charging jail:",
              placeholder: "e.g., 9:00 PM",
            },
          ].map((rule) => (
            <div key={rule.id} style={{ marginBottom: "1.5rem" }}>
              <h5
                style={{
                  color: accent,
                  fontSize: "0.8rem",
                  letterSpacing: "1px",
                  marginBottom: "4px",
                }}
              >
                {rule.title}
              </h5>
              <FillLine
                id={rule.id}
                label={rule.prompt}
                value={data[rule.id] || ""}
                onChange={(v) => updateData(rule.id, v)}
                accentColor={accent}
                placeholder={rule.placeholder}
              />
            </div>
          ))}
        </div>
        <div className="spacer-lg" />

        {osDone && (
          <div className="reveal-section reveal-node">
            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "1px",
              }}
            >
              THE BEFORE VS. AFTER
            </h4>

            <div style={{ display: "flex", gap: "16px", marginBottom: "1rem" }}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: "var(--card)",
                  padding: "16px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                }}
              >
                <h5
                  style={{
                    color: accent,
                    fontSize: "0.85rem",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Day 1 Urge to Check Phone
                </h5>
                <input
                  type="number"
                  value={data["d1_total_score"] || ""}
                  onChange={(e) =>
                    updateData(
                      "d1_total_score",
                      Math.max(0, parseInt(e.target.value) || 0) || "",
                    )
                  }
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key))
                      e.preventDefault();
                  }}
                  min="0"
                  placeholder="e.g., 24"
                  style={{
                    width: "100%",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--cream)",
                    padding: "10px 8px",
                    borderRadius: "4px",
                    textAlign: "center",
                    outline: "none",
                    fontSize: "1.1rem",
                    fontFamily: "var(--font-display)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = accent)}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: "var(--card)",
                  padding: "16px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                }}
              >
                <h5
                  style={{
                    color: accent,
                    fontSize: "0.85rem",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Day 7 Urge to Check Phone
                </h5>
                <input
                  type="number"
                  value={data["d7_total_score"] || ""}
                  onChange={(e) =>
                    updateData(
                      "d7_total_score",
                      Math.max(0, parseInt(e.target.value) || 0) || "",
                    )
                  }
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key))
                      e.preventDefault();
                  }}
                  min="0"
                  placeholder="e.g., 8"
                  style={{
                    width: "100%",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--cream)",
                    padding: "10px 8px",
                    borderRadius: "4px",
                    textAlign: "center",
                    outline: "none",
                    fontSize: "1.1rem",
                    fontFamily: "var(--font-display)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = accent)}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>

            {showImprovement && (
              <div
                style={{
                  textAlign: "center",
                  background: "rgba(255, 140, 0, 0.1)",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: `1px solid ${accent}`,
                }}
              >
                <strong style={{ color: accent, fontSize: "1.1rem" }}>
                  {improvement > 0
                    ? `You improved by ${improvement}%!`
                    : "Progress is progress. You stayed with it!"}
                </strong>
              </div>
            )}

            <div className="spacer-lg" />
          </div>
        )}

        {osDone && scoreDone && (
          <div className="reveal-section reveal-node">
            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "1px",
              }}
            >
              THE 30-DAY VISION
            </h4>
            <p style={{ marginBottom: "1.5rem", fontStyle: "italic" }}>
              "If I maintain this system for 30 days, the one massive project I will finally finish is:"
            </p>

            <FillLine
              id="d7_vision"
              label=""
              value={data.d7_vision || ""}
              onChange={(v) => updateData("d7_vision", v)}
              lines={2}
              accentColor={accent}
              placeholder="e.g., Finally launch my side hustle's landing page."
            />
            <div className="spacer-md" />
          </div>
        )}

        {osDone && scoreDone && !!data.d7_vision && (
          <div className="reveal-section reveal-node">
            <h4
              style={{
                color: accent,
                fontSize: "0.85rem",
                marginBottom: "1rem",
                letterSpacing: "1px",
              }}
            >
              YOUR EXPERIENCE
            </h4>
            
            <p style={{ fontFamily: "var(--font-body)", fontWeight: "600", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              You finished all 7 days. What changed for you?
            </p>

            {/* Quick Select */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "2rem", marginTop: "1rem" }}>
              {[
                "I can focus better",
                "I finish what I start",
                "I feel more in control",
                "Less distracted",
              ].map((tag) => {
                const currentTags = (data.d7_testimonial_tags || "").split('|').filter(Boolean);
                const isSelected = currentTags.includes(tag);
                return (
                  <button
                    key={tag}
                    className="tag-btn"
                    onClick={() => {
                      if (isSelected) {
                        updateData("d7_testimonial_tags", currentTags.filter(t => t !== tag).join('|'));
                      } else {
                        updateData("d7_testimonial_tags", [...currentTags, tag].join('|'));
                      }
                    }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "20px",
                      border: `1px solid ${isSelected ? accent : "var(--border)"}`,
                      background: isSelected ? "rgba(255, 140, 0, 0.15)" : "rgba(255, 255, 255, 0.05)",
                      color: isSelected ? accent : "var(--cream)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontWeight: isSelected ? "600" : "normal"
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Response */}
            <h5 style={{ color: accent, fontSize: "0.75rem", letterSpacing: "1px", marginBottom: "0.5rem" }}>
              YOUR RESPONSE
            </h5>
            <FillLine
              id="d7_testimonial"
              label=""
              value={data.d7_testimonial || ""}
              onChange={(v) => updateData("d7_testimonial", v)}
              lines={2}
              accentColor={accent}
              placeholder="Describe your experience in 1–2 lines..."
            />
            
            <div className="spacer-md" />

            {/* Guided format */}
            <h5 style={{ color: accent, fontSize: "0.75rem", letterSpacing: "1px", marginBottom: "0.75rem" }}>
              GUIDED FORMAT
            </h5>
            <div style={{ paddingLeft: "10px", borderLeft: `2px solid ${accent}`}}>
              <FillLine
                id="d7_testimonial_before"
                label="Before:"
                value={data.d7_testimonial_before || ""}
                onChange={(v) => updateData("d7_testimonial_before", v)}
                accentColor={accent}
                placeholder="e.g. constant checking"
              />
              <div className="spacer-sm" />
              <FillLine
                id="d7_testimonial_after"
                label="After:"
                value={data.d7_testimonial_after || ""}
                onChange={(v) => updateData("d7_testimonial_after", v)}
                accentColor={accent}
                placeholder="e.g. calm and focused"
              />
            </div>

            <div className="spacer-md" />
          </div>
        )}
      </div>

      <div className="spacer-lg" />

      {!data.day7_finished ? (
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
            Submit to unlock your Progress report
          </button>
        </div>
      ) : (
        <div className="identity-lock">
          <div className="identity-lock-title">Identity Check</div>
          <div className="identity-lock-text">
            {Name ? Name + ', you' : 'You'} are someone who operates on systems, not willpower. Day 7 done.
          </div>
        </div>
      )}
    </div>
  );
}
