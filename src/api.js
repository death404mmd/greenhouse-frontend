import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "./supabaseClient.js";

// Set the backend host/port here (or provide them via the VITE_BACKEND_HOST env variable)
const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || window.location.hostname;
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || 3001;
const IS_SECURE = String(BACKEND_PORT) === "443"; // port 443 means the server uses https/wss (e.g. Render)
const PORT_SUFFIX = IS_SECURE ? "" : `:${BACKEND_PORT}`;
const BASE_URL = `${IS_SECURE ? "https" : "http"}://${BACKEND_HOST}${PORT_SUFFIX}`;
const WS_URL = `${IS_SECURE ? "wss" : "ws"}://${BACKEND_HOST}${PORT_SUFFIX}`;

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

async function jsonFetch(path, options = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${path}`);
  }
  return res.json();
}

export const api = {
  listGreenhouses: () => jsonFetch("/api/greenhouses"),
  createGreenhouse: (name) => jsonFetch("/api/greenhouses", { method: "POST", body: JSON.stringify({ name }) }),
  renameGreenhouse: (ghId, name) =>
    jsonFetch(`/api/greenhouses/${ghId}`, { method: "PATCH", body: JSON.stringify({ name }) }),

  getStatus: (ghId) => jsonFetch(`/api/greenhouses/${ghId}/status`),
  getHistory: (ghId) => jsonFetch(`/api/greenhouses/${ghId}/history`),
  getProfiles: (ghId) => jsonFetch(`/api/greenhouses/${ghId}/profiles`),
  saveProfile: (ghId, profile) =>
    jsonFetch(`/api/greenhouses/${ghId}/profiles`, { method: "POST", body: JSON.stringify(profile) }),
  deleteProfile: (ghId, profileId) =>
    jsonFetch(`/api/greenhouses/${ghId}/profiles/${profileId}`, { method: "DELETE" }),
  setActiveProfile: (ghId, profileId) =>
    jsonFetch(`/api/greenhouses/${ghId}/profiles/active`, {
      method: "POST",
      body: JSON.stringify({ profileId }),
    }),
  setRelayMode: (ghId, relay, mode) =>
    jsonFetch(`/api/greenhouses/${ghId}/control`, {
      method: "POST",
      body: JSON.stringify({ relay, mode }),
    }),

  checkAdmin: () => jsonFetch("/api/admin/check"),
  getAdminOverview: () => jsonFetch("/api/admin/overview"),
  regenerateGreenhouseKey: (ghId) =>
    jsonFetch(`/api/admin/greenhouses/${ghId}/regenerate-key`, { method: "POST" }),
  deleteGreenhouseAsAdmin: (ghId) => jsonFetch(`/api/admin/greenhouses/${ghId}`, { method: "DELETE" }),
  renameGreenhouseAsAdmin: (ghId, name) =>
    jsonFetch(`/api/admin/greenhouses/${ghId}`, { method: "PATCH", body: JSON.stringify({ name }) }),

  sendContactMessage: (name, email, message) =>
    jsonFetch("/api/contact", { method: "POST", body: JSON.stringify({ name, email, message }) }),
  getMessages: () => jsonFetch("/api/admin/messages"),
  markMessageRead: (id) => jsonFetch(`/api/admin/messages/${id}`, { method: "PATCH" }),
  deleteMessage: (id) => jsonFetch(`/api/admin/messages/${id}`, { method: "DELETE" }),
};

export function useGreenhouseSocket(greenhouseId) {
  const [connected, setConnected] = useState(false);
  const [sensorData, setSensorData] = useState({});
  const [relayState, setRelayState] = useState({});
  const [activeProfile, setActiveProfile] = useState(null);
  const [reasons, setReasons] = useState({});
  const wsRef = useRef(null);

  useEffect(() => {
    if (!greenhouseId) return;
    let cancelled = false;
    let reconnectTimer;

    async function connect() {
      const token = await getToken();
      if (!token || cancelled) return;

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        setConnected(true);
        ws.send(JSON.stringify({ type: "identify", role: "frontend", token, greenhouseId }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "status_update") {
          setSensorData(msg.sensorData || {});
          setRelayState(msg.relayState || {});
          setActiveProfile(msg.activeProfile || null);
          setReasons(msg.reasons || {});
        }
      };

      ws.onclose = () => {
        if (cancelled) return;
        setConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();
    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [greenhouseId]);

  return { connected, sensorData, relayState, activeProfile, reasons };
}

export function useHistory(greenhouseId, pollIntervalMs = 15000) {
  const [history, setHistory] = useState([]);

  const refresh = useCallback(() => {
    if (!greenhouseId) return;
    api.getHistory(greenhouseId).then(setHistory).catch(() => {});
  }, [greenhouseId]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(id);
  }, [refresh, pollIntervalMs]);

  return history;
}
