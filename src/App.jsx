import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient.js";
import { api } from "./api.js";
import AuthPage from "./components/AuthPage.jsx";
import GreenhousePicker from "./components/GreenhousePicker.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AdminPage from "./components/AdminPage.jsx";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [greenhouseId, setGreenhouseId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState("greenhouses"); // "greenhouses" | "admin"

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setGreenhouseId(null);
        setIsAdmin(false);
        setView("greenhouses");
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      api
        .checkAdmin()
        .then((r) => setIsAdmin(r.isAdmin))
        .catch(() => setIsAdmin(false));
    }
  }, [session]);

  if (session === undefined) {
    return <CenteredMessage>Loading...</CenteredMessage>;
  }

  if (!session) {
    return <AuthPage />;
  }

  if (view === "admin") {
    return <AdminPage onBack={() => setView("greenhouses")} />;
  }

  if (!greenhouseId) {
    return (
      <GreenhousePicker
        onSelect={setGreenhouseId}
        isAdmin={isAdmin}
        onOpenAdmin={() => setView("admin")}
      />
    );
  }

  return (
    <Dashboard
      greenhouseId={greenhouseId}
      onSwitchGreenhouse={() => setGreenhouseId(null)}
      isAdmin={isAdmin}
      onOpenAdmin={() => setView("admin")}
    />
  );
}

function CenteredMessage({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-muted)" }}>{children}</p>
    </div>
  );
}
