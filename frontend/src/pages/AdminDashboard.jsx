import React, { useState } from "react";
import { api } from "../api";
import { 
  Plus, Edit2, Trash2, Users, BookOpen, FileText, CheckCircle, 
  ChevronRight, Award, PlusCircle, Trash, ShieldCheck 
} from "lucide-react";

export default function AdminDashboard({ 
  user, 
  courses = [], 
  users = [], 
  enrollments = [], 
  quizzes = [], 
  quizAttempts = [],
  defaultTab = "courses",
  onTabChange,
  onRefreshDB 
}) {
  const [activeSubTab, setActiveSubTab] = useState(defaultTab);

  React.useEffect(() => {
    if (defaultTab) {
      setActiveSubTab(defaultTab);
    }
  }, [defaultTab]);
  
  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Course form state
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseCategory, setCourseCategory] = useState("Web Development");
  const [courseLevel, setCourseLevel] = useState("Beginner");
  const [courseThumbnail, setCourseThumbnail] = useState("");

  // Managing Modules/Lessons state (Selected course for syllabus editing)
  const [selectedCourseSyllabus, setSelectedCourseSyllabus] = useState(null);
  const [syllabusModules, setSyllabusModules] = useState([]);

  // Quiz creator state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizCourseId, setQuizCourseId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [expandedQIndex, setExpandedQIndex] = useState(0);

  // Calculate Global Stats
  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;
  const passedCount = quizAttempts.filter(a => a.passed).length;
  const quizPassRate = quizAttempts.length > 0
    ? Math.round((passedCount / quizAttempts.length) * 100)
    : 100; // default 100 if no attempts

  // Open course creation/edit modal
  const openCourseModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setCourseTitle(course.title);
      setCourseDesc(course.description);
      setCourseInstructor(course.instructor);
      setCourseCategory(course.category);
      setCourseLevel(course.level);
      setCourseThumbnail(course.thumbnail);
    } else {
      setEditingCourse(null);
      setCourseTitle("");
      setCourseDesc("");
      setCourseInstructor(user.name);
      setCourseCategory("Web Development");
      setCourseLevel("Beginner");
      setCourseThumbnail("");
    }
    setShowCourseModal(true);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      title: courseTitle,
      description: courseDesc,
      instructor: courseInstructor,
      category: courseCategory,
      level: courseLevel,
      thumbnail: courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
      modules: editingCourse ? editingCourse.modules : []
    };

    if (editingCourse) {
      await api.updateCourse(editingCourse.id, courseData);
    } else {
      await api.createCourse(courseData);
    }

    setShowCourseModal(false);
    onRefreshDB();
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course and all its enrollments?")) {
      await api.deleteCourse(courseId);
      if (selectedCourseSyllabus?.id === courseId) {
        setSelectedCourseSyllabus(null);
      }
      onRefreshDB();
    }
  };

  // Syllabus Editor Functions
  const handleOpenSyllabus = (course) => {
    setSelectedCourseSyllabus(course);
    setSyllabusModules(course.modules || []);
  };

  const handleAddModule = async () => {
    const modTitle = prompt("Enter Module Title:");
    if (!modTitle) return;
    const newModule = {
      id: `mod-${Date.now()}`,
      title: modTitle,
      lessons: []
    };
    const updated = [...syllabusModules, newModule];
    setSyllabusModules(updated);
    await api.updateCourse(selectedCourseSyllabus.id, { modules: updated });
    onRefreshDB();
  };

  const handleAddLesson = async (modId) => {
    const lesTitle = prompt("Enter Lesson Title:");
    if (!lesTitle) return;
    const lesDuration = prompt("Enter Lesson Duration (e.g. '15 min'):", "15 min");
    const lesContent = prompt("Enter Lesson Content (Markdown/HTML supported):", "### New Lesson Content\nStart writing learning materials here.");

    const updated = syllabusModules.map(m => {
      if (m.id === modId) {
        return {
          ...m,
          lessons: [
            ...m.lessons,
            {
              id: `les-${Date.now()}`,
              title: lesTitle,
              duration: lesDuration || "15 min",
              content: lesContent || "Lesson Material Content"
            }
          ]
        };
      }
      return m;
    });

    setSyllabusModules(updated);
    await api.updateCourse(selectedCourseSyllabus.id, { modules: updated });
    onRefreshDB();
  };

  const handleDeleteLesson = async (modId, lesId) => {
    if (!window.confirm("Remove this lesson?")) return;
    const updated = syllabusModules.map(m => {
      if (m.id === modId) {
        return {
          ...m,
          lessons: m.lessons.filter(l => l.id !== lesId)
        };
      }
      return m;
    });
    setSyllabusModules(updated);
    await api.updateCourse(selectedCourseSyllabus.id, { modules: updated });
    onRefreshDB();
  };

  const handleDeleteModule = async (modId) => {
    if (!window.confirm("Remove this module and all its lessons?")) return;
    const updated = syllabusModules.filter(m => m.id !== modId);
    setSyllabusModules(updated);
    await api.updateCourse(selectedCourseSyllabus.id, { modules: updated });
    onRefreshDB();
  };

  // User Role Switcher
  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    if (userId === user.id) {
      alert("You cannot revoke your own admin rights!");
      return;
    }
    await api.updateUserRole(userId, newRole);
    onRefreshDB();
  };

  // Quiz Creator Functions
  const openQuizModal = (courseId) => {
    const existing = quizzes.find(q => q.courseId === courseId);
    setQuizCourseId(courseId);
    setExpandedQIndex(0);
    
    if (existing) {
      setQuizTitle(existing.title);
      setQuizQuestions(existing.questions || []);
    } else {
      const course = courses.find(c => c.id === courseId);
      setQuizTitle(`${course?.title || "Course"} Assessment`);
      setQuizQuestions([]);
    }
    setShowQuizModal(true);
  };

  const handleAddQuizQuestion = () => {
    const updated = [
      ...quizQuestions,
      {
        question: "Enter question query here",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: 0,
        points: 10,
        explanation: "Enter feedback context for incorrect attempts here."
      }
    ];
    setQuizQuestions(updated);
    setExpandedQIndex(updated.length - 1);
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...quizQuestions];
    updated[qIndex][field] = value;
    setQuizQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[oIndex] = value;
    setQuizQuestions(updated);
  };

  const handleDeleteQuestion = (qIndex) => {
    setQuizQuestions(quizQuestions.filter((_, idx) => idx !== qIndex));
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (quizQuestions.length === 0) {
      alert("Please add at least one question to the quiz!");
      return;
    }
    await api.saveQuiz(quizCourseId, {
      title: quizTitle,
      questions: quizQuestions
    });
    setShowQuizModal(false);
    onRefreshDB();
  };

  return (
    <div className="animate-fade">
      {/* Admin Title */}
      <div style={{ marginBottom: "2rem" }}>
        <span className="badge badge-danger">Admin Dashboard</span>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", marginTop: "0.25rem", letterSpacing: "-0.03em" }}>
          LMS Control Console
        </h2>
      </div>

      {/* Global Stats - Professional Minimalist Layout */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="admin-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{totalUsers}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Users</span>
          </div>
        </div>

        {/* Divider 1 */}
        <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-color)" }} className="stat-divider" />

        {/* Stat 2 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="admin-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{totalCourses}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Courses</span>
          </div>
        </div>

        {/* Divider 2 */}
        <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-color)" }} className="stat-divider" />

        {/* Stat 3 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="admin-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--success-light)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{totalEnrollments}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Enrollments</span>
          </div>
        </div>

        {/* Divider 3 */}
        <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-color)" }} className="stat-divider" />

        {/* Stat 4 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="admin-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{quizPassRate}%</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quiz Pass Rate</span>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .stat-divider {
              display: none !important;
            }
            .admin-stat-item {
              min-width: 40% !important;
            }
          }
        `}</style>
      </div>

      {/* Tabs Selection */}
      <div style={{
        display: "flex",
        borderBottom: "2px solid var(--border-color)",
        marginBottom: "2rem",
        gap: "2rem"
      }}>
        <button
          onClick={() => { if (onTabChange) onTabChange("courses"); else setActiveSubTab("courses"); setSelectedCourseSyllabus(null); }}
          style={{
            padding: "0.75rem 0.5rem",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: "pointer",
            color: activeSubTab === "courses" ? "var(--primary)" : "var(--text-secondary)",
            borderBottom: activeSubTab === "courses" ? "3px solid var(--primary)" : "none",
            transition: "all var(--transition-fast)"
          }}
        >
          Manage Courses ({courses.length})
        </button>
        <button
          onClick={() => { if (onTabChange) onTabChange("quizzes"); else setActiveSubTab("quizzes"); setSelectedCourseSyllabus(null); }}
          style={{
            padding: "0.75rem 0.5rem",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: "pointer",
            color: activeSubTab === "quizzes" ? "var(--primary)" : "var(--text-secondary)",
            borderBottom: activeSubTab === "quizzes" ? "3px solid var(--primary)" : "none",
            transition: "all var(--transition-fast)"
          }}
        >
          Assessments & Quizzes ({quizzes.length})
        </button>
        <button
          onClick={() => { if (onTabChange) onTabChange("users"); else setActiveSubTab("users"); setSelectedCourseSyllabus(null); }}
          style={{
            padding: "0.75rem 0.5rem",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: "pointer",
            color: activeSubTab === "users" ? "var(--primary)" : "var(--text-secondary)",
            borderBottom: activeSubTab === "users" ? "3px solid var(--primary)" : "none",
            transition: "all var(--transition-fast)"
          }}
        >
          Users Directory ({users.length})
        </button>
      </div>

      {/* TAB CONTENT: COURSES */}
      {activeSubTab === "courses" && (
        <div style={{ display: "grid", gridTemplateColumns: selectedCourseSyllabus ? "1.2fr 1fr" : "1fr", gap: "2rem" }} className="admin-split-syllabus">
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>Active Catalog</h3>
              <button className="btn btn-primary" onClick={() => openCourseModal(null)} style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", gap: "0.4rem" }}>
                <Plus size={16} />
                <span>Create New Course</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {courses.map(course => (
                <div 
                  key={course.id} 
                  className="glass-card" 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    border: selectedCourseSyllabus?.id === course.id ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                    backgroundColor: selectedCourseSyllabus?.id === course.id ? "var(--primary-light)" : "var(--bg-secondary)"
                  }}
                  className="course-admin-card-item"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: "90px", height: "65px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span className="badge badge-primary" style={{ fontSize: "0.6rem", padding: "0 0.4rem" }}>{course.category}</span>
                      <span className="badge badge-success" style={{ fontSize: "0.6rem", padding: "0 0.4rem" }}>{course.level}</span>
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", marginTop: "0.25rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {course.title}
                    </h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      {course.modules?.length || 0} modules • By {course.instructor}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem" }} className="admin-actions-grid">
                    <button 
                      className="btn btn-outline" 
                      onClick={() => handleOpenSyllabus(course)}
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", borderRadius: "8px" }}
                    >
                      <span>Syllabus ({course.modules?.length || 0})</span>
                      <ChevronRight size={12} />
                    </button>
                    <button 
                      onClick={() => openCourseModal(course)} 
                      className="btn btn-outline" 
                      style={{ padding: "0.4rem", borderRadius: "8px" }}
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)} 
                      className="btn btn-danger" 
                      style={{ padding: "0.4rem", borderRadius: "8px" }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Panel (Right Side Split) */}
          {selectedCourseSyllabus && (
            <div className="glass-card animate-fade" style={{ borderRadius: "20px", borderLeft: "4px solid var(--primary)", alignSelf: "flex-start" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-tertiary)" }}>SYLLABUS BUILDER</span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginTop: "0.1rem" }}>{selectedCourseSyllabus.title}</h3>
                </div>
                <button className="btn btn-primary" onClick={handleAddModule} style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", gap: "0.3rem" }}>
                  <PlusCircle size={14} />
                  <span>Add Module</span>
                </button>
              </div>

              {syllabusModules.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2.5rem 1rem", border: "1.5px dashed var(--border-color)", borderRadius: "12px" }}>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>No modules added. Create a module to start adding lessons.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {syllabusModules.map((mod, mIndex) => (
                    <div key={mod.id} style={{ border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "12px", backgroundColor: "var(--bg-primary)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-primary)" }}>
                          {mIndex + 1}. {mod.title}
                        </h4>
                        <div style={{ display: "flex", gap: "0.3rem" }}>
                          <button 
                            className="btn btn-outline" 
                            onClick={() => handleAddLesson(mod.id)}
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem", borderRadius: "6px" }}
                          >
                            + Lesson
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleDeleteModule(mod.id)}
                            style={{ padding: "0.25rem", borderRadius: "6px" }}
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Lessons inside Module */}
                      {mod.lessons.length === 0 ? (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontStyle: "italic", paddingLeft: "0.5rem" }}>
                          No lessons inside this module yet.
                        </span>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", paddingLeft: "0.5rem" }}>
                          {mod.lessons.map((les, lIndex) => (
                            <div key={les.id} style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "var(--bg-secondary)",
                              padding: "0.4rem 0.6rem",
                              borderRadius: "6px",
                              border: "1px solid var(--border-color)"
                            }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                {mIndex + 1}.{lIndex + 1} {les.title} ({les.duration})
                              </span>
                              <button 
                                onClick={() => handleDeleteLesson(mod.id, les.id)}
                                style={{ color: "var(--danger)", cursor: "pointer" }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: QUIZZES */}
      {activeSubTab === "quizzes" && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>Course Assessments</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Create or customize quizzes for each course to test student knowledge.</p>
          </div>

          <div className="card-grid">
            {courses.map(course => {
              const quiz = quizzes.find(q => q.courseId === course.id);
              return (
                <div key={course.id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                  <div>
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "10px", marginBottom: "1rem" }}
                    />
                    <span className="badge badge-primary" style={{ fontSize: "0.6rem", padding: "0 0.4rem" }}>{course.category}</span>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginTop: "0.4rem", marginBottom: "0.5rem" }}>{course.title}</h4>
                    
                    {quiz ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--success)", fontSize: "0.8rem", fontWeight: "600", marginTop: "0.5rem" }}>
                        <Award size={16} />
                        <span>Active Quiz: {quiz.questions?.length || 0} Questions</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontStyle: "italic" }}>No Quiz Configured</span>
                    )}
                  </div>

                  <button 
                    className="btn btn-primary" 
                    onClick={() => openQuizModal(course.id)}
                    style={{ width: "100%", marginTop: "1.5rem", padding: "0.5rem", fontSize: "0.8rem", borderRadius: "8px" }}
                  >
                    {quiz ? "Edit Assessment" : "Create Assessment"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: USERS DIRECTORY */}
      {activeSubTab === "users" && (
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-color)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>LMS User Directory</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>View registered accounts and assign administrative rights.</p>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>User</th>
                  <th style={{ padding: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Email Address</th>
                  <th style={{ padding: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Role</th>
                  <th style={{ padding: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} className="user-table-row">
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img 
                          src={u.avatar} 
                          alt={u.name} 
                          style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{u.email}</td>
                    <td style={{ padding: "1rem" }}>
                      <span className={`badge ${u.role === "admin" ? "badge-danger" : "badge-primary"}`} style={{ fontSize: "0.65rem", padding: "0.1rem 0.5rem" }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <button 
                        className={`btn ${u.role === "admin" ? "btn-outline" : "btn-secondary"}`}
                        onClick={() => handleToggleRole(u.id, u.role)}
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", borderRadius: "6px", gap: "0.3rem" }}
                        disabled={u.id === user.id}
                      >
                        <ShieldCheck size={12} />
                        <span>{u.role === "admin" ? "Demote to Student" : "Promote to Admin"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COURSE CREATION/EDIT MODAL */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "1.5rem" }}>
              {editingCourse ? "Edit Course Parameters" : "Create Academic Course"}
            </h3>
            
            <form onSubmit={handleCourseSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="course-form-title">Course Title</label>
                <input 
                  id="course-form-title"
                  type="text" 
                  className="form-input" 
                  value={courseTitle} 
                  onChange={(e) => setCourseTitle(e.target.value)} 
                  required
                  placeholder="e.g. Master React Core Architectures"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="course-form-desc">Course Description</label>
                <textarea 
                  id="course-form-desc"
                  className="form-input" 
                  value={courseDesc} 
                  onChange={(e) => setCourseDesc(e.target.value)} 
                  required
                  rows={3}
                  placeholder="Provide a comprehensive summary of syllabus targets..."
                  style={{ resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="course-form-category">Category</label>
                  <select 
                    id="course-form-category"
                    className="form-input" 
                    value={courseCategory} 
                    onChange={(e) => setCourseCategory(e.target.value)}
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Database">Database</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="course-form-level">Target Level</label>
                  <select 
                    id="course-form-level"
                    className="form-input" 
                    value={courseLevel} 
                    onChange={(e) => setCourseLevel(e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="course-form-instructor">Instructor Name</label>
                  <input 
                    id="course-form-instructor"
                    type="text" 
                    className="form-input" 
                    value={courseInstructor} 
                    onChange={(e) => setCourseInstructor(e.target.value)} 
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="course-form-thumb">Thumbnail URL (Optional)</label>
                  <input 
                    id="course-form-thumb"
                    type="text" 
                    className="form-input" 
                    placeholder="https://images.unsplash.com/..." 
                    value={courseThumbnail} 
                    onChange={(e) => setCourseThumbnail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowCourseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUIZ BUILDER MODAL */}
      {showQuizModal && (
        <div className="modal-overlay" onClick={() => setShowQuizModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>
              Configure Course Quiz
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Build assessment questions. Score target is 70% to pass.
            </p>

            <form onSubmit={handleQuizSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="quiz-form-title">Quiz Title</label>
                <input 
                  id="quiz-form-title"
                  type="text" 
                  className="form-input" 
                  value={quizTitle} 
                  onChange={(e) => setQuizTitle(e.target.value)} 
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", marginTop: "1.5rem" }}>
                <h4 style={{ fontWeight: "700", fontSize: "0.95rem" }}>Questions List ({quizQuestions.length})</h4>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleAddQuizQuestion}
                  style={{ padding: "0.3rem 0.8rem", fontSize: "0.75rem", borderRadius: "6px" }}
                >
                  + Add Question
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "350px", overflowY: "auto", padding: "0.5rem", border: "1px solid var(--border-color)", borderRadius: "10px", marginBottom: "1.5rem" }}>
                {quizQuestions.length === 0 ? (
                  <p style={{ textAlign: "center", color: "var(--text-tertiary)", fontSize: "0.85rem", padding: "2rem" }}>
                    No questions added yet. Click "+ Add Question" to start.
                  </p>
                ) : (
                  quizQuestions.map((q, qIdx) => {
                    const isExpanded = expandedQIndex === qIdx;
                    return (
                      <div key={qIdx} style={{ 
                        padding: "1rem", 
                        border: "1px solid var(--border-color)", 
                        borderRadius: "12px", 
                        backgroundColor: isExpanded ? "var(--bg-primary)" : "var(--bg-tertiary)", 
                        transition: "all var(--transition-fast)" 
                      }}>
                        {/* Collapsed Header Summary */}
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center", 
                          cursor: "pointer" 
                        }} onClick={() => setExpandedQIndex(isExpanded ? -1 : qIdx)}>
                          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>
                            Question #{qIdx + 1}: <span style={{ fontWeight: "500", color: "var(--text-secondary)", marginLeft: "0.5rem" }}>
                              {q.question.length > 50 ? q.question.substring(0, 50) + "..." : q.question}
                            </span>
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                            <button 
                              type="button" 
                              onClick={() => setExpandedQIndex(isExpanded ? -1 : qIdx)}
                              style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "6px", color: "var(--primary)", fontWeight: "600", cursor: "pointer" }}
                            >
                              {isExpanded ? "Collapse" : "Edit"}
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                handleDeleteQuestion(qIdx);
                                setExpandedQIndex(0);
                              }}
                              style={{ padding: "0.25rem", borderRadius: "6px", color: "var(--danger)", cursor: "pointer" }}
                              title="Delete Question"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Fields */}
                        {isExpanded && (
                          <div className="animate-fade" style={{ marginTop: "1rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                            <div className="form-group">
                              <label className="form-label" htmlFor={`q-text-${qIdx}`}>Question Body</label>
                              <input 
                                id={`q-text-${qIdx}`}
                                type="text" 
                                className="form-input" 
                                value={q.question} 
                                onChange={(e) => handleQuestionChange(qIdx, "question", e.target.value)}
                                required
                              />
                            </div>

                            {/* Options */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="form-group" style={{ marginBottom: "0.5rem" }}>
                                  <label className="form-label" htmlFor={`q-opt-${qIdx}-${oIdx}`}>Option {String.fromCharCode(65 + oIdx)}</label>
                                  <input 
                                    id={`q-opt-${qIdx}-${oIdx}`}
                                    type="text" 
                                    className="form-input" 
                                    value={opt} 
                                    onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                    required
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Config */}
                            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem", marginTop: "0.5rem" }}>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" htmlFor={`q-correct-${qIdx}`}>Correct Option Index</label>
                                <select 
                                  id={`q-correct-${qIdx}`}
                                  className="form-input"
                                  value={q.correctIndex}
                                  onChange={(e) => handleQuestionChange(qIdx, "correctIndex", parseInt(e.target.value))}
                                >
                                  <option value={0}>Option A</option>
                                  <option value={1}>Option B</option>
                                  <option value={2}>Option C</option>
                                  <option value={3}>Option D</option>
                                </select>
                              </div>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" htmlFor={`q-points-${qIdx}`}>Weight (Points)</label>
                                <input 
                                  id={`q-points-${qIdx}`}
                                  type="number" 
                                  className="form-input"
                                  value={q.points}
                                  onChange={(e) => handleQuestionChange(qIdx, "points", parseInt(e.target.value) || 10)}
                                  min={1}
                                />
                              </div>
                            </div>

                            <div className="form-group" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
                              <label className="form-label" htmlFor={`q-exp-${qIdx}`}>Answer Explanation</label>
                              <input 
                                id={`q-exp-${qIdx}`}
                                type="text" 
                                className="form-input" 
                                value={q.explanation || ""} 
                                onChange={(e) => handleQuestionChange(qIdx, "explanation", e.target.value)}
                                placeholder="Provide explanation showing up during grading..."
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowQuizModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .user-table-row:hover {
          background-color: var(--bg-primary);
        }
        @media (max-width: 1024px) {
          .admin-split-syllabus {
            grid-template-columns: 1fr !important;
          }
          .course-admin-card-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1.25rem !important;
          }
          .course-admin-card-item img {
            width: 100% !important;
            height: 140px !important;
          }
          .admin-actions-grid {
            width: 100% !important;
            justify-content: flex-end !important;
            margin-top: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
