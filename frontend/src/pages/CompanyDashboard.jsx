import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { toast } from "../components/Toast";
import { logout } from "../services/auth";
import "../styles/company.css";

const MOCK_JOBS = [
  {
    id: 1,
    title: "Backend Developer (Java)",
    description: "We are looking for a skilled Backend Developer...",
    location: "HCM",
    type: "Full-time",
    level: "Junior/Middle",
    salary: "20-35M",
    tags: ["Java", "Spring", "MySQL"],
    status: "approved",
    posted: "2024-01-15",
  },
  {
    id: 2,
    title: "Frontend Developer (React)",
    description: "Join our frontend team...",
    location: "Hà Nội",
    type: "Full-time",
    level: "Middle",
    salary: "25-40M",
    tags: ["React", "TypeScript", "CSS"],
    status: "pending",
    posted: "2024-01-20",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    description: "Looking for DevOps expertise...",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "30-50M",
    tags: ["Docker", "Kubernetes", "AWS"],
    status: "approved",
    posted: "2024-01-18",
  },
];

export default function CompanyDashboard() {
  const nav = useNavigate();
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "Full-time",
    level: "Junior",
    salary: "",
    tags: "",
  });

  const resetForm = () => {
    setJobForm({
      title: "",
      description: "",
      location: "",
      type: "Full-time",
      level: "Junior",
      salary: "",
      tags: "",
    });
  };

  const handlePostJob = () => {
    resetForm();
    setEditingJob(null);
    setShowPostModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
      level: job.level,
      salary: job.salary,
      tags: job.tags.join(", "),
    });
    setShowEditModal(true);
  };

  const handleDeleteJob = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleSaveJob = () => {
    if (!jobForm.title.trim() || !jobForm.description.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    const tags = jobForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingJob) {
      setJobs(
        jobs.map((j) =>
          j.id === editingJob.id
            ? {
                ...j,
                ...jobForm,
                tags,
                status: "pending", // Reset to pending after edit
              }
            : j
        )
      );
      toast.success("Job updated successfully!");
      setShowEditModal(false);
    } else {
      const newJob = {
        id: Date.now(),
        ...jobForm,
        tags,
        status: "pending",
        posted: new Date().toISOString().split("T")[0],
      };
      setJobs([...jobs, newJob]);
      toast.success("Job posted successfully! Waiting for approval.");
      setShowPostModal(false);
    }
    resetForm();
    setEditingJob(null);
  };

  const confirmDeleteJob = () => {
    setJobs(jobs.filter((j) => j.id !== jobToDelete.id));
    toast.success("Job deleted!");
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "status-approved",
      pending: "status-pending",
      rejected: "status-rejected",
    };
    return (
      <span className={`status-badge ${styles[status] || ""}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="company-dashboard">
      <div className="company-shell">
        <div className="company-topbar">
          <div className="company-brand">
            <div className="company-logo">LOGO</div>
            <div className="company-nav">
              <button className="company-navbtn active">Company Dashboard</button>
              <button
                className="company-navbtn"
                onClick={() => {
                  logout();
                  nav("/login", { replace: true });
                }}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="company-chip">COMPANY</div>
        </div>

        <div className="company-main">
          <div className="company-pagehead">
            <div>
              <h1>Company Dashboard</h1>
              <p>Manage your job postings and applications</p>
            </div>
            <button className="company-primary" onClick={handlePostJob}>
              + Post New Job
            </button>
          </div>

          <div className="company-stats">
            <div className="company-card">
              <div className="company-stat-title">Total Jobs</div>
              <div className="company-stat-main">{jobs.length}</div>
              <div className="company-stat-sub">
                Approved: {jobs.filter((j) => j.status === "approved").length} • Pending:{" "}
                {jobs.filter((j) => j.status === "pending").length}
              </div>
            </div>
          </div>

          <div className="company-card">
            <div className="company-section-title">My Job Postings</div>

            {jobs.length === 0 ? (
              <p className="empty-state">No jobs posted yet. Click "Post New Job" to get started.</p>
            ) : (
              <div className="jobs-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Posted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <strong>{job.title}</strong>
                          <div className="job-meta-small">{job.level}</div>
                        </td>
                        <td>{job.location}</td>
                        <td>{job.type}</td>
                        <td>{getStatusBadge(job.status)}</td>
                        <td>{job.posted}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => handleEditJob(job)}
                              aria-label="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleDeleteJob(job)}
                              aria-label="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post/Edit Job Modal */}
      <Modal
        isOpen={showPostModal || showEditModal}
        onClose={() => {
          setShowPostModal(false);
          setShowEditModal(false);
          resetForm();
          setEditingJob(null);
        }}
        title={editingJob ? "Edit Job" : "Post New Job"}
        size="large"
      >
        <div className="job-form">
          <label className="field">
            <span>Job Title *</span>
            <input
              className="input"
              value={jobForm.title}
              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
              placeholder="e.g., Backend Developer (Java)"
            />
          </label>

          <label className="field">
            <span>Description *</span>
            <textarea
              className="input"
              rows="5"
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              placeholder="Job description and requirements..."
            />
          </label>

          <div className="form-row">
            <label className="field">
              <span>Location</span>
              <input
                className="input"
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                placeholder="e.g., HCM, Hà Nội, Remote"
              />
            </label>

            <label className="field">
              <span>Type</span>
              <select
                className="input"
                value={jobForm.type}
                onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label className="field">
              <span>Level</span>
              <select
                className="input"
                value={jobForm.level}
                onChange={(e) => setJobForm({ ...jobForm, level: e.target.value })}
              >
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Junior/Middle">Junior/Middle</option>
                <option value="Middle">Middle</option>
                <option value="Middle/Senior">Middle/Senior</option>
                <option value="Senior">Senior</option>
              </select>
            </label>

            <label className="field">
              <span>Salary</span>
              <input
                className="input"
                value={jobForm.salary}
                onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                placeholder="e.g., 20-35M"
              />
            </label>
          </div>

          <label className="field">
            <span>Skills (comma-separated)</span>
            <input
              className="input"
              value={jobForm.tags}
              onChange={(e) => setJobForm({ ...jobForm, tags: e.target.value })}
              placeholder="e.g., Java, Spring, MySQL"
            />
          </label>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSaveJob}>
              {editingJob ? "Update Job" : "Post Job"}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setShowPostModal(false);
                setShowEditModal(false);
                resetForm();
                setEditingJob(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Job"
        size="small"
      >
        <p>Are you sure you want to delete "{jobToDelete?.title}"?</p>
        <p className="text-muted">This action cannot be undone.</p>
        <div className="form-actions">
          <button className="btn btn-danger" onClick={confirmDeleteJob}>
            Delete
          </button>
          <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
