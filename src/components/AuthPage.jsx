import React, { useState } from "react";
import { Sprout, Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabaseClient.js";

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [greenhouseName, setGreenhouseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setNotice("If an account exists for that email, a reset link has been sent. Check your inbox.");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (greenhouseName.trim()) {
          localStorage.setItem("pendingGreenhouseName", greenhouseName.trim());
        }

        setNotice("Account created. Check your email to confirm it, then sign in - your greenhouse will be ready right away.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (mode === "signin" && err.message && err.message.toLowerCase().includes("invalid login credentials")) {
        setError("Wrong email or password. If you don't have an account yet, switch to Sign Up above.");
      } else {
        setError(err.message || `Something went wrong (${err.name || "unknown error"})`);
      }
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
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Smart Greenhouse</h1>
        </div>

        {mode !== "forgot" && (
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            <TabButton active={mode === "signin"} onClick={() => setMode("signin")}>
              Sign In
            </TabButton>
            <TabButton active={mode === "signup"} onClick={() => setMode("signup")}>
              Sign Up
            </TabButton>
          </div>
        )}

        {mode === "forgot" && (
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 18 }}>
            Enter your email and we'll send you a link to set a new password.
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="you@example.com"
            />
          </Field>

          {mode !== "forgot" && (
            <Field label="Password">
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
                  title={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
          )}

          {mode === "signin" && (
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError("");
                setNotice("");
              }}
              style={{
                alignSelf: "flex-end",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: 12.5,
                padding: 0,
                marginTop: -6,
              }}
            >
              Forgot password?
            </button>
          )}

          {mode === "signup" && (
            <Field label="Greenhouse name">
              <input
                type="text"
                required
                value={greenhouseName}
                onChange={(e) => setGreenhouseName(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Backyard Greenhouse"
              />
            </Field>
          )}

          {error && <div style={{ color: "var(--accent-danger)", fontSize: 13 }}>{error}</div>}
          {notice && <div style={{ color: "var(--accent-leaf)", fontSize: 13 }}>{notice}</div>}

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
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : mode === "forgot"
              ? "Send reset link"
              : "Create Account"}
          </button>

          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setNotice("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: 12.5,
                padding: 0,
              }}
            >
              ← Back to Sign In
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: "8px 0",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${active ? "var(--accent-leaf)" : "var(--border-soft)"}`,
        background: active ? "var(--accent-leaf-dim)" : "transparent",
        color: active ? "var(--accent-leaf)" : "var(--text-muted)",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {children}
    </button>
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
