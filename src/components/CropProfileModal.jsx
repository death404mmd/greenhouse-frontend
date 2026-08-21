import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { api } from "../api.js";

export default function CropProfileModal({ greenhouseId, existing, onClose, onSaved, onDeleted }) {
  const [name, setName] = useState(existing ? existing.name : "");
  const [tempMin, setTempMin] = useState(existing ? existing.tempMin : 18);
  const [tempMax, setTempMax] = useState(existing ? existing.tempMax : 27);
  const [humidityMin, setHumidityMin] = useState(existing ? existing.humidityMin : 60);
  const [humidityMax, setHumidityMax] = useState(existing ? existing.humidityMax : 70);
  const [soilMoistureMin, setSoilMoistureMin] = useState(existing ? existing.soilMoistureMin : 60);
  const [soilMoistureMax, setSoilMoistureMax] = useState(existing ? existing.soilMoistureMax : 80);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.saveProfile(greenhouseId, {
        id: existing ? existing.id : undefined,
        name,
        tempMin: Number(tempMin),
        tempMax: Number(tempMax),
        humidityMin: Number(humidityMin),
        humidityMax: Number(humidityMax),
        soilMoistureMin: Number(soilMoistureMin),
        soilMoistureMax: Number(soilMoistureMax),
      });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${existing.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    setError("");
    try {
      await api.deleteProfile(greenhouseId, existing.id);
      onDeleted();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--bg-panel)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>{existing ? "Edit crop" : "Add a crop"}</h2>
          <div style={{ display: "flex", gap: 6 }}>
            {existing && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                title="Delete this crop"
                style={{ background: "none", border: "none", color: "var(--accent-danger)", padding: 4, opacity: deleting ? 0.5 : 1 }}
              >
                <Trash2 size={17} />
              </button>
            )}
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", color: "var(--text-muted)", padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Crop name">
            <input value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="e.g. Strawberry" />
          </Field>

          <Row>
            <Field label="Min temp (°C)">
              <input type="number" value={tempMin} onChange={(e) => setTempMin(e.target.value)} required style={inputStyle} />
            </Field>
            <Field label="Max temp (°C)">
              <input type="number" value={tempMax} onChange={(e) => setTempMax(e.target.value)} required style={inputStyle} />
            </Field>
          </Row>

          <Row>
            <Field label="Min humidity (%)">
              <input type="number" value={humidityMin} onChange={(e) => setHumidityMin(e.target.value)} required style={inputStyle} />
            </Field>
            <Field label="Max humidity (%)">
              <input type="number" value={humidityMax} onChange={(e) => setHumidityMax(e.target.value)} required style={inputStyle} />
            </Field>
          </Row>

          <Row>
            <Field label="Min soil moisture (%)">
              <input type="number" value={soilMoistureMin} onChange={(e) => setSoilMoistureMin(e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Max soil moisture (%)">
              <input type="number" value={soilMoistureMax} onChange={(e) => setSoilMoistureMax(e.target.value)} style={inputStyle} />
            </Field>
          </Row>

          {error && <div style={{ color: "var(--accent-danger)", fontSize: 13 }}>{error}</div>}

          <button
            type="submit"
            disabled={saving || deleting}
            style={{
              marginTop: 4,
              padding: "11px 0",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "var(--accent-leaf)",
              color: "var(--bg-deep)",
              fontWeight: 700,
              fontSize: 14,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : existing ? "Save changes" : "Add crop"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: "flex", gap: 10 }}>{React.Children.map(children, (c) => <div style={{ flex: 1 }}>{c}</div>)}</div>;
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
  padding: "9px 11px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-soft)",
  background: "var(--bg-panel-raised)",
  color: "var(--text-primary)",
  fontSize: 13.5,
  fontFamily: "var(--font-body)",
  width: "100%",
};
