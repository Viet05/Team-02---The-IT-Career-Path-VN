import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { authService } from "../services/auth";
import { http } from "../services/http";
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

  // Fetch users từ API khi component load
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await authService.getUserInfo();
        console.log("📊 Fetched users:", data);
        
        // Nếu data là array, dùng trực tiếp; nếu không, dùng MOCK_USERS
        if (Array.isArray(data)) {
          setUsers(data);
          toast.success(`Loaded ${data.length} users from API`);
        } else {
          console.warn("API did not return an array, using mock data");
          toast.info("Using mock data");
        }
      } catch (error) {
        console.error("❌ Failed to load users:", error);
        toast.error("Failed to load users from API");
     
      }
    };
    
    loadUsers();
  }, []);

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

  const handleSaveEdit = async () => {
    if (!editForm.username.trim() || !editForm.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Xác định ID property
      const userId = editingUser.id || editingUser.users_id || editingUser.userId;
      
      if (!userId) {
        console.error("❌ User ID undefined:", editingUser);  
        toast.error("User ID not found");
        return;
      }
      
      console.log("📝 Updating user:", userId, editForm);
      
      // Gọi API update user
      const res = await http.post(`/api/it-path/admin/users/${userId}`, editForm);
      console.log("✅ Update response:", res.data);
      
      // Update state local
      setUsers(
        users.map((u) =>
          (u.id || u.users_id || u.userId) === userId ? { ...u, ...editForm } : u
        )
      );
      toast.success("User updated successfully!");
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error("❌ Update error:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Xác định ID property - có thể là 'id', 'users_id', 'userId'
      const userId = userToDelete.id || userToDelete.users_id || userToDelete.userId;
      
      if (!userId) {
        console.error("❌ User ID undefined:", userToDelete);
        toast.error("User ID not found");
        return;
      }
      
      console.log("🗑️ Deleting user:", userId, userToDelete);
      
      // Gọi API delete user
      const res = await http.delete(`/api/it-path/admin/users/${userId}`);
      console.log("✅ Delete response:", res.data);
      
      // Update state local
      setUsers(users.filter((u) => (u.id || u.users_id || u.userId) !== userId));
      toast.success("User deleted successfully!");
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error("Failed to delete user");
    }
  };

  const resetFilters = () => {
    setFilterRole("");
    setFilterStatus("");
    setSearchTerm("");
  };

  // Hàm thay đổi status user (block/unblock)
  const handleToggleStatus = async (user) => {
    try {
      // Debug: log toàn bộ user object
      console.log("📋 Full user object:", user);
      
      // User từ API có property userId, không phải id
      const userId = user.userId || user.id || user.users_id;
      const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      
      if (!userId) {
        console.error("❌ User ID undefined:", user);
        toast.error("User ID not found");
        return;
      }
      
      console.log("🔄 Toggling user status:", userId, "->", newStatus);
      
      // Gọi API block/unblock user
      const res = await http.post(`/api/it-path/admin/users/${userId}/status`);
      console.log("✅ Status toggle response:", res.data);
      
      // Update state local
      setUsers(
        users.map((u) => {
          const uId = u.userId || u.id || u.users_id;
          if (uId === userId) {
            console.log("✅ Updated user:", u.username, "status:", newStatus);
            return { ...u, status: newStatus };
          }
          return u;
        })
      );
      toast.success(`User ${newStatus === "ACTIVE" ? "activated" : "blocked"} successfully!`);
    } catch (error) {
      console.error("❌ Status toggle error:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed: " + (error.response?.data?.message || error.message));
    }
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
                              title="Edit user"
                            >
                              ✏️
                            </button>
                            <button
                              className={`btn-icon ${user.status === "ACTIVE" ? "btn-block" : "btn-activate"}`}
                              onClick={() => handleToggleStatus(user)}
                              aria-label={user.status === "ACTIVE" ? "Block" : "Activate"}
                              title={user.status === "ACTIVE" ? "Block user" : "Activate user"}
                            >
                              {user.status === "ACTIVE" ? "🚫" : "✅"}
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleDelete(user)}
                              aria-label="Delete"
                              title="Delete user"
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
