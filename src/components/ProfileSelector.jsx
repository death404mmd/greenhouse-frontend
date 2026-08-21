import React from "react";
import { Sprout, Pencil } from "lucide-react";

export default function ProfileSelector({ profiles, activeId, onSelect, onEdit }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {profiles.map((p) => {
        const active = p.id === activeId;
        return (
          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "var(--radius-lg)",
              border: `1px solid ${active ? "var(--accent-leaf)" : "var(--border-soft)"}`,
              background: active ? "var(--accent-leaf-dim)" : "var(--bg-panel)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => onSelect(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                border: "none",
                background: "transparent",
                color: active ? "var(--accent-leaf)" : "var(--text-primary)",
                fontWeight: active ? 600 : 500,
                fontSize: 14,
              }}
            >
              <Sprout size={16} />
              {p.name}
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(p)}
                title="Edit crop"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 10px 10px 4px",
                  border: "none",
                  background: "transparent",
                  color: active ? "var(--accent-leaf)" : "var(--text-faint)",
                }}
              >
                <Pencil size={13} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
