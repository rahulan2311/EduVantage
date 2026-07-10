import React, { useState } from "react";
import { api } from "../api";
import { Search, GraduationCap, Award, BookOpen, Filter, ArrowRight } from "lucide-react";

export default function Courses({ 
  user, 
  courses = [], 
  enrollments = [], 
  onSelectCourse, 
  onRefreshDB 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState("");

  // Extract Categories
  const categories = ["All", ...new Set(courses.map(c => c.category))];

  // User's current enrollments mapping
  const userEnrollments = enrollments.filter(e => e.userId === user.id);
  const enrolledCourseIds = userEnrollments.map(e => e.courseId);

  // Filter Logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnroll = async (courseId, courseTitle) => {
    try {
      await api.enroll(user.id, courseId);
      setEnrollSuccessMessage(`Successfully enrolled in "${courseTitle}"!`);
      onRefreshDB();
      setTimeout(() => {
        setEnrollSuccessMessage("");
      }, 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade">
      {/* Title Header */}
      <div style={{ marginBottom: "2rem" }}>
        <span className="badge badge-primary">Course Catalog</span>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", marginTop: "0.25rem", letterSpacing: "-0.03em" }}>
          Expand Your Expertise
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Browse professional-grade courses and enroll instantly to start your curriculum.
        </p>
      </div>

      {/* Success Notification Banner */}
      {enrollSuccessMessage && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "var(--success)",
          color: "white",
          padding: "1rem 1.5rem",
          borderRadius: "12px",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          zIndex: 200,
          animation: "slideInRight var(--transition-fast) forwards"
        }}>
          <GraduationCap size={20} />
          <span style={{ fontWeight: "600" }}>{enrollSuccessMessage}</span>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="glass-card" style={{
        padding: "1.25rem 1.5rem",
        marginBottom: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", gap: "1rem" }} className="search-filter-layout">
          {/* Search Input */}
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-tertiary)"
            }} />
            <input 
              type="text" 
              placeholder="Search courses, instructors, keywords..."
              className="form-input"
              style={{ paddingLeft: "2.5rem" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Level selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="filter-item-wrapper">
            <Filter size={16} style={{ color: "var(--text-secondary)" }} />
            <select 
              className="form-input"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ minWidth: "150px" }}
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ 
          display: "flex", 
          gap: "0.5rem", 
          overflowX: "auto", 
          paddingBottom: "0.25rem",
          borderTop: "1px solid var(--border-color)",
          paddingTop: "1rem" 
        }} className="category-scroll-bar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: selectedCategory === cat ? "var(--primary)" : "var(--bg-tertiary)",
                color: selectedCategory === cat ? "white" : "var(--text-secondary)",
                transition: "all var(--transition-fast)",
                whiteSpace: "nowrap"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <BookOpen size={48} style={{ color: "var(--text-tertiary)", marginBottom: "1rem" }} />
          <h4 style={{ fontWeight: "700" }}>No Courses Found</h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Try refining your search terms or adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {filteredCourses.map(course => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const enrollment = userEnrollments.find(e => e.courseId === course.id);
            const progress = enrollment ? enrollment.progress : 0;

            return (
              <div key={course.id} className="glass-card" style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: 0,
                overflow: "hidden"
              }}>
                {/* Course Thumbnail */}
                <div style={{ position: "relative" }}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    display: "flex",
                    gap: "0.4rem"
                  }}>
                    <span className="badge badge-primary" style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(99,102,241,0.85)", color: "white" }}>
                      {course.category}
                    </span>
                    <span className="badge badge-success" style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(16,185,129,0.85)", color: "white" }}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.5rem" }}>{course.title}</h4>
                    <p style={{ 
                      color: "var(--text-secondary)", 
                      fontSize: "0.85rem", 
                      marginBottom: "1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {course.description}
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: "600" }}>
                      Instructor: {course.instructor}
                    </span>
                  </div>

                  {/* Enrollment Actions */}
                  <div style={{ marginTop: "1.5rem" }}>
                    {isEnrolled ? (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.3rem" }}>
                          <span style={{ color: "var(--text-secondary)" }}>Progress</span>
                          <span style={{ color: "var(--primary)" }}>{progress}%</span>
                        </div>
                        <div className="progress-container" style={{ marginBottom: "1rem" }}>
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => onSelectCourse(course.id)}
                          style={{ width: "100%", padding: "0.6rem", fontSize: "0.85rem" }}
                        >
                          <span>Continue Learning</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleEnroll(course.id, course.title)}
                        style={{ width: "100%", padding: "0.6rem", fontSize: "0.85rem" }}
                      >
                        Enroll in Course
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 640px) {
          .search-filter-layout {
            flex-direction: column !important;
          }
          .filter-item-wrapper select {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
