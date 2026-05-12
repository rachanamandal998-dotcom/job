import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../component/style.css";


const NAV_LINKS = [
  { label: "Job Portal", path: "/jobs", icon: "💼" },
  { label: "Product Listing", path: "/products", icon: "🛒" },
  { label: "Service Listing", path: "/services", icon: "🛠️" },
];

export default function Navbar({ userName = "Rachana", verified = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setMenuOpen(false);
    navigate("/jobs");
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate("/jobs")}>
          🏪 Sindhuli Bazar
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-link-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {verified && (
            <span className="verified-badge">✅ CV Verified</span>
          )}

          <div className="navbar-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile Button */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? "drawer-open" : ""}`}>
        <div className="drawer-user">
          <div className="drawer-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="drawer-name">Hi, {userName}!</div>
            {verified && (
              <div className="drawer-verified">✅ CV Verified</div>
            )}
          </div>
        </div>

        <div className="drawer-links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "drawer-link drawer-link-active"
                  : "drawer-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              <span>{link.icon}</span> {link.label}
            </NavLink>
          ))}
        </div>

        <button className="drawer-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
