import React, { useState } from "react";
import { api } from "../api";
import { LogIn, UserPlus, Key, Mail, User, ShieldAlert, Phone } from "lucide-react";

export default function Auth({ onLoginSuccess, defaultRole }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (defaultRole) {
      setRole(defaultRole);
    }
  }, [defaultRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(async () => {
      try {
        if (isLogin) {
          const user = await api.login(email, password);
          if (user) {
            onLoginSuccess(user);
          } else {
            setError("Invalid email or password");
          }
        } else {
          if (!name.trim()) throw new Error("Name is required");
          if (!email.trim()) throw new Error("Email is required");
          if (!phone.trim()) throw new Error("Phone number is required");
          if (password.length < 6) throw new Error("Password must be at least 6 characters");
          
          const user = await api.register(name, email, password, phone, role);
          onLoginSuccess(user);
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }, 600); // Simulate subtle loader delay for premium feel
  };



  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      background: "radial-gradient(circle at 10% 20%, var(--primary-light) 0%, transparent 40%), radial-gradient(circle at 90% 80%, var(--accent-light) 0%, transparent 40%)",
      flexDirection: "column",
      gap: "2rem"
    }}>
      <div className="glass-card animate-fade" style={{
        maxWidth: "450px",
        width: "100%",
        padding: "2.5rem 2rem",
        borderRadius: "24px"
      }}>
        {/* Logo/Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.04em" }}>
            Edu<span className="gradient-text">Vantage</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            {isLogin ? "Welcome back! Access your learning portal." : "Start your learning journey today."}
          </p>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: "flex",
          backgroundColor: "var(--bg-tertiary)",
          padding: "0.3rem",
          borderRadius: "12px",
          marginBottom: "2rem"
        }}>
          <button
            onClick={() => { setIsLogin(true); setError(""); }}
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "9px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              backgroundColor: isLogin ? "var(--bg-secondary)" : "transparent",
              color: isLogin ? "var(--primary)" : "var(--text-secondary)",
              boxShadow: isLogin ? "var(--shadow-sm)" : "none",
              transition: "all var(--transition-fast)"
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(""); }}
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "9px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              backgroundColor: !isLogin ? "var(--bg-secondary)" : "transparent",
              color: !isLogin ? "var(--primary)" : "var(--text-secondary)",
              boxShadow: !isLogin ? "var(--shadow-sm)" : "none",
              transition: "all var(--transition-fast)"
            }}
          >
            Register
          </button>
        </div>

        {/* Error Callout */}
        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            backgroundColor: "var(--danger-light)",
            border: "1px solid var(--danger)",
            color: "var(--danger)",
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
            fontWeight: "600"
          }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="register-name">Full Name</label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-tertiary)"
                  }} />
                  <input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    className="form-input"
                    style={{ paddingLeft: "2.5rem" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-phone">Phone Number</label>
                <div style={{ position: "relative" }}>
                  <Phone size={16} style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-tertiary)"
                  }} />
                  <input
                    id="register-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="form-input"
                    style={{ paddingLeft: "2.5rem" }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-role">Account Type</label>
                <div style={{ position: "relative" }}>
                  <select
                    id="register-role"
                    className="form-input"
                    style={{ paddingLeft: "1rem", appearance: "auto", cursor: "pointer" }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator (Admin)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-tertiary)"
              }} />
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label" htmlFor="auth-password">Password</label>
            <div style={{ position: "relative" }}>
              <Key size={16} style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-tertiary)"
              }} />
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.85rem", gap: "0.75rem" }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" style={{
                width: "18px",
                height: "18px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite"
              }} />
            ) : isLogin ? (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>
      </div>


    </div>
  );
}
