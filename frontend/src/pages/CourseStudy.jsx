import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronDown, ChevronRight, BookOpen, CheckCircle, Circle, Play, Award, FileText } from "lucide-react";

export default function CourseStudy({ 
  user, 
  course, 
  enrollment, 
  quizzes = [], 
  onMarkLessonComplete, 
  onStartQuiz, 
  onBackToDashboard 
}) {
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [paperMode, setPaperMode] = useState(false);

  // Get matching quiz
  const quiz = quizzes.find(q => q.courseId === course.id);

  // Initialize syllabus state
  useEffect(() => {
    if (course.modules?.length > 0) {
      // Set first lesson active
      if (course.modules[0].lessons?.length > 0) {
        setActiveLesson(course.modules[0].lessons[0]);
      }
      // Expand all modules by default
      const tempExpanded = {};
      course.modules.forEach(m => {
        tempExpanded[m.id] = true;
      });
      setExpandedModules(tempExpanded);
    }
  }, [course]);

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const isCompleted = (lessonId) => {
    return enrollment?.completedLessons?.includes(lessonId);
  };

  // Find next and previous lessons for navigation
  const allLessons = course.modules ? course.modules.flatMap(m => m.lessons) : [];
  const currentIdx = allLessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const handleLessonChange = (lesson) => {
    setActiveLesson(lesson);
    // Scroll to top of content panel
    const panel = document.getElementById("study-content-panel");
    if (panel) panel.scrollTop = 0;
  };

  // Simple Markdown Code Block rendering
  const renderMarkdown = (text = "") => {
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeLines = [];

    return lines.map((line, index) => {
      // Check code block
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const codeString = codeLines.join("\n");
          codeLines = [];
          return (
            <pre key={index} style={{
              backgroundColor: paperMode ? "#f1f5f9" : "var(--bg-primary)",
              border: paperMode ? "1.5px solid #cbd5e1" : "1.5px solid var(--border-color)",
              color: paperMode ? "#0f172a" : "inherit",
              padding: "1rem",
              borderRadius: "10px",
              overflowX: "auto",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              margin: "1rem 0"
            }}>
              <code>{codeString}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return null;
      }

      // Check Headings
      if (line.startsWith("#### ")) {
        return <h5 key={index} style={{ fontSize: "1.1rem", fontWeight: "700", marginTop: "1.25rem", marginBottom: "0.5rem", color: paperMode ? "#0f172a" : "inherit" }}>{line.replace("#### ", "")}</h5>;
      }
      if (line.startsWith("### ")) {
        return <h4 key={index} style={{ fontSize: "1.3rem", fontWeight: "800", marginTop: "1.5rem", marginBottom: "0.75rem", color: paperMode ? "#4338ca" : "var(--primary)" }}>{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={index} style={{ fontSize: "1.5rem", fontWeight: "800", marginTop: "1.75rem", marginBottom: "1rem", borderBottom: paperMode ? "1px solid #cbd5e1" : "1px solid var(--border-color)", paddingBottom: "0.25rem", color: paperMode ? "#000000" : "inherit" }}>{line.replace("## ", "")}</h3>;
      }

      // Check Bullet Points
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return <li key={index} style={{ marginLeft: "1.5rem", marginBottom: "0.25rem", color: paperMode ? "#334155" : "var(--text-secondary)" }}>{line.replace(/^[\-\*]\s+/, "")}</li>;
      }

      // Check numbered lists
      if (/^\d+\.\s+/.test(line.trim())) {
        return <p key={index} style={{ marginLeft: "1.5rem", marginBottom: "0.25rem", color: paperMode ? "#334155" : "var(--text-secondary)" }}>{line.trim()}</p>;
      }

      // Fallback Paragraph
      if (line.trim() === "") return <div key={index} style={{ height: "0.75rem" }} />;
      return <p key={index} style={{ marginBottom: "0.75rem", color: paperMode ? "#1e293b" : "var(--text-secondary)", lineHeight: "1.6" }}>{line}</p>;
    });
  };

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--header-height) - 4rem)" }}>
      {/* Header Navigator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <button 
          onClick={onBackToDashboard}
          className="btn btn-outline"
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", gap: "0.4rem" }}
        >
          <ChevronLeft size={16} />
          <span>Dashboard</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }} className="study-header-progress">
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
            Progress: {enrollment?.progress || 0}%
          </span>
          <div className="progress-container" style={{ width: "120px", height: "6px" }}>
            <div className="progress-fill" style={{ width: `${enrollment?.progress || 0}%` }} />
          </div>
        </div>
      </div>

      {/* Main Split-Screen Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem", flex: 1, minHeight: 0 }} className="study-split-grid">
        
        {/* Left Column: Modules Sidebar Accordion */}
        <div className="glass-card" style={{ padding: "1.25rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <h4 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "0.25rem" }}>Course Syllabus</h4>
            <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{course.title}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {course.modules?.map((mod, modIdx) => (
              <div key={mod.id} style={{ display: "flex", flexDirection: "column" }}>
                {/* Module title toggler */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.6rem 0.75rem",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    marginBottom: "0.25rem"
                  }}
                >
                  <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-primary)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", width: "90%" }}>
                    {modIdx + 1}. {mod.title.replace(/^Module\s+\d+:\s+/, "")}
                  </span>
                  <ChevronDown 
                    size={14} 
                    style={{ 
                      color: "var(--text-secondary)",
                      transform: expandedModules[mod.id] ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform var(--transition-fast)" 
                    }} 
                  />
                </button>

                {/* Module lessons */}
                {expandedModules[mod.id] && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", paddingLeft: "0.25rem", marginTop: "0.1rem" }}>
                    {mod.lessons.map(les => {
                      const active = activeLesson?.id === les.id;
                      const done = isCompleted(les.id);
                      return (
                        <button
                          key={les.id}
                          onClick={() => handleLessonChange(les)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            padding: "0.5rem 0.6rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                            textAlign: "left",
                            width: "100%",
                            backgroundColor: active ? "var(--primary-light)" : "transparent",
                            color: active ? "var(--primary)" : "var(--text-secondary)",
                            transition: "all var(--transition-fast)"
                          }}
                        >
                          {done ? (
                            <CheckCircle size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
                          ) : (
                            <Circle size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                          )}
                          <span style={{ 
                            fontSize: "0.75rem", 
                            fontWeight: active ? "700" : "500",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {les.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Quiz Link */}
            {quiz && (
              <button
                onClick={() => onStartQuiz(quiz)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  background: "linear-gradient(135deg, var(--primary-light), var(--accent-light))",
                  border: "1.5px solid var(--primary)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  color: "var(--primary)",
                  fontWeight: "700",
                  marginTop: "1rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Award size={16} style={{ color: "var(--accent)" }} />
                  <span style={{ fontSize: "0.8rem" }}>Take Final Assessment</span>
                </div>
                <Play size={12} fill="var(--primary)" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Active Lesson content reader */}
        <div 
          className={paperMode ? "" : "glass-card"} 
          id="study-content-panel"
          style={{ 
            padding: "2rem", 
            overflowY: "auto", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            height: "100%",
            borderRadius: "16px",
            backgroundColor: paperMode ? "#ffffff" : "var(--bg-secondary)",
            color: paperMode ? "#0f172a" : "var(--text-primary)",
            border: paperMode ? "1px solid #cbd5e1" : "1px solid var(--border-color)",
            boxShadow: paperMode ? "0 10px 25px rgba(0,0,0,0.05)" : "var(--shadow-md)",
            transition: "all var(--transition-normal)"
          }}
        >
          {activeLesson ? (
            <div>
              {/* Lesson Metadata */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: paperMode ? "1.5px solid #e2e8f0" : "1.5px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: paperMode ? "#000000" : "inherit" }}>{activeLesson.title}</h3>
                  <span style={{ fontSize: "0.8rem", color: paperMode ? "#64748b" : "var(--text-tertiary)" }}>Duration: {activeLesson.duration}</span>
                </div>
                
                {/* Actions Wrapper */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button
                    onClick={() => setPaperMode(!paperMode)}
                    className="btn"
                    style={{ 
                      padding: "0.4rem 0.8rem", 
                      fontSize: "0.8rem", 
                      borderRadius: "8px",
                      backgroundColor: paperMode ? "#f1f5f9" : "var(--bg-tertiary)",
                      color: paperMode ? "#0f172a" : "var(--text-primary)",
                      border: paperMode ? "1px solid #cbd5e1" : "1.5px solid var(--border-color)"
                    }}
                    title="Toggle high-contrast black & white paper view"
                  >
                    {paperMode ? "Standard View" : "Paper View"}
                  </button>

                  <button
                    onClick={() => onMarkLessonComplete(course.id, activeLesson.id)}
                    className={`btn ${isCompleted(activeLesson.id) ? "btn-embossed-completed" : "btn-embossed-uncompleted"}`}
                    style={{ padding: "0.45rem 1.1rem", fontSize: "0.8rem", borderRadius: "8px" }}
                  >
                    {isCompleted(activeLesson.id) ? (
                      <>
                        <CheckCircle size={14} />
                        <span>Completed!</span>
                      </>
                    ) : (
                      <span>Mark Completed</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Parsed slide text */}
              <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                {renderMarkdown(activeLesson.content)}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
              <FileText size={48} style={{ color: "var(--text-tertiary)", marginBottom: "1rem" }} />
              <h4 style={{ fontWeight: "700" }}>No Lesson Selected</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Select a lesson from the left syllabus pane to start reading.</p>
            </div>
          )}

          {/* Nav Footer controls */}
          {activeLesson && (
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid var(--border-color)", paddingTop: "1.5rem", marginTop: "2rem" }}>
              <button
                onClick={() => prevLesson && handleLessonChange(prevLesson)}
                className="btn btn-outline"
                style={{ visibility: prevLesson ? "visible" : "hidden", padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "8px" }}
              >
                <ChevronLeft size={16} />
                <span>Prev Lesson</span>
              </button>

              {nextLesson ? (
                <button
                  onClick={() => handleLessonChange(nextLesson)}
                  className="btn btn-primary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "8px" }}
                >
                  <span>Next Lesson</span>
                  <ChevronRight size={16} />
                </button>
              ) : quiz ? (
                <button
                  onClick={() => onStartQuiz(quiz)}
                  className="btn btn-primary"
                  style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem", borderRadius: "8px", background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
                >
                  <Award size={14} />
                  <span>Start Quiz Assessment</span>
                </button>
              ) : (
                <button
                  onClick={onBackToDashboard}
                  className="btn btn-primary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "8px" }}
                >
                  <span>Back to Dashboard</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .study-split-grid {
            grid-template-columns: 1fr !important;
            overflow-y: auto !important;
            height: auto !important;
          }
          #study-content-panel {
            height: auto !important;
            overflow-y: visible !important;
            margin-top: 1.5rem !important;
          }
          .study-header-progress {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
