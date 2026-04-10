import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase/FireBaseConfig";
import { signOut } from "firebase/auth";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  // Nav items
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/learning-path", label: "Learning Path", icon: "🗺️" },
    { path: "/progress-tracking", label: "Progress", icon: "📶" },
    { path: "/practice", label: "Practice", icon: "🎯" },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => document.body.classList.remove("drawer-open");
  }, [mobileMenuOpen]);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // Open drawer – also close user dropdown (if open)
  const openDrawer = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(true);
  };

  return (
    <>
      <nav className={`navbar-welcome ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container-welcome">
          {/* LOGO */}
          <div className="brand-enhanced" onClick={() => navigate("/dashboard")}>
            <div className="logo-enhanced">
              <svg className="logo-svg" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 7H9L12 2Z" fill="currentColor" />
                <path d="M12 7V22" stroke="currentColor" strokeWidth="2" />
                <path d="M5 22H19" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="18" r="3" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h2 className="brand-name animate-gradient">SkillRadar</h2>
              <p className="brand-tagline">Your Personal Skill Compass</p>
            </div>
          </div>

          {/* DESKTOP NAVIGATION LINKS */}
          <div className="nav-links-welcome">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`nav-link-welcome ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="nav-actions-welcome">
            {/* User Menu (Desktop only – dropdown) */}
            <div className="user-menu-welcome" ref={userMenuRef}>
              <button
                className="user-avatar-welcome"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {auth.currentUser?.email?.charAt(0).toUpperCase() || "U"}
              </button>

              {/* Desktop dropdown – hidden on mobile via CSS */}
              {userMenuOpen && (
                <div className="user-dropdown-welcome">
                  <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
                  <button onClick={() => navigate("/reports")}>📑 Reports</button>
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>

            {/* Mobile Toggle with animated X */}
            <button
              className={`mobile-toggle-welcome ${mobileMenuOpen ? "open" : ""}`}
              onClick={openDrawer}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE DRAWER (SIDEBAR) – includes profile links */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-welcome">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              <span className="drawer-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="drawer-divider"></div>
          <button
            onClick={() => {
              navigate("/settings");
              setMobileMenuOpen(false);
            }}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => {
              navigate("/reports");
              setMobileMenuOpen(false);
            }}
          >
            📑 Reports
          </button>
          <button onClick={handleLogout}>🚪 Logout</button>
        </div>
      )}
    </>
  );
};

export default Navbar;