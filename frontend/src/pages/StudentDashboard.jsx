import React, { useState } from "react";
import { GraduationCap, Award, CheckCircle, Clock, BookOpen, ChevronRight, Download } from "lucide-react";

export default function StudentDashboard({ 
  user, 
  courses = [], 
  enrollments = [], 
  quizAttempts = [], 
  onSelectCourse, 
  onNavigateToBrowse 
}) {
  const [activeCertificate, setActiveCertificate] = useState(null);

  // Filter courses user is enrolled in
  const userEnrollments = enrollments.filter(e => e.userId === user.id);
  const enrolledCoursesData = userEnrollments.map(enroll => {
    const course = courses.find(c => c.id === enroll.courseId);
    return {
      ...course,
      progress: enroll.progress,
      completedLessons: enroll.completedLessons,
      enrolledAt: enroll.enrolledAt
    };
  }).filter(c => c.id); // Filter out any deleted courses

  // Calculate Stats
  const totalEnrolled = enrolledCoursesData.length;
  const completedCoursesCount = enrolledCoursesData.filter(c => c.progress === 100).length;
  
  // Quiz scores
  const userAttempts = quizAttempts.filter(a => a.userId === user.id);
  const passedQuizzes = userAttempts.filter(a => a.passed).length;
  const averageQuizScore = userAttempts.length > 0
    ? Math.round(userAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / userAttempts.length)
    : 0;

  // Unlocked Certificates: Course progress is 100% AND quiz is passed
  const certificates = enrolledCoursesData.filter(course => {
    // check if there is a passed quiz for this course
    // wait, we should find the quiz first
    const isCompleted = course.progress === 100;
    const hasPassedQuiz = userAttempts.some(a => a.passed && a.quizId.includes(course.id.replace("course-", "quiz-")));
    return isCompleted || hasPassedQuiz; // Unlock on completion or passed quiz
  });

  // Recommended courses: courses user is NOT enrolled in yet
  const enrolledIds = enrolledCoursesData.map(c => c.id);
  const recommendedCourses = courses.filter(c => !enrolledIds.includes(c.id)).slice(0, 3);

  return (
    <div className="animate-fade">
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: "2.5rem 2rem",
        borderRadius: "20px",
        background: "linear-gradient(135deg, var(--primary-light), var(--accent-light))",
        border: "1px solid var(--glass-border)",
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1.5rem"
      }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>Student Portal</span>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
            Welcome Back, <span className="gradient-text">{user.name}</span>!
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", maxWidth: "500px" }}>
            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
          </p>
        </div>
        <button className="btn btn-primary" onClick={onNavigateToBrowse}>
          <BookOpen size={18} />
          <span>Explore New Courses</span>
        </button>
      </div>

      {/* Stats Counter Row - Professional Minimalist Layout */}
      <div className="glass-panel" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.75rem 2rem",
        borderRadius: "20px",
        marginBottom: "2.5rem",
        border: "1px solid var(--border-color)",
        flexWrap: "wrap",
        gap: "2rem"
      }}>
        {/* Stat 1 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="dashboard-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{totalEnrolled}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Enrolled Courses</span>
          </div>
        </div>

        {/* Divider 1 */}
        <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-color)" }} className="stat-divider" />

        {/* Stat 2 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="dashboard-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--success-light)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{completedCoursesCount}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Courses Completed</span>
          </div>
        </div>

        {/* Divider 2 */}
        <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-color)" }} className="stat-divider" />

        {/* Stat 3 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="dashboard-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{passedQuizzes}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quizzes Passed</span>
          </div>
        </div>

        {/* Divider 3 */}
        <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-color)" }} className="stat-divider" />

        {/* Stat 4 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="dashboard-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Clock size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{averageQuizScore}%</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Average Score</span>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .stat-divider {
              display: none !important;
            }
            .dashboard-stat-item {
              min-width: 40% !important;
            }
          }
        `}</style>
      </div>

      {/* Main Grid: My Courses vs Achievements */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", flexWrap: "wrap" }} className="dashboard-layout-row">
        
        {/* Enrolled Courses */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "800" }}>My Learning Path</h3>
            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-tertiary)" }}>{enrolledCoursesData.length} in progress</span>
          </div>

          {enrolledCoursesData.length === 0 ? (
            <div className="glass-card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
              <BookOpen size={48} style={{ color: "var(--text-tertiary)", marginBottom: "1rem" }} />
              <h4 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>No active enrollments</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                You haven't enrolled in any courses yet. Browse our selection and pick a topic to start learning!
              </p>
              <button className="btn btn-primary" onClick={onNavigateToBrowse}>Browse All Courses</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {enrolledCoursesData.map(course => (
                <div key={course.id} className="glass-card" style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center"
                }} className="course-dashboard-item">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      width: "120px",
                      height: "85px",
                      borderRadius: "12px",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <span className="badge badge-primary" style={{ fontSize: "0.65rem", padding: "0.1rem 0.5rem" }}>
                          {course.category}
                        </span>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "700", marginTop: "0.2rem" }}>{course.title}</h4>
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--primary)" }}>{course.progress}% Completed</span>
                    </div>

                    <div className="progress-container">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>By {course.instructor}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => onSelectCourse(course.id)}
                        style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", borderRadius: "8px" }}
                      >
                        <span>{course.progress === 100 ? "Review Material" : "Continue Learning"}</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Certificates & Recommendations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Certificates */}
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1.25rem" }}>Certificates</h3>
            {certificates.length === 0 ? (
              <div className="glass-card" style={{
                textAlign: "center",
                padding: "2rem 1rem",
                borderStyle: "dashed"
              }}>
                <Award size={36} style={{ color: "var(--text-tertiary)", marginBottom: "0.75rem" }} />
                <h5 style={{ fontWeight: "700", fontSize: "0.95rem" }}>No Certificates Yet</h5>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  Complete courses to 100% or pass final exams to unlock official credentials.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {certificates.map(course => (
                  <div 
                    key={course.id} 
                    className="glass-card" 
                    onClick={() => setActiveCertificate(course)}
                    style={{
                      padding: "1rem",
                      cursor: "pointer",
                      borderLeft: "4px solid var(--accent)",
                      background: "linear-gradient(to right, var(--bg-secondary), var(--primary-light))",
                      transition: "transform 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <Award size={24} style={{ color: "var(--accent)" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{ 
                          fontSize: "0.85rem", 
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {course.title}
                        </h5>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Click to View Certificate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended courses */}
          {recommendedCourses.length > 0 && (
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1.25rem" }}>Recommended for You</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {recommendedCourses.map(course => (
                  <div key={course.id} className="glass-card" style={{ padding: "1rem", display: "flex", gap: "0.75rem", cursor: "pointer" }} onClick={() => onSelectCourse(course.id)}>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{ width: "60px", height: "45px", borderRadius: "8px", objectFit: "cover" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h5 style={{ 
                        fontSize: "0.85rem", 
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {course.title}
                      </h5>
                      <span className="badge badge-primary" style={{ fontSize: "0.55rem", padding: "0 0.3rem", marginTop: "0.1rem" }}>
                        {course.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Certificate Modal */}
      {activeCertificate && (
        <div className="modal-overlay" onClick={() => setActiveCertificate(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: "680px", 
              padding: 0, 
              overflow: "hidden",
              border: "1px solid var(--border-color)",
              boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)"
            }}
          >
            {/* Elegant Certificate Border */}
            <div style={{
              padding: "3rem",
              background: "var(--bg-secondary)",
              border: "15px solid var(--bg-tertiary)",
              position: "relative",
              textAlign: "center"
            }}>
              {/* Corner Accents */}
              <div style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                right: "10px",
                bottom: "10px",
                border: "2px solid var(--accent)",
                opacity: 0.35,
                pointerEvents: "none"
              }} />

              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <Award size={64} style={{ color: "var(--accent)", filter: "drop-shadow(0 0 12px rgba(217,70,239,0.3))" }} />
              </div>

              <h4 style={{ 
                fontFamily: "var(--font-display)", 
                fontSize: "1.25rem", 
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                marginBottom: "1rem"
              }}>
                Certificate of Completion
              </h4>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic", marginBottom: "2rem" }}>
                This is proudly presented to
              </p>

              <h2 style={{ 
                fontSize: "2.5rem", 
                fontFamily: "var(--font-display)", 
                fontWeight: "800",
                color: "var(--text-primary)",
                borderBottom: "2.5px solid var(--border-color)",
                paddingBottom: "0.5rem",
                width: "fit-content",
                margin: "0 auto 2rem auto"
              }}>
                {user.name}
              </h2>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                for successfully completing the digital course
              </p>

              <h3 style={{ 
                fontSize: "1.5rem", 
                fontWeight: "800", 
                color: "var(--primary)",
                marginBottom: "2rem"
              }}>
                {activeCertificate.title}
              </h3>

              <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                An online program of study including course assessments and modules.
              </p>

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginTop: "3rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border-color)"
              }}>
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", display: "block" }}>Date</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", display: "block" }}>Instructor</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: "600", fontStyle: "italic" }}>{activeCertificate.instructor}</span>
                </div>
              </div>
            </div>
            
            {/* Modal Actions */}
            <div style={{ 
              backgroundColor: "var(--bg-tertiary)", 
              padding: "1rem 2rem", 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "1rem" 
            }}>
              <button className="btn btn-outline" onClick={() => setActiveCertificate(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()} style={{ gap: "0.5rem" }}>
                <Download size={16} />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .dashboard-layout-row {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .course-dashboard-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1.25rem !important;
          }
          .course-dashboard-item img {
            width: 100% !important;
            height: 140px !important;
          }
        }
      `}</style>
    </div>
  );
}
