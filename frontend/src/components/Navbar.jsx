import React, { useState, useRef } from "react";
import { Sun, Moon, LogOut, BookOpen, Menu, Camera } from "lucide-react";

export default function Navbar({ user, onLogout, onUpdateAvatar, theme, toggleTheme, toggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert file to Base64 data URI to store locally
    const reader = new FileReader();
    reader.onloadend = () => {
      if (onUpdateAvatar) {
        onUpdateAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <nav className="glass-panel" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "var(--header-height)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.5rem",
      zIndex: 90,
      borderBottom: "1px solid var(--border-color)"
    }}>
      {/* Hidden File Picker Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        style={{ display: "none" }} 
        onChange={handleFileChange} 
      />

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button 
          onClick={toggleSidebar} 
          className="btn-mobile-toggle"
          style={{
            display: "none",
            padding: "0.5rem",
            borderRadius: "8px",
            cursor: "pointer",
            color: "var(--text-primary)"
          }}
        >
          <Menu size={20} />
        </button>
        
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)" }}>
          <BookOpen size={26} strokeWidth={2.5} />
          <h1 style={{ fontSize: "1.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
            Edu<span className="gradient-text">Vantage</span>
          </h1>
        </div>
      </div>
 
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: "0.5rem",
            borderRadius: "10px",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all var(--transition-fast)"
          }}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user && (
          <div style={{ position: "relative" }}>
            {/* User Profile Summary - Access Trigger */}
            <div 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.75rem", 
                cursor: "pointer", 
                padding: "0.25rem 0.6rem", 
                borderRadius: "12px", 
                transition: "background var(--transition-fast)",
                userSelect: "none"
              }}
              className="navbar-profile-trigger"
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--primary)"
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }} className="profile-details-nav">
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>
                  {user.name}
                </span>
                <span className={`badge ${user.role === "admin" ? "badge-danger" : "badge-primary"}`} style={{ 
                  alignSelf: "flex-start", 
                  fontSize: "0.6rem", 
                  padding: "0.05rem 0.4rem",
                  marginTop: "0.1rem"
                }}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Profile Access Dropdown Popover */}
            {menuOpen && (
              <>
                {/* Backdrop handler to close menu */}
                <div 
                  onClick={() => setMenuOpen(false)}
                  style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                />

                <div 
                  className="glass-panel animate-fade" 
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "0.5rem",
                    width: "260px",
                    padding: "1.25rem 1rem",
                    borderRadius: "16px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)"
                  }}
                >
                  {/* Account profile header with Avatar */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
                    <div style={{ position: "relative" }} className="avatar-edit-container">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                        alt={user.name}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          border: "2.5px solid var(--primary)",
                          objectFit: "cover",
                          marginBottom: "0.25rem"
                        }}
                      />
                      <button 
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        style={{
                          position: "absolute",
                          bottom: "4px",
                          right: "0px",
                          backgroundColor: "var(--primary)",
                          color: "#ffffff",
                          border: "1.5px solid var(--bg-secondary)",
                          borderRadius: "50%",
                          padding: "0.25rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title="Choose Local Photo"
                      >
                        <Camera size={10} />
                      </button>
                    </div>

                    <span style={{ fontSize: "0.9rem", fontWeight: "700", display: "block", marginTop: "0.25rem" }}>{user.name}</span>
                    <span className={`badge ${user.role === "admin" ? "badge-danger" : "badge-primary"}`} style={{ fontSize: "0.6rem", padding: "0.05rem 0.4rem", marginTop: "0.2rem" }}>
                      {user.role}
                    </span>
                  </div>

                  {/* Profile Details (Email, Phone) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", textAlign: "left" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.02em" }}>Email Address</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)", wordBreak: "break-all" }}>{user.email}</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.02em" }}>Phone Number</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)" }}>{user.phone || "+1 (555) 012-3456"}</span>
                    </div>
                  </div>

                  <div style={{ height: "1px", backgroundColor: "var(--border-color)" }} />

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.55rem 1rem",
                      width: "100%",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: "none"
                    }}
                    className="btn btn-danger"
                  >
                    <LogOut size={14} />
                    <span>Logout Session</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        .navbar-profile-trigger:hover {
          background-color: var(--bg-tertiary);
        }
        @media (max-width: 1024px) {
          .btn-mobile-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .profile-details-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
