import React, { useState } from "react";
import { Sprout, Github, Mail, ArrowRight, Cpu, Cloud, Gauge, GraduationCap } from "lucide-react";
import { api } from "../api.js";
import AskAIWidget from "./AskAIWidget.jsx";

export default function Landing({ onEnterApp }) {
  return (
    <div>
      <TopNav onEnterApp={onEnterApp} />
      <Hero onEnterApp={onEnterApp} />
      <AboutProject />
      <Skills />
      <AskAIWidget />
      <AboutMe />
      <Contact />
      <Footer />
    </div>
  );
}

function TopNav({ onEnterApp }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(8px)",
        background: "rgba(14, 21, 18, 0.85)",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-sm)",
              background: "var(--accent-leaf-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-leaf)",
            }}
          >
            <Sprout size={15} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Smart Greenhouse</span>
        </div>
        <button
          onClick={onEnterApp}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-soft)",
            background: "var(--bg-panel)",
            color: "var(--text-primary)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

function Hero({ onEnterApp }) {
  return (
    <header
      style={{
        maxWidth: 1040,
        margin: "0 auto",
        padding: "80px 24px 60px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 560,
          maxWidth: "90vw",
          height: 380,
          background: "radial-gradient(ellipse at center, rgba(143,191,111,0.16) 0%, rgba(143,191,111,0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-soft)",
            background: "var(--bg-panel)",
            color: "var(--accent-leaf)",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          <Sprout size={13} /> Full-stack IoT project
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: 20,
          }}
        >
          A greenhouse that thinks
          <br />
          <span style={{ color: "var(--accent-leaf)" }}>for itself.</span>
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "var(--text-muted)",
            maxWidth: 560,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          An ESP32-based automation system that reads live climate data and controls
          fans, heaters, and irrigation on its own - built end to end, from soldered
          relays to a cloud backend and a live control panel.
        </p>

        <button
          onClick={onEnterApp}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 26px",
            borderRadius: "var(--radius-sm)",
            border: "none",
            background: "var(--accent-leaf)",
            color: "var(--bg-deep)",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Open the control panel <ArrowRight size={16} />
        </button>

        <StatsRow />
        <DashboardPreview />
      </div>
    </header>
  );
}

function StatsRow() {
  const stats = [
    { value: "5s", label: "sensor refresh rate" },
    { value: "24/7", label: "cloud-hosted control" },
    { value: "0", label: "manual interventions needed" },
  ];
  return (
    <div
      style={{
        marginTop: 56,
        display: "flex",
        justifyContent: "center",
        gap: 40,
        flexWrap: "wrap",
      }}
    >
      {stats.map((s) => (
        <div key={s.label}>
          <div className="mono" style={{ fontSize: 26, fontWeight: 600, color: "var(--accent-leaf)" }}>
            {s.value}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function DashboardPreview() {
  // Placeholder for a real screenshot of the live dashboard.
  // Drop your screenshot at: frontend/public/dashboard-screenshot.png
  // and it will show up here automatically (this <img> already points to it).
  return (
    <div
      style={{
        marginTop: 56,
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-strong)",
        overflow: "hidden",
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)",
        background: "var(--bg-panel)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "10px 14px",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent-danger)" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent-amber)" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent-leaf)" }} />
      </div>
      <img
        src="/dashboard-screenshot.png"
        alt="Smart Greenhouse dashboard screenshot"
        style={{ display: "block", width: "100%", height: "auto" }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <div
        style={{
          display: "none",
          height: 280,
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-faint)",
          fontSize: 13,
        }}
      >
        Dashboard screenshot goes here (public/dashboard-screenshot.png)
      </div>
    </div>
  );
}

function AboutProject() {
  const points = [
    {
      icon: Cpu,
      title: "Embedded firmware",
      text: "ESP32 reads DHT sensors and drives relays over WiFi, with automatic reconnection and a watchdog restart if it ever loses touch with the server.",
    },
    {
      icon: Cloud,
      title: "Cloud backend",
      text: "A Node.js decision engine, hosted on Render and backed by a Postgres database (Supabase), makes every climate-control decision - no logic lives on the device itself.",
    },
    {
      icon: Gauge,
      title: "Live control panel",
      text: "A React dashboard shows real-time readings, lets you pick a crop profile, and switch any relay between automatic and manual control.",
    },
  ];

  return (
    <section style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px 90px" }}>
      <SectionHeading eyebrow="What it does">The project</SectionHeading>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 18,
          marginTop: 28,
        }}
      >
        {points.map((p) => (
          <div
            key={p.title}
            style={{
              background: "var(--bg-panel)",
              border: "1px solid var(--border-soft)",
              borderRadius: "var(--radius-lg)",
              padding: 24,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--radius-sm)",
                background: "var(--accent-leaf-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-leaf)",
                marginBottom: 14,
              }}
            >
              <p.icon size={18} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.6 }}>{p.text}</p>
          </div>
        ))}
      </div>

      <ArchitectureDiagram />
    </section>
  );
}

function ArchitectureDiagram() {
  const nodes = [
    { label: "ESP32", sub: "sensors + relays", color: "var(--accent-amber)" },
    { label: "Node.js", sub: "decision engine · Render", color: "var(--accent-leaf)" },
    { label: "Postgres", sub: "Supabase", color: "var(--accent-water)" },
    { label: "React panel", sub: "live dashboard", color: "var(--accent-leaf)" },
  ];
  return (
    <div
      style={{
        marginTop: 24,
        background: "var(--bg-panel)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-lg)",
        padding: "28px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      {nodes.map((n, i) => (
        <React.Fragment key={n.label}>
          <div style={{ textAlign: "center", minWidth: 110 }}>
            <div
              style={{
                width: 54,
                height: 54,
                margin: "0 auto 8px",
                borderRadius: "50%",
                border: `2px solid ${n.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: n.color,
              }}
            >
              {n.label.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{n.label}</div>
            <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{n.sub}</div>
          </div>
          {i < nodes.length - 1 && (
            <div
              aria-hidden
              style={{
                width: 32,
                height: 2,
                background: "var(--border-strong)",
                marginBottom: 30,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Skills() {
  const skills = [
    "ESP32 / Arduino C++",
    "Node.js & Express",
    "WebSocket (real-time)",
    "React",
    "PostgreSQL",
    "Supabase (Auth + DB)",
    "Render (cloud hosting)",
    "REST API design",
    "Embedded systems / relays",
  ];
  return (
    <section style={{ maxWidth: 1040, margin: "0 auto", padding: "0 24px 90px" }}>
      <SectionHeading eyebrow="Toolbox">Skills used in this project</SectionHeading>
      <div
        style={{
          marginTop: 24,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {skills.map((s) => (
          <span
            key={s}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-strong)",
              background: "var(--bg-panel)",
              color: "var(--text-primary)",
              fontSize: 12.5,
              fontWeight: 500,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}

function AboutMe() {
  return (
    <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 90px" }}>
      <SectionHeading eyebrow="Who built this">About me</SectionHeading>
      <div
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-lg)",
          padding: 28,
          marginTop: 28,
        }}
      >
        <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>Mohammadmahdi Heibatian Ghalehsalimi</h3>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 18 }}>
          I'm a hands-on hardware and embedded systems enthusiast, currently applying to an
          Ausbildung (vocational apprenticeship) program in Germany. This greenhouse project is
          my way of learning by building: soldering and debugging the electronics myself, then
          extending it into a full-stack IoT system - firmware, backend, database, and a live web
          panel - end to end.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href="https://github.com/death404mmd"
            target="_blank"
            rel="noreferrer"
            style={linkButtonStyle}
          >
            <Github size={15} /> GitHub
          </a>
          <a href="mailto:mohammadmahdi.heibatian@gmail.com" style={linkButtonStyle}>
            <Mail size={15} /> Email me
          </a>
          {/* Replace this href with your real ResearchGate profile URL */}
          <a
            href="https://www.researchgate.net/profile/YOUR_PROFILE"
            target="_blank"
            rel="noreferrer"
            style={linkButtonStyle}
          >
            <GraduationCap size={15} /> ResearchGate
          </a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.sendContactMessage(name, email, message);
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (e) {
      setStatus("error");
    }
  }

  return (
    <section style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 100px" }}>
      <SectionHeading eyebrow="Get in touch">Send a message</SectionHeading>
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 28,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "var(--bg-panel)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
        }}
      >
        <input
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          required
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <textarea
          required
          placeholder="Your message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font-body)" }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            padding: "12px 0",
            borderRadius: "var(--radius-sm)",
            border: "none",
            background: "var(--accent-leaf)",
            color: "var(--bg-deep)",
            fontWeight: 700,
            fontSize: 14,
            opacity: status === "sending" ? 0.7 : 1,
          }}
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
        {status === "sent" && (
          <p style={{ color: "var(--accent-leaf)", fontSize: 13 }}>Thanks - your message was sent.</p>
        )}
        {status === "error" && (
          <p style={{ color: "var(--accent-danger)", fontSize: 13 }}>
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-soft)",
        padding: "24px",
        textAlign: "center",
        color: "var(--text-faint)",
        fontSize: 12.5,
      }}
    >
      Smart Greenhouse — built by Mohammadmahdi Heibatian Ghalehsalimi
    </footer>
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

const linkButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "9px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-soft)",
  background: "var(--bg-panel-raised)",
  color: "var(--text-primary)",
  fontSize: 13,
  textDecoration: "none",
};

const inputStyle = {
  padding: "11px 13px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-soft)",
  background: "var(--bg-panel-raised)",
  color: "var(--text-primary)",
  fontSize: 14,
  fontFamily: "var(--font-body)",
};
