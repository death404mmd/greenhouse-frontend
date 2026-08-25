import React, { useState } from "react";
import { Sprout, Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabaseClient.js";

export default function ResetPasswordPage({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      onDone();
    } catch (err) {
      console.error("Password update error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
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
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: "var(--bg-panel)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-lg)",
          padding: "32px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-sm)",
              background: "var(--accent-leaf-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-leaf)",
            }}
          >
            <Sprout size={18} />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Set a new password</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="New password">
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, width: "100%", paddingRight: 40 }}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  display: "flex",
                  padding: 4,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          <Field label="Confirm new password">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={inputStyle}
              placeholder="Type it again"
            />
          </Field>

          {error && <div style={{ color: "var(--accent-danger)", fontSize: 13 }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: "11px 0",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "var(--accent-leaf)",
              color: "var(--bg-deep)",
              fontWeight: 700,
              fontSize: 14,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Save new password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--text-muted)" }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-soft)",
  background: "var(--bg-panel-raised)",
  color: "var(--text-primary)",
  fontSize: 14,
  fontFamily: "var(--font-body)",
};
