import React from "react";

export default function RelayCard({ icon: Icon, label, isOn, mode, reason, onModeChange, accentColor }) {
  const isAuto = mode === null || mode === undefined;

  return (
    <div
      style={{
        background: "var(--bg-panel)",
        border: `1px solid ${isOn ? accentColor : "var(--border-soft)"}`,
        borderRadius: "var(--radius-md)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 200ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-sm)",
              background: isOn ? `${accentColor}22` : "var(--bg-panel-raised)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isOn ? accentColor : "var(--text-muted)",
            }}
          >
            <Icon size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{label}</div>
            <div style={{ fontSize: 12, color: isOn ? accentColor : "var(--text-muted)" }}>
              {isOn ? "On" : "Off"}
            </div>
          </div>
        </div>

        {/* live status indicator */}
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: isOn ? accentColor : "var(--text-faint)",
            boxShadow: isOn ? `0 0 8px ${accentColor}` : "none",
          }}
        />
      </div>

      {reason && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{reason}</div>
      )}

      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <ModeButton active={isAuto} onClick={() => onModeChange("auto")}>
          Auto
        </ModeButton>
        <ModeButton active={mode === true} onClick={() => onModeChange("on")}>
          On
        </ModeButton>
        <ModeButton active={mode === false} onClick={() => onModeChange("off")}>
          Off
        </ModeButton>
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "7px 0",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${active ? "var(--accent-leaf)" : "var(--border-soft)"}`,
        background: active ? "var(--accent-leaf-dim)" : "transparent",
        color: active ? "var(--accent-leaf)" : "var(--text-muted)",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}
