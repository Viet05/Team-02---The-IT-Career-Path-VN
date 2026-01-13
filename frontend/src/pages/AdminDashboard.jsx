import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import "../styles/AdminDashboard.css";

function MiniBarChart({ title, data }) {
  const max = Math.max(...data, 1);

  return (
    <div className="chart-box">
      <div className="chart-title">{title}</div>
      <div className="chart-frame">
        {data.map((v, idx) => (
          <div
            key={idx}
            className="chart-bar"
            style={{ height: `${Math.round((v / max) * 100)}%` }}
            title={`${v}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const nav = useNavigate();

  const stats = [
    { title: "Users", main: "1,240", sub: "Students 1,050 • Companies 180" },
    { title: "Jobs", main: "420", sub: "Pending 8 • Approved 305" },
    { title: "Roadmaps", main: "24", sub: "Steps 1,380" },
    { title: "Notifications", main: "86", sub: "Sent today 12" },
  ];

  const jobsCreated = [2, 5, 8, 3, 6, 9, 7];
  const activeUsers = [4, 6, 7, 5, 8, 10, 6];

  const recentActivity = [
    { time: "09:12", event: "Approved job: Backend Dev (Java)", actor: "admin01" },
    { time: "09:05", event: "Rejected job: DevOps Engineer", actor: "admin02" },
    { time: "08:50", event: "Company registered: NamiTechsystem", actor: "system" },
  ];

  const systemAlerts = [
    { title: "Pending approvals high", desc: "8 jobs waiting > 24h" },
    { title: "Email queue", desc: "2 failed sends (SMTP)" },
    { title: "Data quality", desc: "Some jobs missing skills tags" },
  ];

  const shortcuts = ["Approve Jobs", "Manage Users", "Manage Companies", "Manage Roadmaps", "View Reports"];

  const pendingJobs = [
    { title: "Backend Dev (Java)", company: "NamiTech" },
    { title: "Frontend Dev (React)", company: "NEC Vietnam" },
    { title: "DevOps Engineer", company: "ABC Studio" },
  ];

  const comingSoon = (name) => () => alert(`${name}: Coming soon`);

  return (
    <div className="admin-dashboard">
      <div className="admin-shell">
        {/* Top admin nav */}
        <div className="admin-topbar">
          <div className="admin-brand">
            <div className="admin-logo">LOGO</div>

            <div className="admin-nav">
              <button className="admin-navbtn active" onClick={() => nav("/admin")}>
                Admin Dashboard
              </button>
              <button className="admin-navbtn" onClick={comingSoon("Approve Jobs")}>
                Approve Jobs
              </button>
              <button className="admin-navbtn" onClick={comingSoon("Manage Users")}>
                Manage Users
              </button>
              <button className="admin-navbtn" onClick={comingSoon("Manage Roadmaps")}>
                Manage Roadmaps
              </button>
              <button
                className="admin-navbtn"
                onClick={() => {
                  logout();
                  nav("/login", { replace: true });
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="admin-chip">ADMIN</div>
        </div>

        <div className="admin-main">
          {/* Page header */}
          <div className="admin-pagehead">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Overview of system health • approvals • users • content</p>
            </div>

            <button className="admin-primary" onClick={comingSoon("Go to Approvals")}>
              Go to Approvals
            </button>
          </div>

          {/* Stats cards */}
          <div className="admin-stats">
            {stats.map((s) => (
              <div key={s.title} className="admin-card">
                <div className="admin-stat-title">{s.title}</div>
                <div className="admin-stat-main">{s.main}</div>
                <div className="admin-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Content grid: left analytics + right sidebar */}
          <div className="admin-content-grid">
            {/* LEFT */}
            <div className="admin-card">
              <div className="admin-section-title">Analytics</div>

              <div className="admin-analytics-grid">
                <MiniBarChart title="Jobs created (last 7 days)" data={jobsCreated} />
                <MiniBarChart title="Active users (last 7 days)" data={activeUsers} />
              </div>

              <div className="admin-lower-grid">
                {/* Recent activity */}
                <div className="admin-card" style={{ padding: 12 }}>
                  <div className="admin-section-title">Recent activity</div>

                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: 90 }}>Time</th>
                        <th>Event</th>
                        <th style={{ width: 110 }}>Actor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((r, idx) => (
                        <tr key={idx}>
                          <td>{r.time}</td>
                          <td>{r.event}</td>
                          <td>{r.actor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* System alerts */}
                <div className="admin-card" style={{ padding: 12 }}>
                  <div className="admin-section-title">System alerts</div>

                  {systemAlerts.map((a, idx) => (
                    <div key={idx} className="admin-alert-item">
                      <div className="admin-alert-text">
                        <strong>{a.title}</strong>
                        <span>{a.desc}</span>
                      </div>
                      <button className="admin-small-btn" onClick={comingSoon("View alert")}>
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Shortcuts */}
              <div className="admin-card">
                <div className="admin-section-title">Admin shortcuts</div>
                <div className="admin-checklist">
                  {shortcuts.map((s, idx) => (
                    <label key={idx}>
                      <input type="checkbox" />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              {/* Pending jobs snapshot */}
              <div className="admin-card">
                <div className="admin-section-title">Pending jobs snapshot</div>
                {pendingJobs.map((j, idx) => (
                  <div key={idx} className="admin-pending-item">
                    <div className="admin-pending-text">
                      <strong>{j.title}</strong>
                      <span>{j.company}</span>
                    </div>
                    <button className="admin-small-btn" onClick={comingSoon("Review job")}>
                      Review
                    </button>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="admin-card admin-notes">
                <div className="admin-section-title">Notes</div>
                <ul>
                  <li>Actions are logged for auditing.</li>
                  <li>Approvals trigger student notifications.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* end main */}
      </div>
    </div>
  );
}
