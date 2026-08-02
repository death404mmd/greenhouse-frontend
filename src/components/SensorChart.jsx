import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function SensorChart({ history }) {
  const data = history.map((h) => ({ ...h, timeLabel: formatTime(h.updatedAt) }));

  return (
    <div
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-md)",
        padding: "20px",
      }}
    >
      <h3 style={{ fontSize: 15, marginBottom: 16, color: "var(--text-primary)" }}>
        Temperature & Humidity Trend
      </h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="var(--border-soft)" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="var(--text-faint)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "var(--border-soft)" }}
            />
            <YAxis stroke="var(--text-faint)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--bg-panel-raised)",
                border: "1px solid var(--border-soft)",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "var(--font-body)",
              }}
              labelStyle={{ color: "var(--text-muted)" }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              name="Temperature (°C)"
              stroke="var(--accent-amber)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              name="Humidity (%)"
              stroke="var(--accent-water)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
