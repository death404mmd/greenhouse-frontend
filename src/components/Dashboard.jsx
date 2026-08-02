import React, { useEffect, useState } from "react";
import { Fan, Flame, Droplets, Wifi, WifiOff, LogOut, ArrowLeftRight, ShieldCheck } from "lucide-react";
import ClimateGauge from "./ClimateGauge.jsx";
import RelayCard from "./RelayCard.jsx";
import ProfileSelector from "./ProfileSelector.jsx";
import SensorChart from "./SensorChart.jsx";
import { useGreenhouseSocket, useHistory, api } from "../api.js";
import { supabase } from "../supabaseClient.js";

export default function Dashboard({ greenhouseId, onSwitchGreenhouse, isAdmin, onOpenAdmin }) {
  const { connected, sensorData, relayState, activeProfile, reasons } = useGreenhouseSocket(greenhouseId);
  const history = useHistory(greenhouseId);
  const [profiles, setProfiles] = useState([]);
  const [manualOverrides, setManualOverrides] = useState({ fan: null, heater: null, pump: null });

  useEffect(() => {
    api.getProfiles(greenhouseId).then(setProfiles);
    api.getStatus(greenhouseId).then((s) => setManualOverrides(s.manualOverrides));
  }, [greenhouseId]);

  async function handleSelectProfile(profileId) {
    await api.setActiveProfile(greenhouseId, profileId);
  }

  async function handleRelayMode(relay, mode) {
    const res = await api.setRelayMode(greenhouseId, relay, mode);
    setManualOverrides(res.manualOverrides);
  }

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 20px 60px" }}>
      <Header connected={connected} onSwitchGreenhouse={onSwitchGreenhouse} isAdmin={isAdmin} onOpenAdmin={onOpenAdmin} />

      <section style={{ marginTop: 28 }}>
        <SectionLabel>Active Crop</SectionLabel>
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
    </div>
  );
}

function Header({ connected, onSwitchGreenhouse, isAdmin, onOpenAdmin }) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Smart Greenhouse</h1>
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
