import React, { useEffect, useState } from "react";
import { supabase, markSessionStart, clearSessionStart, isSessionExpired } from "./supabaseClient.js";
import { api } from "./api.js";
import Landing from "./components/Landing.jsx";
import AuthPage from "./components/AuthPage.jsx";
import GreenhousePicker from "./components/GreenhousePicker.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AdminPage from "./components/AdminPage.jsx";

const SESSION_CHECK_INTERVAL_MS = 60 * 1000; // check once a minute

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [showAuth, setShowAuth] = useState(false);
  const [greenhouseId, setGreenhouseId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState("greenhouses"); // "greenhouses" | "admin"

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        if (isSessionExpired()) {
          clearSessionStart();
          supabase.auth.signOut();
          return;
        }
        markSessionStart();
      }
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === "SIGNED_IN") markSessionStart();
      setSession(newSession);
      if (!newSession) {
        clearSessionStart();
        setGreenhouseId(null);
        setIsAdmin(false);
        setView("greenhouses");
        setShowAuth(false);
      }
    });

    // Periodically check whether the session has outlived its allowed lifetime,
    // even if the tab has just been sitting open the whole time.
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        clearSessionStart();
        supabase.auth.signOut();
      }
    }, SESSION_CHECK_INTERVAL_MS);

    return () => {
      listener.subscription.unsubscribe();
      clearInterval(interval);
    };
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
    return showAuth ? <AuthPage /> : <Landing onEnterApp={() => setShowAuth(true)} />;
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
