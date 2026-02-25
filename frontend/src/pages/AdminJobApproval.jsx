import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { getAllJobs } from "../services/jobService";
import { toast } from "../components/Toast";
import "../styles/admin-job-approval.css";

export default function AdminJobApproval() {
  const nav = useNavigate();
  const { logout } = useUserState();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch jobs từ API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAllJobs();
        // Backend hiện không có trạng thái pending/approved/rejected – hiển thị tất cả
        // với status mặc định là "approved"
        const normalized = (Array.isArray(data) ? data : []).map((job) => ({
          ...job,
          status: job.status || "approved",
        }));
        setJobs(normalized);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        toast.error("Không thể tải danh sách việc làm");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!filterStatus) return jobs;
    return jobs.filter((job) => job.status === filterStatus);
  }, [jobs, filterStatus]);

  const handleApprove = (jobId) => {
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: "approved" } : j)));
    toast.success("Job marked as approved!");
  };

  const handleReject = (jobId) => {
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: "rejected" } : j)));
    toast.success("Job marked as rejected");
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "status-approved",
      pending: "status-pending",
      rejected: "status-rejected",
    };
    return (
      <span className={`status-badge ${styles[status] || ""}`}>
        {(status || "").toUpperCase()}
      </span>
    );
  };

  const pendingCount = jobs.filter((j) => j.status === "pending").length;
  const approvedCount = jobs.filter((j) => j.status === "approved").length;
  const rejectedCount = jobs.filter((j) => j.status === "rejected").length;

  return (
    <div className="admin-job-approval">
      <div className="admin-shell">
        <div className="admin-topbar">
          <div className="admin-brand">
            <div className="admin-logo">LOGO</div>
            <div className="admin-nav">
              <button className="admin-navbtn" onClick={() => nav("/admin")}>
                Dashboard
              </button>
              <button className="admin-navbtn" onClick={() => nav("/admin/users")}>
                Manage Users
              </button>
              <button className="admin-navbtn active">Approve Jobs</button>
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
          <div className="admin-pagehead">
            <div>
              <h1>Approve Jobs</h1>
              <p>Review and approve job postings from companies</p>
            </div>
          </div>

          <div className="admin-stats">
            <div className="admin-card">
              <div className="admin-stat-title">Pending</div>
              <div className="admin-stat-main">{pendingCount}</div>
            </div>
            <div className="admin-card">
              <div className="admin-stat-title">Approved</div>
              <div className="admin-stat-main">{approvedCount}</div>
            </div>
            <div className="admin-card">
              <div className="admin-stat-title">Rejected</div>
              <div className="admin-stat-main">{rejectedCount}</div>
            </div>
          </div>

          <div className="admin-card">
            <div className="filters-section">
              <select
                className="input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {loading ? (
              <p style={{ padding: "20px", textAlign: "center" }}>Đang tải...</p>
            ) : (
              <div className="jobs-table-wrapper">
                <table className="jobs-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Level</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          No jobs found
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <strong>{job.jobTitle || job.title}</strong>
                          </td>
                          <td>{job.companyName || job.company}</td>
                          <td>{job.location}</td>
                          <td>{job.jobType}</td>
                          <td>{job.jobLevel}</td>
                          <td>{getStatusBadge(job.status)}</td>
                          <td>
                            {job.status === "pending" ? (
                              <div className="action-buttons">
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleApprove(job.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleReject(job.id)}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="table-footer">
              <span>Total: {filteredJobs.length} jobs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
