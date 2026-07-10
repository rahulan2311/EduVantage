import React from "react";
import { LayoutDashboard, BookOpen, Settings, Award, GraduationCap, ChevronRight, X, Users } from "lucide-react";

export default function Sidebar({ 
  user, 
  activeTab, 
  setActiveTab, 
  enrolledCourses = [], 
  onSelectCourse, 
  isOpen, 
  onClose 
}) {
  const isStudent = user?.role === "student";
  const isAdmin = user?.role === "admin";

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 98,
            transition: "opacity 0.3s ease"
          }}
        />
      )}

      <aside 
        className={`sidebar-nav glass-panel ${isOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: "var(--header-height)",
          left: 0,
          bottom: 0,
          width: "var(--sidebar-width)",
          borderRight: "1px solid var(--border-color)",
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          zIndex: 99,
          transition: "transform var(--transition-normal)",
          overflowY: "auto"
        }}
      >
        {/* Mobile Close Button */}
        <div style={{ display: "none", justifyContent: "flex-end", marginBottom: "-1rem" }} className="mobile-close-container">
          <button onClick={onClose} style={{ color: "var(--text-primary)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* User Quick Info */}
        <div style={{ padding: "0.5rem" }}>
          <span style={{ 
            fontSize: "0.75rem", 
            fontWeight: "700", 
            color: "var(--text-tertiary)", 
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Navigation
          </span>
        </div>

        {/* Nav Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {isStudent && (
            <>
              <button
                onClick={() => handleNavClick("student-dashboard")}
                className={`sidebar-item ${activeTab === "student-dashboard" ? "active" : ""}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavClick("all-courses")}
                className={`sidebar-item ${activeTab === "all-courses" ? "active" : ""}`}
              >
                <BookOpen size={18} />
                <span>Browse Courses</span>
              </button>
              <button
                onClick={() => handleNavClick("quiz-dashboard")}
                className={`sidebar-item ${activeTab === "quiz-dashboard" ? "active" : ""}`}
              >
                <Award size={18} />
                <span>Quiz Dashboard</span>
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <div style={{ padding: "0.5rem 0.5rem 0.25rem 0.5rem" }}>
                <span style={{ 
                  fontSize: "0.7rem", 
                  fontWeight: "800", 
                  color: "var(--text-tertiary)", 
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Admin Control
                </span>
              </div>
              <button
                onClick={() => handleNavClick("admin-courses")}
                className={`sidebar-item ${activeTab === "admin-courses" ? "active" : ""}`}
              >
                <BookOpen size={18} />
                <span>Manage Courses</span>
              </button>
              <button
                onClick={() => handleNavClick("admin-quizzes")}
                className={`sidebar-item ${activeTab === "admin-quizzes" ? "active" : ""}`}
              >
                <Award size={18} />
                <span>Assessments & Quizzes</span>
              </button>
              <button
                onClick={() => handleNavClick("admin-users")}
                className={`sidebar-item ${activeTab === "admin-users" ? "active" : ""}`}
              >
                <Users size={18} />
                <span>Users Directory</span>
              </button>
            </>
          )}
        </nav>

        {/* My Courses Section (Students Only) */}
        {isStudent && enrolledCourses.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
            <div style={{ padding: "0 0.5rem" }}>
              <span style={{ 
                fontSize: "0.75rem", 
                fontWeight: "700", 
                color: "var(--text-tertiary)", 
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Enrolled Courses
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {enrolledCourses.map(course => (
                <button
                  key={course.id}
                  onClick={() => {
                    onSelectCourse(course.id);
                    if (onClose) onClose();
                  }}
                  className="sidebar-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                    padding: "0.6rem 0.75rem",
                    fontSize: "0.8rem",
                    borderRadius: "8px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "85%" }}>
                    <GraduationCap size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    <span style={{ 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis" 
                    }}>
                      {course.title}
                    </span>
                  </div>
                  <ChevronRight size={12} style={{ color: "var(--text-tertiary)" }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <style>{`
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          width: 100%;
          text-align: left;
        }
        
        .sidebar-item:hover {
          color: var(--primary);
          background-color: var(--bg-tertiary);
          transform: translateX(2px);
        }
        
        .sidebar-item.active {
          color: var(--primary);
          background-color: var(--primary-light);
          box-shadow: inset 3px 0 0 0 var(--primary);
        }

        @media (max-width: 1024px) {
          .sidebar-nav {
            transform: translateX(-100%);
            top: 0 !important;
            height: 100vh !important;
            box-shadow: var(--shadow-xl) !important;
            z-index: 150 !important;
          }
          .sidebar-nav.open {
            transform: translateX(0);
          }
          .mobile-close-container {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
