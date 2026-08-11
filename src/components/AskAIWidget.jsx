import React, { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { api } from "../api.js";

export default function AskAIWidget() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // { role: "user" | "ai", text }
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await api.askAI(q);
      setMessages((m) => [...m, { role: "ai", text: res.answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "ai", text: "Sorry, I couldn't get an answer right now." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 90px" }}>
      <SectionHeading eyebrow="Curious about the build">Ask about this project</SectionHeading>
      <div
        style={{
          marginTop: 24,
          background: "var(--bg-panel)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-lg)",
          padding: 20,
        }}
      >
        {messages.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
            Ask anything about how this greenhouse works - the firmware, the backend, the
            control logic, the tech stack. It only answers questions about this project.
          </p>
        )}

        {messages.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, maxHeight: 360, overflowY: "auto" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  background: m.role === "user" ? "var(--accent-leaf-dim)" : "var(--bg-panel-raised)",
                  color: m.role === "user" ? "var(--accent-leaf)" : "var(--text-primary)",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13.5,
                  background: "var(--bg-panel-raised)",
                  color: "var(--text-muted)",
                }}
              >
                Thinking...
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How does the fan decide when to turn on?"
            style={{
              flex: 1,
              padding: "11px 13px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-soft)",
              background: "var(--bg-panel-raised)",
              color: "var(--text-primary)",
              fontSize: 13.5,
              fontFamily: "var(--font-body)",
            }}
          />
          <button
            type="submit"
            disabled={loading}
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
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Send size={14} />
          </button>
        </form>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10, fontSize: 11, color: "var(--text-faint)" }}>
          <Sparkles size={11} /> Powered by Claude
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, children }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "var(--accent-leaf)",
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 700 }}>{children}</h2>
    </div>
  );
}
