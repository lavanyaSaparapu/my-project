import { useState, useEffect, useRef, useCallback } from "react";
import "./Settings.css";

// ========== AVATAR UPLOAD ==========
const AvatarUpload = ({ avatar, setAvatar }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`avatar-area ${dragActive ? "drag-active" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      {avatar ? (
        <img src={avatar} alt="avatar" className="avatar-preview" />
      ) : (
        <div className="avatar-placeholder">
          <span className="material-symbol">📸</span>
          <p>Click or drag image</p>
        </div>
      )}
      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
      {avatar && <div className="avatar-overlay">Change</div>}
    </div>
  );
};

// ========== TOOLTIP ==========
const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="tooltip-wrapper" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <div className="tooltip">{text}</div>}
    </div>
  );
};

// ========== MAIN COMPONENT ==========
export default function Settings() {
  // ---------- STATE ----------
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("settings_darkMode") === "true");
  const [emailNotif, setEmailNotif] = useState(() => localStorage.getItem("settings_emailNotif") !== "false");
  const [pushNotif, setPushNotif] = useState(() => localStorage.getItem("settings_pushNotif") === "true");
  const [soundNotif, setSoundNotif] = useState(() => localStorage.getItem("settings_soundNotif") === "true");
  const [accent, setAccent] = useState(() => localStorage.getItem("settings_accent") || "#6366f1");
  const [name, setName] = useState(() => localStorage.getItem("settings_name") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("settings_email") || "");
  const [bio, setBio] = useState(() => localStorage.getItem("settings_bio") || "");
  const [avatar, setAvatar] = useState(() => localStorage.getItem("settings_avatar") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  // Persist non‑sensitive settings instantly (except password)
  useEffect(() => {
    localStorage.setItem("settings_darkMode", darkMode);
    localStorage.setItem("settings_emailNotif", emailNotif);
    localStorage.setItem("settings_pushNotif", pushNotif);
    localStorage.setItem("settings_soundNotif", soundNotif);
    localStorage.setItem("settings_accent", accent);
    localStorage.setItem("settings_name", name);
    localStorage.setItem("settings_email", email);
    localStorage.setItem("settings_bio", bio);
    localStorage.setItem("settings_avatar", avatar);
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    document.documentElement.style.setProperty("--accent", accent);
  }, [darkMode, emailNotif, pushNotif, soundNotif, accent, name, email, bio, avatar]);

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network
    if (password) {
      localStorage.setItem("settings_password", btoa(password)); // dummy encryption
      setPassword("");
      setConfirmPassword("");
    }
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const exportSettings = () => {
    const settings = {
      darkMode, emailNotif, pushNotif, soundNotif, accent, name, email, bio, avatar
    };
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "settings_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        setDarkMode(data.darkMode ?? darkMode);
        setEmailNotif(data.emailNotif ?? emailNotif);
        setPushNotif(data.pushNotif ?? pushNotif);
        setSoundNotif(data.soundNotif ?? soundNotif);
        setAccent(data.accent ?? accent);
        setName(data.name ?? name);
        setEmail(data.email ?? email);
        setBio(data.bio ?? bio);
        setAvatar(data.avatar ?? avatar);
      } catch (err) { alert("Invalid file"); }
    };
    reader.readAsText(file);
  };

  const strengthLabel = ["Weak", "Fair", "Good", "Strong"][passwordStrength] || "Very Weak";
  const strengthColor = ["#ef4444", "#f59e0b", "#eab308", "#10b981"][passwordStrength] || "#ef4444";

  return (
    <div className="settings-container">
      {saved && <div className="save-popup">✨ Settings Saved Successfully</div>}

      {/* Animated gradient orbs */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      <div className="settings-header">
        <h1 className="settings-title">
          <span className="title-icon">⚙️</span> Dashboard Preferences
        </h1>
        <div className="header-actions">
          <Tooltip text="Export settings as JSON">
            <button className="icon-btn" onClick={exportSettings}>📤</button>
          </Tooltip>
        </div>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        {["profile", "appearance", "notifications", "security"].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "profile" && "👤 Profile"}
            {tab === "appearance" && "🎨 Appearance"}
            {tab === "notifications" && "🔔 Notifications"}
            {tab === "security" && "🔐 Security"}
          </button>
        ))}
      </div>

      <div className="settings-content">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="settings-card glass-card animate-in">
            <div className="profile-layout">
              <AvatarUpload avatar={avatar} setAvatar={setAvatar} />
              <div className="profile-fields">
                <div className="input-group floating">
                  <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder=" " />
                  <label htmlFor="name">Full Name</label>
                </div>
                <div className="input-group floating">
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " />
                  <label htmlFor="email">Email Address</label>
                </div>
                <div className="input-group floating">
                  <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder=" " rows="2" />
                  <label htmlFor="bio">Short Bio</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPEARANCE TAB */}
        {activeTab === "appearance" && (
          <div className="settings-card glass-card animate-in">
            <div className="toggle-row">
              <span>🌙 Dark Mode</span>
              <label className="switch">
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="accent-picker">
              <span>🎨 Primary Color</span>
              <div className="colors">
                {["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"].map(c => (
                  <div key={c} className={`color-chip ${accent === c ? "selected" : ""}`} style={{ background: c }} onClick={() => setAccent(c)}>
                    {accent === c && <span className="check-mark">✓</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="preview-card">
              <p>Live preview</p>
              <div className="preview-elements">
                <button className="preview-btn" style={{ background: accent }}>Accent Button</button>
                <div className="preview-switch">
                  <label className="switch"><input type="checkbox" checked /><span className="slider round"></span></label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="settings-card glass-card animate-in">
            <div className="toggle-row">
              <span>📧 Email Notifications</span>
              <label className="switch"><input type="checkbox" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} /><span className="slider round"></span></label>
            </div>
            <div className="toggle-row">
              <span>📱 Push Notifications</span>
              <label className="switch"><input type="checkbox" checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} /><span className="slider round"></span></label>
            </div>
            <div className="toggle-row">
              <span>🔊 Sound Effects</span>
              <label className="switch"><input type="checkbox" checked={soundNotif} onChange={() => setSoundNotif(!soundNotif)} /><span className="slider round"></span></label>
            </div>
            <div className="notification-demo">
              <p>🔔 Test notification</p>
              <button className="test-notif" onClick={() => alert("🔔 Notification demo!")}>Send Test</button>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="settings-card glass-card animate-in">
            <div className="input-group floating">
              <input id="newPass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " />
              <label htmlFor="newPass">New Password</label>
            </div>
            {password && (
              <div className="strength-meter">
                <div className="strength-fill" style={{ width: `${(passwordStrength / 4) * 100}%`, background: strengthColor }} />
                <span className="strength-text" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
            <div className="input-group floating">
              <input id="confirmPass" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder=" " />
              <label htmlFor="confirmPass">Confirm Password</label>
            </div>
            {confirmPassword && password !== confirmPassword && <div className="error-msg">❌ Passwords do not match</div>}
            <div className="security-note">
              🔒 Your password is hashed and never stored in plain text.
            </div>
          </div>
        )}
      </div>

      {/* SAVE BUTTON with loading state */}
      <button className="save-btn" onClick={handleSave} disabled={isSaving}>
        {isSaving ? (
          <span className="loader"></span>
        ) : (
          <>💾 Save All Changes</>
        )}
      </button>

      {/* Floating keyboard hint */}
      <div className="keyboard-hint">
        <kbd>Ctrl</kbd> + <kbd>S</kbd> to save
      </div>
    </div>
  );
}