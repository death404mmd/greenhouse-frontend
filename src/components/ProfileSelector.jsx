import React from "react";
import { Sprout } from "lucide-react";

export default function ProfileSelector({ profiles, activeId, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {profiles.map((p) => {
        const active = p.id === activeId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: "var(--radius-lg)",
              border: `1px solid ${active ? "var(--accent-leaf)" : "var(--border-soft)"}`,
              background: active ? "var(--accent-leaf-dim)" : "var(--bg-panel)",
              color: active ? "var(--accent-leaf)" : "var(--text-primary)",
              fontWeight: active ? 600 : 500,
              fontSize: 14,
            }}
          >
            <Sprout size={16} />
            {p.name}
          </button>
        );
      })}
    </div>
  );
}
