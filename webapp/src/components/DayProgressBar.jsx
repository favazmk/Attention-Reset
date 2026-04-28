import React from "react";

export default function DayProgressBar({ current, total, accentColor }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  // SVG Ring calculation
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        position: "sticky",
        top: "24px",
        zIndex: 100,
        margin: "0 auto 2.5rem auto",
        width: "max-content",
        backgroundColor: "rgba(20, 20, 22, 0.65)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "9999px",
        padding: "8px 16px 8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        transform: "translateY(0)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div style={{ position: "relative", width: "24px", height: "24px" }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            transform: "rotate(-90deg)",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* Background Track */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Animated Progress Ring */}
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke={accentColor}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition:
                "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease",
            }}
          />
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: "600",
            letterSpacing: "0.5px",
            color: "rgba(255, 255, 255, 0.9)",
            textTransform: "uppercase",
            lineHeight: "1.2",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
          }}
        >
          Day Progress
        </span>
        <span
          style={{
            fontSize: "0.65rem",
            color: "rgba(255, 255, 255, 0.5)",
            lineHeight: "1.2",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
          }}
        >
          {current} of {total} steps
        </span>
      </div>
    </div>
  );
}
