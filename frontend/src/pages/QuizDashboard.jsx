import React, { useState } from "react";
import { Award, CheckCircle, XCircle, Clock, Calendar, Play, ChevronRight, X, HelpCircle, AlertCircle } from "lucide-react";

export default function QuizDashboard({
  user,
  courses = [],
  enrollments = [],
  quizzes = [],
  quizAttempts = [],
  onSelectCourse,
  onStartQuiz
}) {
  // Practice Mode state
  const [activePracticeQuiz, setActivePracticeQuiz] = useState(null);
  const [practiceQIndex, setPracticeQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const userAttempts = quizAttempts.filter(a => a.userId === user.id);
  const totalAttempts = userAttempts.length;
  const passedAttempts = userAttempts.filter(a => a.passed);
  const totalPassed = passedAttempts.length;
  
  const avgPercentage = totalAttempts > 0
    ? Math.round(userAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts)
    : 0;

  const totalPoints = userAttempts.reduce((acc, curr) => acc + curr.score, 0);

  // Find enrolled courses (registered subjects)
  const userEnrollments = enrollments.filter(e => e.userId === user.id);
  const enrolledCourseIds = userEnrollments.map(e => e.courseId);
  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));

  // Initialize Practice Mode
  const startPractice = (quizObj) => {
    setActivePracticeQuiz(quizObj);
    setPracticeQIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const handleSelectPracticeOption = (oIndex) => {
    if (hasAnswered) return; // Prevent changing choice after check
    setSelectedOption(oIndex);
    setHasAnswered(true);
  };

  const nextPracticeQuestion = () => {
    if (practiceQIndex < activePracticeQuiz.questions.length - 1) {
      setPracticeQIndex(practiceQIndex + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Exit practice on finish
      setActivePracticeQuiz(null);
    }
  };

  const exitPractice = () => {
    setActivePracticeQuiz(null);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  // --- PRACTICE VIEWPORT (ACTIVE) ---
  if (activePracticeQuiz) {
    const qCount = activePracticeQuiz.questions.length;
    const currentQ = activePracticeQuiz.questions[practiceQIndex];
    const matchingCourse = courses.find(c => c.id === activePracticeQuiz.courseId);

    return (
      <div className="animate-fade" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div className="glass-card" style={{ padding: "2rem", borderRadius: "24px", position: "relative" }}>
          
          {/* Practice Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1.5px solid var(--border-color)",
            paddingBottom: "1rem",
            marginBottom: "1.5rem"
          }}>
            <div>
              <span className="badge badge-success" style={{ marginBottom: "0.25rem" }}>Practice Arena</span>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)" }}>
                {matchingCourse?.title || "Subject Practice"}
              </h3>
              <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                Question {practiceQIndex + 1} of {qCount}
              </span>
            </div>

            <button 
              onClick={exitPractice}
              className="btn btn-outline"
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", display: "flex", gap: "0.3rem", borderRadius: "8px" }}
            >
              <X size={14} />
              <span>Exit Practice</span>
            </button>
          </div>

          {/* Question Text */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "1.15rem", fontWeight: "700", lineHeight: "1.45" }}>
              {currentQ.question}
            </h4>
          </div>

          {/* Options grid with dynamic color statuses */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
            {currentQ.options.map((opt, index) => {
              const isCorrect = index === currentQ.correctIndex;
              const isSelected = selectedOption === index;
              
              let borderStyle = "1px solid var(--border-color)";
              let bgStyle = "var(--bg-secondary)";
              let textWeight = "500";
              let statusIcon = null;

              if (hasAnswered) {
                if (isCorrect) {
                  borderStyle = "2.5px solid var(--success)";
                  bgStyle = "var(--success-light)";
                  textWeight = "700";
                  statusIcon = <CheckCircle size={16} style={{ color: "var(--success)", marginLeft: "auto" }} />;
                } else if (isSelected) {
                  borderStyle = "2.5px solid var(--danger)";
                  bgStyle = "var(--danger-light)";
                  textWeight = "700";
                  statusIcon = <XCircle size={16} style={{ color: "var(--danger)", marginLeft: "auto" }} />;
                }
              } else if (isSelected) {
                borderStyle = "2px solid var(--primary)";
                bgStyle = "var(--primary-light)";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectPracticeOption(index)}
                  disabled={hasAnswered}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.9rem 1.25rem",
                    borderRadius: "12px",
                    border: borderStyle,
                    backgroundColor: bgStyle,
                    cursor: hasAnswered ? "default" : "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "all var(--transition-fast)"
                  }}
                  className="practice-option-button"
                >
                  <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: isSelected ? "5px solid var(--primary)" : "2px solid var(--border-color)",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }} />
                  <span style={{ fontSize: "0.9rem", fontWeight: textWeight, color: "var(--text-primary)" }}>
                    {opt}
                  </span>
                  {statusIcon}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout (Shown instantly on choice) */}
          {hasAnswered && (
            <div className="animate-fade" style={{
              backgroundColor: "var(--bg-tertiary)",
              borderLeft: "4px solid var(--primary)",
              padding: "1rem 1.25rem",
              borderRadius: "10px",
              marginBottom: "2rem",
              fontSize: "0.85rem",
              lineHeight: "1.5"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontWeight: "700", marginBottom: "0.25rem" }}>
                <HelpCircle size={14} />
                <span>EXPLANATION</span>
              </div>
              <p style={{ color: "var(--text-secondary)" }}>
                {currentQ.explanation || "No explanation provided for this question."}
              </p>
            </div>
          )}

          {/* Bottom navigation footer */}
          {hasAnswered && (
            <button
              onClick={nextPracticeQuestion}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <span>{practiceQIndex < qCount - 1 ? "Next Practice Question" : "Finish Practice"}</span>
              <ChevronRight size={16} />
            </button>
          )}

        </div>
      </div>
    );
  }

  // --- GENERAL DASHBOARD VIEWPORT ---
  return (
    <div className="animate-fade">
      {/* Page Title */}
      <div style={{ marginBottom: "2rem" }}>
        <span className="badge badge-primary">Assessment Portal</span>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", marginTop: "0.25rem", letterSpacing: "-0.03em" }}>
          Quiz & Performance Dashboard
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Monitor your assessment scores, review answers, and practice questions for your subjects.
        </p>
      </div>

      {/* Metrics Row - Professional Minimalist Layout */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="quiz-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{totalAttempts}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Attempts</span>
          </div>
        </div>

        {/* Divider 1 */}
        <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-color)" }} className="stat-divider" />

        {/* Stat 2 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="quiz-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--success-light)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{totalPassed}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quizzes Passed</span>
          </div>
        </div>

        {/* Divider 2 */}
        <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-color)" }} className="stat-divider" />

        {/* Stat 3 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="quiz-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Clock size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{avgPercentage}%</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Average Score</span>
          </div>
        </div>

        {/* Divider 3 */}
        <div style={{ width: "1px", height: "40px", backgroundColor: "var(--border-color)" }} className="stat-divider" />

        {/* Stat 4 */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "150px" }} className="quiz-stat-item">
          <div style={{ padding: "0.5rem", borderRadius: "10px", backgroundColor: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={20} style={{ color: "var(--warning)" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.1", color: "var(--text-primary)" }} className="gradient-text">{totalPoints} pts</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Points Earned</span>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .stat-divider {
              display: none !important;
            }
            .quiz-stat-item {
              min-width: 40% !important;
            }
          }
        `}</style>
      </div>

      {/* NEW: SUBJECT PRACTICE SANDBOX MATRIX */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1rem" }}>Subject Practice Decks</h3>
        {enrolledCourses.length === 0 ? (
          <div className="glass-card" style={{ padding: "2rem", textAlign: "center", borderStyle: "dashed" }}>
            <AlertCircle size={32} style={{ color: "var(--text-tertiary)", marginBottom: "0.5rem" }} />
            <h5 style={{ fontWeight: "700" }}>No Subjects Registered</h5>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
              Enroll in a course from the catalog to activate practice decks for that subject.
            </p>
          </div>
        ) : (
          <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {enrolledCourses.map(course => {
              const quiz = quizzes.find(q => q.courseId === course.id);
              const qCount = quiz ? quiz.questions?.length || 0 : 0;
              return (
                <div key={course.id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.25rem" }}>
                  <div>
                    <span className="badge badge-success" style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem" }}>{course.category}</span>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginTop: "0.4rem" }}>{course.title}</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginTop: "0.1rem" }}>
                      {qCount} practice questions available
                    </span>
                  </div>

                  <button
                    disabled={!quiz || qCount === 0}
                    onClick={() => quiz && startPractice(quiz)}
                    className="btn btn-secondary"
                    style={{ width: "100%", padding: "0.5rem", fontSize: "0.8rem", borderRadius: "8px", gap: "0.3rem" }}
                  >
                    <Play size={10} fill="var(--primary)" />
                    <span>Practice Subject</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Attempt History and Pending Lists */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.1fr", gap: "2rem" }} className="quiz-dashboard-layout">
        
        {/* Attempt logs */}
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1.25rem" }}>Attempt History</h3>
          {userAttempts.length === 0 ? (
            <div className="glass-card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
              <Award size={40} style={{ color: "var(--text-tertiary)", marginBottom: "0.75rem" }} />
              <h4 style={{ fontWeight: "700" }}>No attempts found</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                You have not taken any course quizzes yet. Complete active modules to start assessments.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {userAttempts.map(attempt => {
                const quizObj = quizzes.find(q => q.id === attempt.quizId);
                const courseObj = quizObj ? courses.find(c => c.id === quizObj.courseId) : null;
                
                return (
                  <div key={attempt.id} className="glass-card" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.25rem"
                  }} className="quiz-attempt-item-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
                      {attempt.passed ? (
                        <CheckCircle size={28} style={{ color: "var(--success)", flexShrink: 0 }} />
                      ) : (
                        <XCircle size={28} style={{ color: "var(--danger)", flexShrink: 0 }} />
                      )}
                      
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {courseObj?.title || "Course Quiz"}
                        </h4>
                        <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.15rem", flexWrap: "wrap" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <Calendar size={12} />
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>Score: {attempt.score} pts</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }} className="quiz-attempt-right-block">
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: "800", color: attempt.passed ? "var(--success)" : "var(--danger)" }}>
                          {attempt.percentage}%
                        </span>
                        <span style={{ fontSize: "0.6rem", display: "block", fontWeight: "700", color: "var(--text-tertiary)" }}>
                          {attempt.passed ? "PASSED" : "FAILED"}
                        </span>
                      </div>
                      
                      <button
                        className="btn btn-outline"
                        onClick={() => quizObj && onStartQuiz(quizObj)}
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", borderRadius: "8px" }}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending assessments */}
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1.25rem" }}>Pending Assessments</h3>
          {enrolledCourses.length === 0 ? (
            <div className="glass-card" style={{
              textAlign: "center",
              padding: "2.5rem 1rem",
              borderStyle: "dashed"
            }}>
              <CheckCircle size={32} style={{ color: "var(--success)", marginBottom: "0.5rem" }} />
              <h5 style={{ fontWeight: "700", fontSize: "0.95rem" }}>All Caught Up!</h5>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                You have passed all assessments for your enrolled courses.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {enrolledCourses.map(course => {
                const quiz = quizzes.find(q => q.courseId === course.id);
                if (!quiz) return null;
                const hasPassed = userAttempts.some(a => a.quizId === quiz.id && a.passed);
                if (hasPassed) return null;

                return (
                  <div key={quiz.id} className="glass-card" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <span className="badge badge-warning" style={{ fontSize: "0.55rem", padding: "0.05rem 0.4rem" }}>REQUIRED</span>
                      <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginTop: "0.25rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {course.title}
                      </h4>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {quiz.questions?.length || 0} Questions
                      </span>
                      <button
                        className="btn btn-primary"
                        onClick={() => onStartQuiz(quiz)}
                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.7rem", borderRadius: "6px", gap: "0.25rem" }}
                      >
                        <Play size={10} fill="white" />
                        <span>Start</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .quiz-dashboard-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .quiz-attempt-item-card {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .quiz-attempt-right-block {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
}
