import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import Modal from "../components/Modal";
import { toast } from "../components/Toast";
import "../styles/admin-user-list.css";

const MOCK_USERS = [
  {
    id: 1,
    username: "student01",
    email: "student01@example.com",
    role: "STUDENT",
    status: "ACTIVE",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    username: "company01",
    email: "company01@example.com",
    role: "COMPANY",
    status: "ACTIVE",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    username: "student02",
    email: "student02@example.com",
    role: "STUDENT",
    status: "INACTIVE",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    username: "company02",
    email: "company02@example.com",
    role: "COMPANY",
    status: "ACTIVE",
    createdAt: "2024-01-18",
  },
];

export default function AdminUserList() {
  const nav = useNavigate();
  const { logout } = useUserState();
  const [users, setUsers] = useState(MOCK_USERS);
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "STUDENT",
    status: "ACTIVE",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = !filterRole || user.role === filterRole;
      const matchesStatus = !filterStatus || user.status === filterStatus;
      const matchesSearch =
        !searchTerm ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, filterRole, filterStatus, searchTerm]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.username.trim() || !editForm.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUsers(
      users.map((u) =>
        u.id === editingUser.id ? { ...u, ...editForm } : u
      )
    );
    toast.success("User updated successfully!");
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== userToDelete.id));
    toast.success("User deleted successfully!");
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const resetFilters = () => {
    setFilterRole("");
    setFilterStatus("");
    setSearchTerm("");
  };

  return (
    <div className="admin-user-list">
      <div className="admin-shell">
        <div className="admin-topbar">
          <div className="admin-brand">
            <div className="admin-logo">LOGO</div>
            <div className="admin-nav">
              <button className="admin-navbtn" onClick={() => nav("/admin")}>
                Dashboard
              </button>
              <button className="admin-navbtn active">Manage Users</button>
              <button className="admin-navbtn" onClick={() => nav("/admin/jobs")}>
                Approve Jobs
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
          <div className="admin-pagehead">
            <div>
              <h1>Manage Users</h1>
              <p>View, edit, and manage user accounts</p>
            </div>
          </div>

          <div className="admin-card">
            <div className="filters-section">
              <div className="filter-group">
                <input
                  className="input"
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <select
                  className="input"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="STUDENT">Student</option>
                  <option value="COMPANY">Company</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="filter-group">
                <select
                  className="input"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <button className="btn btn-outline" onClick={resetFilters}>
                Reset
              </button>
            </div>

            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.createdAt}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => handleEdit(user)}
                              aria-label="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleDelete(user)}
                              aria-label="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>Total: {filteredUsers.length} users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        title="Edit User"
      >
        <div className="user-form">
          <label className="field">
            <span>Username *</span>
            <input
              className="input"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Email *</span>
            <input
              className="input"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Role</span>
            <select
              className="input"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              <option value="STUDENT">Student</option>
              <option value="COMPANY">Company</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>

          <label className="field">
            <span>Status</span>
            <select
              className="input"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSaveEdit}>
              Save
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingUser(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        size="small"
      >
        <p>Are you sure you want to delete user "{userToDelete?.username}"?</p>
        <p className="text-muted">This action cannot be undone.</p>
        <div className="form-actions">
          <button className="btn btn-danger" onClick={confirmDelete}>
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
