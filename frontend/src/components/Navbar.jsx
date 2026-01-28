import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUserState } from "../store/useLocalStorage";
import "../styles/navbar.css";

export default function Navbar() {
  const nav = useNavigate();
  const { user, logout } = useUserState();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Đóng dropdown khi click ra ngoài + bấm ESC
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    nav("/", { replace: true });
  };

  const toggleAccountMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  return (
    <header className="nav-wrap">
      <div className="nav-inner">
        {/* Brand */}
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src="/logo.jpg" alt="DevRoadMap" className="brand-logo" />
          <span className="brand-text">DevRoadMap</span>
        </Link>

        {/* Links */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
            About
          </NavLink>
          <NavLink to="/roadmaps" className={({ isActive }) => (isActive ? "active" : "")}>
            Roadmaps
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => (isActive ? "active" : "")}>
            Jobs
          </NavLink>
        </nav>

        {/* Right */}
        {!user ? (
          <Link to="/auth/login" className="nav-login-btn">
            Login
          </Link>
        ) : (
          <div className="account" ref={menuRef}>
            <button
              type="button"
              className={`nav-login-btn ${open ? "is-open" : ""}`}
              onClick={toggleAccountMenu}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              {user.name || "Account"}
            </button>

            {open && (
              <div className="account-dropdown" role="menu">
                <Link to="/hub" className="account-item" onClick={closeMenu} role="menuitem">
                  Learning Hub
                </Link>
                <Link to="/profile" className="account-item" onClick={closeMenu} role="menuitem">
                  Profile
                </Link>
                <Link to="/skills" className="account-item" onClick={closeMenu} role="menuitem">
                  Skills
                </Link>
                <button
                  type="button"
                  className="account-item account-item--danger"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
        