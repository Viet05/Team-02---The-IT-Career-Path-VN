import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="nav-wrap">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-text">Logo</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/roadmaps">Roadmaps</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
        </nav>

        <Link to="/login" className="nav-login-btn">Login</Link>
      </div>
    </header>
  );
}
