import { useEffect, useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import Volunteers from "./components/Volunteers";
import Activities from "./components/Activities";
import Assignments from "./components/Assignments";

import {
  getVolunteers,
  getActivities,
  getAssignments
} from "./services/api";

import "./App.css";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [showRegister, setShowRegister] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const [activeSection, setActiveSection] = useState("dashboard");

  const [volunteers, setVolunteers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [message, setMessage] = useState("");

  const loadVolunteers = async () => {
    try {
      const data = await getVolunteers(token);
      setVolunteers(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadActivities = async () => {
    try {
      const data = await getActivities(token);
      setActivities(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadAssignments = async () => {
    try {
      const data = await getAssignments(token);
      setAssignments(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      loadVolunteers();
      loadActivities();
      loadAssignments();
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setMessage("");
    setAuthMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken("");
    setVolunteers([]);
    setActivities([]);
    setAssignments([]);
    setMessage("");
    setActiveSection("dashboard");
  };

  const handleRegistered = () => {
    setShowRegister(false);
    setAuthMessage("Account created. You can log in now.");
  };

  const switchTab = (toRegister) => {
    setShowRegister(toRegister);
    setAuthMessage("");
  };

  /* -------------------------
     LOGIN / REGISTER SCREEN
     ------------------------- */

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-logo">VM</div>
            <h1>Volunteer Manager</h1>
            <p className="auth-subtitle">Admin console</p>
          </div>

          <div className="auth-tabs">
            <button
              className={!showRegister ? "active" : ""}
              onClick={() => switchTab(false)}
            >
              Log In
            </button>
            <button
              className={showRegister ? "active" : ""}
              onClick={() => switchTab(true)}
            >
              Create Account
            </button>
          </div>

          {authMessage && <p className="message">{authMessage}</p>}

          {showRegister ? (
            <Register onRegistered={handleRegistered} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </div>
      </div>
    );
  }

  /* -------------------------
     ADMIN DASHBOARD
     ------------------------- */

  const sectionTitles = {
    dashboard: { title: "Dashboard", subtitle: "Overview of your program" },
    volunteers: { title: "Volunteers", subtitle: "Manage your volunteer roster" },
    activities: { title: "Activities", subtitle: "Manage scheduled activities" },
    assignments: { title: "Assignments", subtitle: "Match volunteers to activities" }
  };

  const current = sectionTitles[activeSection];

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} />

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{current.title}</h1>
            <p>{current.subtitle}</p>
          </div>

          <div className="topbar-right">
            <span className="admin-pill">Admin</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="main-content">
          {message && <p className="message is-error">{message}</p>}

          {activeSection === "dashboard" && (
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-card-label">Total Volunteers</div>
                <div className="stat-card-value">{volunteers.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Total Activities</div>
                <div className="stat-card-value">{activities.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Total Assignments</div>
                <div className="stat-card-value">{assignments.length}</div>
              </div>
            </div>
          )}

          {activeSection === "volunteers" && (
            <section className="section">
              <Volunteers token={token} />
            </section>
          )}

          {activeSection === "activities" && (
            <section className="section">
              <Activities token={token} />
            </section>
          )}

          {activeSection === "assignments" && (
            <section className="section">
              <Assignments
                token={token}
                volunteers={volunteers}
                activities={activities}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;