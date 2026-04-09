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
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <>
      <nav className={`navbar-welcome ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container-welcome">
          {/* LOGO (matching Welcome page) */}
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
            {/* User Menu */}
            <div className="user-menu-welcome" ref={userMenuRef}>
              <button
                className="user-avatar-welcome"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {auth.currentUser?.email?.charAt(0).toUpperCase() || "U"}
              </button>

              {userMenuOpen && (
                <div className="user-dropdown-welcome">
                  <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
                  <button onClick={() => navigate("/reports")}>📑 Reports</button>
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="mobile-toggle-welcome"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU (drawer) */}
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
          <button onClick={handleLogout}>🚪 Logout</button>
        </div>
      )}
    </>
  );
};

export default Navbar;