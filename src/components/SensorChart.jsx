import React, { useState } from "react";
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

const METRICS = [
  { key: "temp", label: "Temperature", unit: "°C", color: "var(--accent-amber)" },
  { key: "humidity", label: "Humidity", unit: "%", color: "var(--accent-water)" },
  { key: "soilMoisture", label: "Soil Moisture", unit: "%", color: "var(--accent-leaf)" },
  { key: "lightLux", label: "Light", unit: "lux", color: "var(--accent-amber)" },
  { key: "windSpeed", label: "Wind", unit: "km/h", color: "var(--accent-water)" },
  { key: "co2Ppm", label: "CO2", unit: "ppm", color: "var(--accent-leaf)" },
  { key: "outsideTemp", label: "Outside Temp", unit: "°C", color: "var(--accent-amber)" },
  { key: "waterTankPct", label: "Water Tank", unit: "%", color: "var(--accent-water)" },
];

export default function SensorChart({ history }) {
  // Only offer metrics that actually have at least one real reading, so the
  // selector doesn't fill up with sensors nobody has wired up yet.
  const availableMetrics = METRICS.filter((m) => history.some((h) => typeof h[m.key] === "number"));
  const defaultKey = availableMetrics.length > 0 ? availableMetrics[0].key : "temp";
  const [primaryKey, setPrimaryKey] = useState(defaultKey);
  const [secondaryKey, setSecondaryKey] = useState(
    availableMetrics.find((m) => m.key !== defaultKey)?.key || null
  );

  const primary = METRICS.find((m) => m.key === primaryKey) || METRICS[0];
  const secondary = METRICS.find((m) => m.key === secondaryKey);

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, color: "var(--text-primary)" }}>History</h3>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {availableMetrics.map((m) => (
            <button
              key={m.key}
              onClick={() => {
                if (m.key === primaryKey) return;
                if (m.key === secondaryKey) {
                  setSecondaryKey(null);
                } else if (primaryKey === null) {
                  setPrimaryKey(m.key);
                } else {
                  setSecondaryKey(m.key === secondaryKey ? null : m.key);
                }
              }}
              style={{
                padding: "5px 10px",
                borderRadius: "var(--radius-lg)",
                border: `1px solid ${
                  m.key === primaryKey || m.key === secondaryKey ? m.color : "var(--border-soft)"
                }`,
                background: m.key === primaryKey || m.key === secondaryKey ? `${m.color}22` : "transparent",
                color: m.key === primaryKey || m.key === secondaryKey ? m.color : "var(--text-muted)",
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

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
            {primary && (
              <Line
                type="monotone"
                dataKey={primary.key}
                name={`${primary.label} (${primary.unit})`}
                stroke={primary.color}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            )}
            {secondary && (
              <Line
                type="monotone"
                dataKey={secondary.key}
                name={`${secondary.label} (${secondary.unit})`}
                stroke={secondary.color}
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={false}
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8 }}>
        Tap a sensor above to plot it (up to two at once - the second shows as a dashed line).
      </p>
    </div>
  );
}
