import React, { useEffect, useState } from "react";
import { ArrowLeft, Key, Eye, EyeOff, RefreshCw, Trash2, Users } from "lucide-react";
import { api } from "../api.js";

export default function AdminPage({ onBack }) {
  const [users, setUsers] = useState(null); // null = loading
  const [error, setError] = useState("");
  const [visibleKeys, setVisibleKeys] = useState({}); // { greenhouseId: true }
  const [busyId, setBusyId] = useState(null);

  function load() {
    api
      .getAdminOverview()
      .then(setUsers)
      .catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function handleRegenerate(ghId) {
    setBusyId(ghId);
    try {
      await api.regenerateGreenhouseKey(ghId);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(ghId, name) {
    if (!window.confirm(`Delete greenhouse "${name}"? This cannot be undone.`)) return;
    setBusyId(ghId);
    try {
      await api.deleteGreenhouseAsAdmin(ghId);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <IconButton title="Back" onClick={onBack}>
          <ArrowLeft size={15} />
        </IconButton>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={20} /> Admin Panel
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
            Every registered user and their greenhouses
          </p>
        </div>
      </header>

      {error && <div style={{ color: "var(--accent-danger)", fontSize: 13, marginBottom: 16 }}>{error}</div>}
      {users === null && !error && <p style={{ color: "var(--text-muted)" }}>Loading...</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {users &&
          users.map((u) => (
            <div
              key={u.userId}
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-md)",
                padding: 18,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14 }}>{u.email}</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </div>

              {u.greenhouses.length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>No greenhouses yet</p>
              ) : (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {u.greenhouses.map((gh) => (
                    <div
                      key={gh.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-panel-raised)",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: 13, minWidth: 120 }}>{gh.name}</span>
                      <span
                        className="mono"
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          flex: 1,
                        }}
                      >
                        <Key size={11} />
                        {visibleKeys[gh.id] ? gh.apiKey : "•".repeat(24)}
                      </span>
                      <IconButton
                        title={visibleKeys[gh.id] ? "Hide key" : "Show key"}
                        onClick={() => setVisibleKeys((v) => ({ ...v, [gh.id]: !v[gh.id] }))}
                      >
                        {visibleKeys[gh.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                      </IconButton>
                      <IconButton
                        title="Regenerate key"
                        disabled={busyId === gh.id}
                        onClick={() => handleRegenerate(gh.id)}
                      >
                        <RefreshCw size={13} />
                      </IconButton>
                      <IconButton
                        title="Delete greenhouse"
                        disabled={busyId === gh.id}
                        onClick={() => handleDelete(gh.id, gh.name)}
                      >
                        <Trash2 size={13} color="var(--accent-danger)" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

function IconButton({ title, onClick, children, disabled }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border-soft)",
        background: "var(--bg-panel)",
        color: "var(--text-muted)",
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
