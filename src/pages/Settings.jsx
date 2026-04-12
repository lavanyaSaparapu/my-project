// Settings.jsx
import React, { useState, useEffect } from "react";
import { useSkillContext } from "../context/SkillContext";
import { ALL_SKILLS, rolesDataRaw } from "../data/SkillData";
import "./Settings.css";

const Settings = () => {
  const { userSkills, updateSkill, selectedRole, setSelectedRole } = useSkillContext();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile settings
  const [displayName, setDisplayName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex@skillradar.com");
  const [avatar, setAvatar] = useState(null);
  const [resumeName, setResumeName] = useState(null);
  const [resumeData, setResumeData] = useState(null); // base64 string

  // Preferences
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [animations, setAnimations] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [defaultRole, setDefaultRole] = useState(selectedRole);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [skillReminders, setSkillReminders] = useState(false);

  // Security
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const allRoles = Object.keys(rolesDataRaw);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDisplayName(parsed.displayName || "Alex Johnson");
        setEmail(parsed.email || "alex@skillradar.com");
        setAnimations(parsed.animations ?? true);
        setCompactView(parsed.compactView ?? false);
        setDefaultRole(parsed.defaultRole || selectedRole);
        setEmailNotifications(parsed.emailNotifications ?? true);
        setPushNotifications(parsed.pushNotifications ?? false);
        setWeeklyReport(parsed.weeklyReport ?? true);
        setSkillReminders(parsed.skillReminders ?? false);
        setTwoFactor(parsed.twoFactor ?? false);
        setSessionTimeout(parsed.sessionTimeout ?? 30);
      } catch(e) { console.warn(e); }
    }
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) setAvatar(savedAvatar);
    const savedResume = localStorage.getItem("resume");
    if (savedResume) {
      const { name, data } = JSON.parse(savedResume);
      setResumeName(name);
      setResumeData(data);
    }
  }, [selectedRole]);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
      localStorage.setItem("avatar", url);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }
    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setResumeData(base64);
      setResumeName(file.name);
      localStorage.setItem("resume", JSON.stringify({ name: file.name, data: base64 }));
      alert("Resume uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    if (window.confirm("Remove your uploaded resume?")) {
      setResumeData(null);
      setResumeName(null);
      localStorage.removeItem("resume");
      alert("Resume removed.");
    }
  };

  const handleSave = () => {
    if (defaultRole !== selectedRole) {
      setSelectedRole(defaultRole);
    }
    const settings = {
      displayName, email, theme, animations, compactView, defaultRole,
      emailNotifications, pushNotifications, weeklyReport, skillReminders,
      twoFactor, sessionTimeout
    };
    localStorage.setItem("settings", JSON.stringify(settings));
    if (avatar) localStorage.setItem("avatar", avatar);
    // resume already saved on upload
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings to default?")) {
      setDisplayName("Alex Johnson");
      setEmail("alex@skillradar.com");
      setAvatar(null);
      setResumeName(null);
      setResumeData(null);
      setTheme("dark");
      setAnimations(true);
      setCompactView(false);
      setDefaultRole(selectedRole);
      setEmailNotifications(true);
      setPushNotifications(false);
      setWeeklyReport(true);
      setSkillReminders(false);
      setTwoFactor(false);
      setSessionTimeout(30);
      localStorage.removeItem("avatar");
      localStorage.removeItem("resume");
      alert("Settings reset to default.");
    }
  };

  // Other handlers (password, clear skills, delete account, notifications, 2FA) remain the same
  const handleChangePassword = () => {
    const newPassword = prompt("Enter new password:");
    if (newPassword && newPassword.length >= 6) {
      alert("Password changed successfully (demo).");
    } else if (newPassword) {
      alert("Password must be at least 6 characters.");
    }
  };

  const handleClearSkillData = () => {
    if (window.confirm("WARNING: This will reset all your skill ratings to 0. Are you sure?")) {
      ALL_SKILLS.forEach(skill => updateSkill(skill, 0));
      alert("All skill data has been cleared.");
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("⚠️ DANGER: This will permanently delete your account. This action cannot be undone. Are you sure?")) {
      localStorage.clear();
      alert("Account deleted. You will be redirected to the homepage.");
      window.location.href = "/";
    }
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  const handlePushNotificationsToggle = async (checked) => {
    if (checked) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setPushNotifications(true);
        alert("Notifications enabled!");
      } else {
        alert("Permission denied. Enable notifications in your browser settings.");
      }
    } else {
      setPushNotifications(false);
    }
  };

  const handleTwoFactorToggle = async (checked) => {
    if (checked) {
      const confirm = window.confirm(
        "Enable Two-Factor Authentication? This will send a verification code to your email (demo)."
      );
      if (confirm) {
        setTwoFactor(true);
        alert("2FA enabled. (Demo – no real changes made.)");
      }
    } else {
      setTwoFactor(false);
      alert("2FA disabled.");
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and application settings</p>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button className={`tab-btn ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
            <span className="tab-icon">👤</span> Profile
          </button>
          <button className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`} onClick={() => setActiveTab("preferences")}>
            <span className="tab-icon">⚙️</span> Preferences
          </button>
          <button className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`} onClick={() => setActiveTab("notifications")}>
            <span className="tab-icon">🔔</span> Notifications
          </button>
          <button className={`tab-btn ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
            <span className="tab-icon">🔒</span> Security
          </button>
          <button className={`tab-btn ${activeTab === "danger" ? "active" : ""}`} onClick={() => setActiveTab("danger")}>
            <span className="tab-icon">⚠️</span> Danger Zone
          </button>
        </div>

        <div className="settings-content">
          {/* Profile Tab – with Resume Upload */}
          {activeTab === "profile" && (
            <div className="settings-section fade-in">
              <h2>Profile Information</h2>
              <div className="avatar-section">
                <div className="avatar-preview">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder">{displayName.charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <label className="avatar-upload">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} />
                  Change Avatar
                </label>
              </div>
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="form-group">
                <label>Default Role</label>
                <select value={defaultRole} onChange={(e) => setDefaultRole(e.target.value)}>
                  {allRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Resume Upload Section */}
              <div className="resume-section">
                <label className="resume-label">Resume / CV</label>
                <div className="resume-controls">
                  <label className="resume-upload-btn">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    Upload Resume
                  </label>
                  {resumeName && (
                    <div className="resume-info">
                      <span className="resume-name">📄 {resumeName}</span>
                      <button className="resume-remove" onClick={handleRemoveResume}>Remove</button>
                    </div>
                  )}
                </div>
                <p className="resume-hint">Accepted formats: PDF, DOC, DOCX (max 5MB)</p>
              </div>
            </div>
          )}

          {/* Preferences Tab – unchanged */}
          {activeTab === "preferences" && (
            <div className="settings-section fade-in">
              <h2>Appearance & Behavior</h2>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Theme</span>
                  <span className="setting-desc">Choose between light and dark mode</span>
                </div>
                <div className="theme-switch">
                  <button className={`theme-option ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")}>☀️ Light</button>
                  <button className={`theme-option ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>🌙 Dark</button>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Animations</span>
                  <span className="setting-desc">Enable smooth transitions and effects</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={animations} onChange={(e) => setAnimations(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Compact View</span>
                  <span className="setting-desc">Show more items per page</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={compactView} onChange={(e) => setCompactView(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {/* Notifications Tab – unchanged */}
          {activeTab === "notifications" && (
            <div className="settings-section fade-in">
              <h2>Notification Preferences</h2>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Email Notifications</span>
                  <span className="setting-desc">Receive updates via email</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Push Notifications</span>
                  <span className="setting-desc">Browser notifications for activity</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={pushNotifications} onChange={(e) => handlePushNotificationsToggle(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Weekly Progress Report</span>
                  <span className="setting-desc">Get a summary of your skill growth</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={weeklyReport} onChange={(e) => setWeeklyReport(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Skill Reminders</span>
                  <span className="setting-desc">Remind me to practice weak skills</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={skillReminders} onChange={(e) => setSkillReminders(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {/* Security Tab – unchanged */}
          {activeTab === "security" && (
            <div className="settings-section fade-in">
              <h2>Security Settings</h2>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Two-Factor Authentication</span>
                  <span className="setting-desc">Add an extra layer of security</span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={twoFactor} onChange={(e) => handleTwoFactorToggle(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Session Timeout</span>
                  <span className="setting-desc">Automatically log out after inactivity</span>
                </div>
                <div className="slider-container">
                  <input type="range" min="5" max="120" step="5" value={sessionTimeout} onChange={(e) => setSessionTimeout(parseInt(e.target.value))} />
                  <span className="slider-value">{sessionTimeout} minutes</span>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Change Password</span>
                  <span className="setting-desc">Update your password regularly</span>
                </div>
                <button className="btn-secondary" onClick={handleChangePassword}>Change Password</button>
              </div>
            </div>
          )}

          {/* Danger Zone Tab – unchanged */}
          {activeTab === "danger" && (
            <div className="settings-section fade-in danger-zone">
              <h2>⚠️ Danger Zone</h2>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Clear All Skill Data</span>
                  <span className="setting-desc">Remove all your skill ratings and progress</span>
                </div>
                <button className="btn-danger" onClick={handleClearSkillData}>Clear Data</button>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Delete Account</span>
                  <span className="setting-desc">Permanently delete your account and all data</span>
                </div>
                <button className="btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="settings-actions">
            <button className="btn-primary" onClick={handleSave}>Save Changes</button>
            <button className="btn-secondary" onClick={handleReset}>Reset to Default</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;