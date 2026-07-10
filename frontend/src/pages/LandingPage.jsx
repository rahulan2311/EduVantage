import React from "react";
import { BookOpen, GraduationCap, Award, Settings, Layers, ChevronRight } from "lucide-react";

export default function LandingPage({ onSelectPortal, theme }) {
  // Adaptive overlays for light and dark themes
  const heroBackgroundStyle = {
    position: "relative",
    padding: "6rem 2rem 5rem 2rem",
    background: theme === "dark"
      ? "linear-gradient(135deg, rgba(8,12,20,0.92) 0%, rgba(12,18,30,0.96) 100%), url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200')"
      : "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.65) 100%), url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=1200')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderBottom: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "75vh"
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      backgroundColor: "var(--bg-primary)"
    }} className="animate-fade">
      
      {/* Landing Sticky Navbar */}
      <header className="glass-panel" style={{
        position: "sticky",
        top: 0,
        height: "var(--header-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        zIndex: 100,
        borderBottom: "1px solid var(--border-color)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)" }}>
          <BookOpen size={26} strokeWidth={2.5} />
          <h1 style={{ fontSize: "1.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
            Edu<span className="gradient-text">Vantage</span>
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Admin Entry Button */}
          <button 
            onClick={() => onSelectPortal("admin")}
            className="btn btn-outline"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
          >
            <span>Admin Portal</span>
          </button>

          {/* Student Entry Button */}
          <button 
            onClick={() => onSelectPortal("student")}
            className="btn btn-primary"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", gap: "0.4rem" }}
          >
            <span>Student Portal</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </header>

      {/* HERO SECTION WITH DYNAMIC GRAPHICS */}
      <section id="overview" style={heroBackgroundStyle}>
        <div style={{
          maxWidth: "1100px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "3rem",
          alignItems: "center"
        }} className="landing-split-layout">
          
          {/* Left Text Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "left" }} className="landing-left-text">
            <span className="badge badge-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", letterSpacing: "0.1em", width: "fit-content" }}>
              Next-Generation Academic Platform
            </span>

            <h2 style={{
              fontSize: "3.25rem",
              fontWeight: "800",
              letterSpacing: "-0.04em",
              lineHeight: "1.15",
              color: "var(--text-primary)"
            }}>
              Online Course & <span className="gradient-text">Learning Management System</span>
            </h2>

            <p style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              maxWidth: "550px"
            }}>
              Empower your students with curriculum building, module syllabus workspaces, custom timed assessments, progress analytics, and print-ready digital certificates.
            </p>

            {/* Direct Login Portal Options */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button 
                onClick={() => onSelectPortal("student")}
                className="btn btn-primary"
                style={{ 
                  padding: "0.85rem 2.25rem", 
                  fontSize: "1rem", 
                  borderRadius: "12px", 
                  gap: "0.6rem"
                }}
              >
                <span>Student Portal</span>
                <ChevronRight size={18} />
              </button>

              <button 
                onClick={() => onSelectPortal("admin")}
                className="btn btn-outline"
                style={{ 
                  padding: "0.85rem 2.25rem", 
                  fontSize: "1rem", 
                  borderRadius: "12px"
                }}
              >
                <span>Admin Console</span>
              </button>
            </div>
          </div>

          {/* Right Visual Column (Study Desk mock layout with glass card) */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }} className="landing-right-graphic">
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "400px",
              height: "300px",
              borderRadius: "24px",
              boxShadow: "var(--shadow-xl)",
              overflow: "hidden",
              border: "1px solid var(--border-color)"
            }}>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600" 
                alt="Students studying collaboratively"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.4) 100%)"
              }} />
            </div>

            {/* Overlay Glass Card */}
            <div className="glass-panel" style={{
              position: "absolute",
              bottom: "-25px",
              left: "-15px",
              padding: "1rem 1.5rem",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--glass-border)"
            }}>
              <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", display: "block", fontWeight: "700" }}>STUDY STATUS</span>
                <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text-primary)" }}>Active & Enrolled</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS IMPACT GRID */}
      <section id="statistics" style={{ padding: "4.5rem 2rem", backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h3 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "800", marginBottom: "3rem" }}>Our Platform Impact</h3>
          <div className="dashboard-grid">
            <div className="glass-card" style={{ textAlign: "center", padding: "2rem" }}>
              <h4 style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--primary)", marginBottom: "0.25rem" }}>12k+</h4>
              <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "600" }}>Registered Students</span>
            </div>
            <div className="glass-card" style={{ textAlign: "center", padding: "2rem" }}>
              <h4 style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--accent)", marginBottom: "0.25rem" }}>99.4%</h4>
              <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "600" }}>Quiz Passing Rate</span>
            </div>
            <div className="glass-card" style={{ textAlign: "center", padding: "2rem" }}>
              <h4 style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--success)", marginBottom: "0.25rem" }}>45+</h4>
              <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "600" }}>Expert Curriculums</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" style={{ padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="badge badge-primary">Comprehensive Features</span>
          <h3 style={{ fontSize: "2.25rem", fontWeight: "800", marginTop: "0.5rem" }}>Core Academic Modules</h3>
        </div>

        <div className="card-grid">
          {/* Card 1 */}
          <div className="glass-card">
            <div style={{ padding: "0.6rem", borderRadius: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)", width: "fit-content", marginBottom: "1rem" }}>
              <GraduationCap size={24} />
            </div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>Student Portals</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Detailed course progress bars, certificates summary trackers, assessment logs, and smart suggestions for future learning paths.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card">
            <div style={{ padding: "0.6rem", borderRadius: "10px", backgroundColor: "var(--accent-light)", color: "var(--accent)", width: "fit-content", marginBottom: "1rem" }}>
              <Layers size={24} />
            </div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>Syllabus Accordions</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Read code-blocks and formatted text side-by-side with interactive lesson checklist boxes that update student stats in real-time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card">
            <div style={{ padding: "0.6rem", borderRadius: "10px", backgroundColor: "var(--success-light)", color: "var(--success)", width: "fit-content", marginBottom: "1rem" }}>
              <Award size={24} />
            </div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>Assessments & Certs</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Take assessments with countdown timers and immediate score reports. Earn golden border completion certificates on passing grades.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card">
            <div style={{ padding: "0.6rem", borderRadius: "10px", backgroundColor: "var(--warning-light)", color: "var(--warning)", width: "fit-content", marginBottom: "1rem" }}>
              <Settings size={24} />
            </div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>Admin Syllabus Builder</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Create full courses, customize level options, build questionnaires, add modules, toggle user accounts, and review metrics.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        marginTop: "auto",
        borderTop: "1px solid var(--border-color)",
        padding: "1.5rem 2rem",
        textAlign: "center",
        fontSize: "0.85rem",
        color: "var(--text-tertiary)",
        backgroundColor: "var(--bg-secondary)"
      }}>
        <p>© 2026 EduVantage. Designed for seamless Python FastAPI/Flask backend integration.</p>
      </footer>

      <style>{`
        @media (max-width: 1024px) {
          .landing-split-layout {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .landing-left-text {
            text-align: center !important;
            align-items: center !important;
          }
          .landing-right-graphic {
            order: -1 !important;
          }
        }
        @media (max-width: 768px) {
          .landing-nav-links {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
