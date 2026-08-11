import React, { useEffect, useState } from "react";
import { Fan, Flame, Droplets, Wifi, WifiOff, LogOut, ArrowLeftRight, ShieldCheck, Pencil, Plus } from "lucide-react";
import ClimateGauge from "./ClimateGauge.jsx";
import RelayCard from "./RelayCard.jsx";
import ProfileSelector from "./ProfileSelector.jsx";
import SensorChart from "./SensorChart.jsx";
import CropProfileModal from "./CropProfileModal.jsx";
import { useGreenhouseSocket, useHistory, api } from "../api.js";
import { supabase } from "../supabaseClient.js";

export default function Dashboard({ greenhouseId, onSwitchGreenhouse, isAdmin, onOpenAdmin }) {
  const { connected, sensorData, relayState, activeProfile, reasons } = useGreenhouseSocket(greenhouseId);
  const history = useHistory(greenhouseId);
  const [profiles, setProfiles] = useState([]);
  const [manualOverrides, setManualOverrides] = useState({ fan: null, heater: null, pump: null });
  const [greenhouseName, setGreenhouseName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function refreshProfiles() {
    api.getProfiles(greenhouseId).then(setProfiles);
  }

  useEffect(() => {
    refreshProfiles();
    api.getStatus(greenhouseId).then((s) => {
      setManualOverrides(s.manualOverrides);
      setGreenhouseName(s.name || "");
    });
  }, [greenhouseId]);

  async function handleSelectProfile(profileId) {
    await api.setActiveProfile(greenhouseId, profileId);
  }

  async function handleRelayMode(relay, mode) {
    const res = await api.setRelayMode(greenhouseId, relay, mode);
    setManualOverrides(res.manualOverrides);
  }

  async function handleRename(newName) {
    if (!newName.trim() || newName === greenhouseName) {
      setRenaming(false);
      return;
    }
    const res = await api.renameGreenhouse(greenhouseId, newName.trim());
    setGreenhouseName(res.name);
    setRenaming(false);
  }

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 20px 60px" }}>
      <Header
        connected={connected}
        onSwitchGreenhouse={onSwitchGreenhouse}
        isAdmin={isAdmin}
        onOpenAdmin={onOpenAdmin}
        greenhouseName={greenhouseName}
        renaming={renaming}
        onStartRename={() => setRenaming(true)}
        onRename={handleRename}
      />

      <section style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SectionLabel>Active Crop</SectionLabel>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-soft)",
              background: "var(--bg-panel)",
              color: "var(--accent-leaf)",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            <Plus size={13} /> Add crop
          </button>
        </div>
        <ProfileSelector
          profiles={profiles}
          activeId={activeProfile?.id}
          onSelect={handleSelectProfile}
        />
        {activeProfile && (
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 10 }}>
            Optimal range for "{activeProfile.name}": temperature {activeProfile.tempMin}–
            {activeProfile.tempMax}°C, humidity {activeProfile.humidityMin}–
            {activeProfile.humidityMax}% — maintained automatically, no manual intervention needed.
          </p>
        )}
      </section>

      <section
        style={{
          marginTop: 24,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
          background: "var(--bg-panel)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-lg)",
          padding: "20px 28px",
        }}
      >
        <ClimateGauge
          label="Temperature"
          value={sensorData.temp}
          unit="°C"
          min={0}
          max={45}
          safeMin={activeProfile?.tempMin}
          safeMax={activeProfile?.tempMax}
          accentColor="var(--accent-amber)"
        />
        <ClimateGauge
          label="Air Humidity"
          value={sensorData.humidity}
          unit="%"
          min={0}
          max={100}
          safeMin={activeProfile?.humidityMin}
          safeMax={activeProfile?.humidityMax}
          accentColor="var(--accent-water)"
        />
        <ClimateGauge
          label="Soil Moisture"
          value={sensorData.soilMoisture}
          unit="%"
          min={0}
          max={100}
          safeMin={activeProfile?.soilMoistureMin}
          safeMax={activeProfile?.soilMoistureMax}
          accentColor="var(--accent-leaf)"
        />
        <ClimateGauge
          label="Light"
          value={sensorData.lightLux}
          unit="lux"
          min={0}
          max={2000}
          accentColor="var(--accent-amber)"
        />
        <ClimateGauge
          label="Wind Speed"
          value={sensorData.windSpeed}
          unit="km/h"
          min={0}
          max={60}
          accentColor="var(--accent-water)"
        />
        <ClimateGauge
          label="CO2"
          value={sensorData.co2Ppm}
          unit="ppm"
          min={300}
          max={2000}
          accentColor="var(--accent-leaf)"
        />
        <ClimateGauge
          label="Outside Temp"
          value={sensorData.outsideTemp}
          unit="°C"
          min={-10}
          max={45}
          accentColor="var(--accent-amber)"
        />
        <ClimateGauge
          label="Water Tank"
          value={sensorData.waterTankPct}
          unit="%"
          min={0}
          max={100}
          accentColor="var(--accent-water)"
        />
      </section>

      <section style={{ marginTop: 24 }}>
        <SectionLabel>Water Usage</SectionLabel>
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <StatCard label="Current flow" value={sensorData.waterFlow} unit="L/min" />
          <StatCard label="Total used" value={sensorData.waterUsedTotal} unit="L" />
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <SectionLabel>Equipment Control</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 14,
          }}
        >
          <RelayCard
            icon={Fan}
            label="Ventilation Fan"
            isOn={!!relayState.fan}
            mode={manualOverrides.fan}
            reason={reasons.fan}
            accentColor="var(--accent-water)"
            onModeChange={(mode) => handleRelayMode("fan", mode)}
          />
          <RelayCard
            icon={Flame}
            label="Heater"
            isOn={!!relayState.heater}
            mode={manualOverrides.heater}
            reason={reasons.heater}
            accentColor="var(--accent-amber)"
            onModeChange={(mode) => handleRelayMode("heater", mode)}
          />
          <RelayCard
            icon={Droplets}
            label="Irrigation Pump"
            isOn={!!relayState.pump}
            mode={manualOverrides.pump}
            reason={reasons.pump}
            accentColor="var(--accent-leaf)"
            onModeChange={(mode) => handleRelayMode("pump", mode)}
          />
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <SectionLabel>History</SectionLabel>
        <SensorChart history={history} />
      </section>

      {modalOpen && (
        <CropProfileModal
          greenhouseId={greenhouseId}
          existing={null}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            refreshProfiles();
          }}
        />
      )}
    </div>
  );
}

function Header({ connected, onSwitchGreenhouse, isAdmin, onOpenAdmin, greenhouseName, renaming, onStartRename, onRename }) {
  const [draft, setDraft] = useState(greenhouseName);

  useEffect(() => setDraft(greenhouseName), [greenhouseName]);

  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div>
        {renaming ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => onRename(draft)}
            onKeyDown={(e) => e.key === "Enter" && onRename(draft)}
            style={{
              fontSize: 24,
              fontWeight: 800,
              background: "var(--bg-panel-raised)",
              border: "1px solid var(--accent-leaf)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              padding: "2px 8px",
              fontFamily: "var(--font-display)",
            }}
          />
        ) : (
          <h1 style={{ fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            {greenhouseName || "Smart Greenhouse"}
            <button
              onClick={onStartRename}
              title="Rename"
              style={{ background: "none", border: "none", color: "var(--text-faint)", display: "flex" }}
            >
              <Pencil size={14} />
            </button>
          </h1>
        )}
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
          Automatic control based on the selected crop
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: "var(--radius-lg)",
            background: connected ? "var(--accent-leaf-dim)" : "var(--accent-danger-dim)",
            color: connected ? "var(--accent-leaf)" : "var(--accent-danger)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {connected ? <Wifi size={15} /> : <WifiOff size={15} />}
          {connected ? "Connected to device" : "Connecting..."}
        </div>
        {isAdmin && (
          <IconButton title="Admin panel" onClick={onOpenAdmin}>
            <ShieldCheck size={15} />
          </IconButton>
        )}
        <IconButton title="Switch greenhouse" onClick={onSwitchGreenhouse}>
          <ArrowLeftRight size={15} />
        </IconButton>
        <IconButton title="Sign out" onClick={() => supabase.auth.signOut()}>
          <LogOut size={15} />
        </IconButton>
      </div>
    </header>
  );
}

function IconButton({ title, onClick, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-soft)",
        background: "var(--bg-panel)",
        color: "var(--text-muted)",
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, unit }) {
  const hasValue = typeof value === "number" && !Number.isNaN(value);
  return (
    <div
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-md)",
        padding: "16px 22px",
        minWidth: 140,
      }}
    >
      <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: "var(--accent-water)" }}>
        {hasValue ? value.toFixed(1) : "—"}
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}> {unit}</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "var(--text-muted)",
        letterSpacing: 0.5,
        marginBottom: 12,
      }}
    >
      {children}
    </h2>
  );
}
