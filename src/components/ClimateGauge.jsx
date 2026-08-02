import React from "react";

/**
 * ClimateGauge
 * A semi-circular analog-style gauge, similar to the old thermometers/
 * hygrometers mounted on the wall of real greenhouses. Instead of a plain
 * number, it shows a needle and a colored "safe range" zone so you can
 * tell the status at a glance.
 */
export default function ClimateGauge({
  label,
  value,
  unit,
  min = 0,
  max = 50,
  safeMin,
  safeMax,
  accentColor = "var(--accent-leaf)",
}) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const radius = 70;
  const startAngle = 200; // degrees (slightly more than 180 for an analog feel)
  const endAngle = -20;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function angleForValue(v) {
    const ratio = clamp((v - min) / (max - min), 0, 1);
    return startAngle + (endAngle - startAngle) * ratio;
  }

  function polarToCartesian(angleDeg, r) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }

  function arcPath(a1, a2, r, segments = 40) {
    // Sample points directly along the circle instead of relying on SVG's
    // arc large-arc/sweep flags - those flags can flip a short arc to the
    // wrong side of the circle, which is exactly the "mirrored" bug we saw.
    let d = "";
    for (let i = 0; i <= segments; i++) {
      const a = a1 + (a2 - a1) * (i / segments);
      const p = polarToCartesian(a, r);
      d += `${i === 0 ? "M" : "L"} ${p.x} ${p.y} `;
    }
    return d.trim();
  }

  const hasValue = typeof value === "number" && !Number.isNaN(value);
  const needleAngle = hasValue ? angleForValue(value) : angleForValue(min);
  const needleTip = polarToCartesian(needleAngle, radius - 12);

  const safeStartAngle = safeMin !== undefined ? angleForValue(safeMin) : startAngle;
  const safeEndAngle = safeMax !== undefined ? angleForValue(safeMax) : endAngle;

  // small tick marks around the gauge
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const a = startAngle + ((endAngle - startAngle) * i) / 8;
    const outer = polarToCartesian(a, radius + 8);
    const inner = polarToCartesian(a, radius + 1);
    return { a, outer, inner };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`}>
        {/* base gauge track */}
        <path
          d={arcPath(startAngle, endAngle, radius)}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* safe range - colored */}
        {safeMin !== undefined && safeMax !== undefined && (
          <path
            d={arcPath(safeStartAngle, safeEndAngle, radius)}
            fill="none"
            stroke={accentColor}
            strokeOpacity="0.55"
            strokeWidth="10"
            strokeLinecap="round"
          />
        )}
        {/* tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.inner.x}
            y1={t.inner.y}
            x2={t.outer.x}
            y2={t.outer.y}
            stroke="var(--text-faint)"
            strokeWidth="2"
          />
        ))}
        {/* needle */}
        {hasValue && (
          <line
            x1={cx}
            y1={cy}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        <circle cx={cx} cy={cy} r={6} fill={accentColor} />
      </svg>

      <div style={{ textAlign: "center", marginTop: -8 }}>
        <div className="mono" style={{ fontSize: 26, fontWeight: 600, color: "var(--text-primary)" }}>
          {hasValue ? value.toFixed(1) : "—"}
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}> {unit}</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}
