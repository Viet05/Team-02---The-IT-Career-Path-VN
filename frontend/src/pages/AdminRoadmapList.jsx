import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { toast } from "../components/Toast";
import "../styles/admin-roadmap-list.css";

const MOCK_ROADMAPS = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Learn to build modern web applications with React",
    steps: 12,
    difficulty: "Intermediate",
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Master server-side development with Node.js and databases",
    steps: 15,
    difficulty: "Intermediate",
    status: "active",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    description: "Complete guide to full-stack web development",
    steps: 20,
    difficulty: "Advanced",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    description: "Infrastructure and deployment automation",
    steps: 10,
    difficulty: "Advanced",
    status: "draft",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-20",
  },
];

export default function AdminRoadmapList() {
  const nav = useNavigate();
  const { logout } = useUserState();
  const [roadmaps, setRoadmaps] = useState(MOCK_ROADMAPS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredRoadmaps = roadmaps.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleActivate = (id) => {
    setRoadmaps(
      roadmaps.map((r) => (r.id === id ? { ...r, status: "active" } : r))
    );
    toast.success("Roadmap activated!");
  };

  const handleArchive = (id) => {
    setRoadmaps(
      roadmaps.map((r) => (r.id === id ? { ...r, status: "archived" } : r))
    );
    toast.success("Roadmap archived!");
  };

  const handleEdit = () => {
    toast.info("Edit feature coming soon");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this roadmap?");
    if (confirmed) {
      setRoadmaps(roadmaps.filter((r) => r.id !== id));
      toast.success("Roadmap deleted!");
    }
  };

  return (
    <div className="admin-roadmap-list">
      <div className="admin-shell">
        {/* Top admin nav */}
        <div className="admin-topbar">
          <div className="admin-brand">
            <div className="admin-logo">LOGO</div>

            <div className="admin-nav">
              <button className="admin-navbtn" onClick={() => nav("/admin")}>
                Admin Dashboard
              </button>
              <button className="admin-navbtn" onClick={() => nav("/admin/jobs")}>
                Approve Jobs
              </button>
              <button className="admin-navbtn" onClick={() => nav("/admin/users")}>
                Manage Users
              </button>
              <button className="admin-navbtn active" onClick={() => nav("/admin/roadmaps")}>
                Manage Roadmaps
              </button>
              <button
                className="admin-navbtn"
                onClick={() => {
                  logout();
                  nav("/auth/login", { replace: true });
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
              <h1>Manage Roadmaps</h1>
              <p>Create, edit, and manage learning roadmaps</p>
            </div>

            <button className="admin-primary" onClick={() => toast.info("Create new roadmap coming soon")}>
              + New Roadmap
            </button>
          </div>

          {/* Filters */}
          <div className="admin-card" style={{ marginBottom: "16px" }}>
            <div className="filters-section">
              <div className="filter-group">
                <input
                  type="text"
                  className="input"
                  placeholder="Search roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <select
                  className="input"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Roadmaps Table */}
          <div className="admin-card">
            <div className="roadmaps-table-wrapper">
              <table className="roadmaps-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Steps</th>
                    <th>Difficulty</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoadmaps.length > 0 ? (
                    filteredRoadmaps.map((roadmap) => (
                      <tr key={roadmap.id}>
                        <td>
                          <strong>{roadmap.title}</strong>
                        </td>
                        <td>
                          <span className="text-muted">{roadmap.description}</span>
                        </td>
                        <td>{roadmap.steps}</td>
                        <td>
                          <span
                            className={`status-badge status-${roadmap.difficulty.toLowerCase()}`}
                          >
                            {roadmap.difficulty}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge status-${roadmap.status}`}
                          >
                            {roadmap.status.charAt(0).toUpperCase() +
                              roadmap.status.slice(1)}
                          </span>
                        </td>
                        <td>{new Date(roadmap.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => handleEdit(roadmap.id)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            {roadmap.status !== "active" && (
                              <button
                                className="btn-icon"
                                onClick={() => handleActivate(roadmap.id)}
                                title="Activate"
                              >
                                ✅
                              </button>
                            )}
                            {roadmap.status === "active" && (
                              <button
                                className="btn-icon"
                                onClick={() => handleArchive(roadmap.id)}
                                title="Archive"
                              >
                                📦
                              </button>
                            )}
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => handleDelete(roadmap.id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        No roadmaps found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              Total: {filteredRoadmaps.length} roadmap(s)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
