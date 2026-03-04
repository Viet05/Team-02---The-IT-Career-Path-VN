import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { getAllRoadmaps, deleteRoadmap } from "../services/roadmapService";
import { toast } from "../components/Toast";
import "../styles/admin-roadmap-list.css";

export default function AdminRoadmapList() {
  const nav = useNavigate();
  const { logout } = useUserState();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch roadmaps từ API
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const data = await getAllRoadmaps();
        setRoadmaps(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch roadmaps:", err);
        toast.error("Không thể tải danh sách roadmap");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const filteredRoadmaps = roadmaps.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (r.title || "").toLowerCase().includes(term) ||
      (r.description || "").toLowerCase().includes(term)
    );
  });

  const handleEdit = () => {
    toast.info("Edit feature coming soon");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this roadmap?");
    if (!confirmed) return;

    try {
      await deleteRoadmap(id);
      setRoadmaps(roadmaps.filter((r) => r.id !== id));
      toast.success("Roadmap deleted!");
    } catch (err) {
      console.error("Failed to delete roadmap:", err);
      toast.error("Failed to delete roadmap");
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
            </div>
          </div>

          {/* Roadmaps Table */}
          <div className="admin-card">
            {loading ? (
              <p style={{ padding: "20px", textAlign: "center" }}>Đang tải...</p>
            ) : (
              <div className="roadmaps-table-wrapper">
                <table className="roadmaps-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Level</th>
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
                          <td>
                            {roadmap.level && (
                              <span className={`status-badge status-${(roadmap.level || "").toLowerCase()}`}>
                                {roadmap.level}
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-icon"
                                onClick={() => handleEdit(roadmap.id)}
                                title="Edit"
                              >
                                ✏️
                              </button>
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
                        <td colSpan="4" className="empty-state">
                          No roadmaps found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="table-footer">
              Total: {filteredRoadmaps.length} roadmap(s)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
