import React, { useEffect, useState } from "react";
import { Sprout, Plus, Key, ShieldCheck } from "lucide-react";
import { api } from "../api.js";

export default function GreenhousePicker({ onSelect, isAdmin, onOpenAdmin }) {
  const [greenhouses, setGreenhouses] = useState(null); // null = loading
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listGreenhouses()
      .then(async (list) => {
        // If this is a fresh account with a greenhouse name saved from the
        // signup form, create it automatically instead of making the person
        // click through an extra step.
        const pendingName = localStorage.getItem("pendingGreenhouseName");
        if (list.length === 0 && pendingName) {
          localStorage.removeItem("pendingGreenhouseName");
          try {
            const gh = await api.createGreenhouse(pendingName);
            onSelect(gh.id);
            return;
          } catch (e) {
            setError(e.message);
          }
        }
        setGreenhouses(list);
      })
      .catch((e) => setError(e.message));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const gh = await api.createGreenhouse(newName.trim());
      onSelect(gh.id);
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Your Greenhouses</h1>
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-soft)",
                background: "var(--bg-panel)",
                color: "var(--text-muted)",
                fontSize: 12,
              }}
            >
              <ShieldCheck size={13} /> Admin
            </button>
          )}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
          Pick a greenhouse to manage, or set up a new one.
        </p>

        {greenhouses === null && <p style={{ color: "var(--text-muted)" }}>Loading...</p>}

        {greenhouses && greenhouses.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {greenhouses.map((gh) => (
              <button
                key={gh.id}
                onClick={() => onSelect(gh.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-soft)",
                  background: "var(--bg-panel)",
                  color: "var(--text-primary)",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--accent-leaf-dim)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-leaf)",
                    flexShrink: 0,
                  }}
                >
                  <Sprout size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{gh.name}</div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--text-faint)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    <Key size={10} /> {gh.api_key.slice(0, 12)}...
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={handleCreate}
          style={{
            display: "flex",
            gap: 8,
            padding: 14,
            borderRadius: "var(--radius-md)",
            border: "1px dashed var(--border-strong)",
          }}
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New greenhouse name"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-soft)",
              background: "var(--bg-panel-raised)",
              color: "var(--text-primary)",
              fontSize: 14,
              fontFamily: "var(--font-body)",
            }}
          />
          <button
            type="submit"
            disabled={creating}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 16px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "var(--accent-leaf)",
              color: "var(--bg-deep)",
              fontWeight: 700,
              fontSize: 13,
              opacity: creating ? 0.7 : 1,
            }}
          >
            <Plus size={14} /> Add
          </button>
        </form>

        {error && <div style={{ color: "var(--accent-danger)", fontSize: 13, marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}
