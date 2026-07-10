import React, { useState, useEffect } from "react";
import { api } from "../api";
import { Award, Timer, CheckCircle2, AlertTriangle, ChevronRight, CornerDownRight, XCircle, ArrowLeft } from "lucide-react";

export default function QuizView({ 
  user, 
  quiz, 
  onBackToStudy, 
  onRefreshDB 
}) {
  const [quizState, setQuizState] = useState("start"); // 'start' | 'playing' | 'result'
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes total time limit
  const [attemptResult, setAttemptResult] = useState(null);

  // Countdown timer effect
  useEffect(() => {
    if (quizState !== "playing") return;
    
    if (timeLeft <= 0) {
      handleQuizSubmit(true); // auto-submit when timer expires
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, quizState]);

  const startQuiz = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setTimeLeft(180);
    setQuizState("playing");
  };

  const handleOptionSelect = (oIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQIndex]: oIndex
    });
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  const handleQuizSubmit = async (isTimeOut = false) => {
    const questions = quiz.questions || [];
    let correctCount = 0;
    let earnedPoints = 0;
    let maxPoints = 0;

    questions.forEach((q, idx) => {
      maxPoints += q.points;
      const userAns = selectedAnswers[idx];
      if (userAns === q.correctIndex) {
        correctCount++;
        earnedPoints += q.points;
      }
    });

    const percentage = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;
    const passed = percentage >= 70; // 70% passing grade

    // Submit attempt to mock database
    await api.submitQuiz(
      user.id,
      quiz.id,
      earnedPoints,
      percentage,
      passed
    );

    setAttemptResult({
      earnedPoints,
      maxPoints,
      correctCount,
      totalQuestions: questions.length,
      percentage,
      passed,
      isTimeOut
    });

    setQuizState("result");
    onRefreshDB();
  };

  const activeQuestion = quiz.questions ? quiz.questions[currentQIndex] : null;
  const questionsCount = quiz.questions ? quiz.questions.length : 0;
  const allAnswered = Object.keys(selectedAnswers).length === questionsCount;

  return (
    <div className="animate-fade" style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* START SCREEN */}
      {quizState === "start" && (
        <div className="glass-card" style={{ padding: "3rem 2rem", textAlign: "center", borderRadius: "24px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Award size={64} style={{ color: "var(--primary)", filter: "drop-shadow(0 0 12px var(--primary-glow))" }} />
          </div>

          <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>Knowledge Assessment</span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "1rem" }}>{quiz.title}</h2>
          
          <div style={{
            backgroundColor: "var(--bg-tertiary)",
            padding: "1.25rem",
            borderRadius: "12px",
            textAlign: "left",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginBottom: "2rem"
          }}>
            <h4 style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Assessment Rules:</h4>
            <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li>Total Questions: <strong>{questionsCount}</strong></li>
              <li>Required Passing Score: <strong>70%</strong></li>
              <li>Allocated Time: <strong>3:00 Minutes</strong></li>
              <li>Instant feedback on grading with detail explanations will be unlocked.</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn btn-outline" onClick={onBackToStudy} style={{ flex: 1 }}>
              <ArrowLeft size={16} />
              <span>Back to Syllabus</span>
            </button>
            <button className="btn btn-primary" onClick={startQuiz} style={{ flex: 1 }}>
              <span>Start Assessment</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* QUIZ INTERACTIVE QUESTION PANEL */}
      {quizState === "playing" && activeQuestion && (
        <div className="glass-card" style={{ padding: "2rem", borderRadius: "20px" }}>
          
          {/* Header Dashboard: Question Tracker & Timer */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1.5px solid var(--border-color)",
            paddingBottom: "1rem",
            marginBottom: "1.5rem"
          }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-tertiary)", textTransform: "uppercase" }}>
                Question {currentQIndex + 1} of {questionsCount}
              </span>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-primary)" }}>{quiz.title}</h4>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: timeLeft < 30 ? "var(--danger-light)" : "var(--primary-light)",
              color: timeLeft < 30 ? "var(--danger)" : "var(--primary)",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "0.9rem"
            }}>
              <Timer size={16} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Tracker bar */}
          <div className="progress-container" style={{ height: "4px", marginBottom: "2rem" }}>
            <div className="progress-fill" style={{ width: `${((currentQIndex + 1) / questionsCount) * 100}%` }} />
          </div>

          {/* Question Text */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontWeight: "600" }}>QUESTION BODY</span>
              <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "700" }}>{activeQuestion.points} Points</span>
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", lineHeight: "1.4" }}>
              {activeQuestion.question}
            </h3>
          </div>

          {/* Options Lists */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2.5rem" }}>
            {activeQuestion.options.map((opt, index) => {
              const selected = selectedAnswers[currentQIndex] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    borderRadius: "12px",
                    border: selected ? "2.5px solid var(--primary)" : "1px solid var(--border-color)",
                    backgroundColor: selected ? "var(--primary-light)" : "var(--bg-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "all var(--transition-fast)"
                  }}
                  className="quiz-option-button"
                >
                  <div style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    border: selected ? "6px solid var(--primary)" : "2px solid var(--border-color)",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }} />
                  <span style={{ fontSize: "0.95rem", fontWeight: "600", color: selected ? "var(--text-primary)" : "var(--text-secondary)" }}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setCurrentQIndex(currentQIndex - 1)}
              className="btn btn-outline"
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", visibility: currentQIndex > 0 ? "visible" : "hidden" }}
            >
              Previous
            </button>

            {currentQIndex < questionsCount - 1 ? (
              <button
                onClick={() => setCurrentQIndex(currentQIndex + 1)}
                className="btn btn-primary"
                style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
                disabled={selectedAnswers[currentQIndex] === undefined}
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={() => handleQuizSubmit(false)}
                className="btn btn-primary"
                style={{ padding: "0.6rem 1.5rem", fontSize: "0.85rem", background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
                disabled={!allAnswered}
              >
                Submit Answers
              </button>
            )}
          </div>

        </div>
      )}

      {/* RESULTS DISPLAY PANEL */}
      {quizState === "result" && attemptResult && (
        <div className="glass-card" style={{ padding: "2.5rem 2rem", borderRadius: "24px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            {attemptResult.passed ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CheckCircle2 size={56} style={{ color: "var(--success)", filter: "drop-shadow(0 0 12px var(--success))", marginBottom: "1rem" }} />
                <span className="badge badge-success">GRADE: PASSED</span>
                <h3 style={{ fontSize: "1.75rem", fontWeight: "800", marginTop: "0.5rem" }}>Congratulations!</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", maxWidth: "400px" }}>
                  You have successfully passed the final assessment exam with a score of <strong>{attemptResult.percentage}%</strong>. Check your dashboard to view your unlocked certificate!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AlertTriangle size={56} style={{ color: "var(--danger)", filter: "drop-shadow(0 0 12px var(--danger))", marginBottom: "1rem" }} />
                <span className="badge badge-danger">GRADE: FAILED</span>
                <h3 style={{ fontSize: "1.75rem", fontWeight: "800", marginTop: "0.5rem" }}>Keep Reviewing</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", maxWidth: "400px" }}>
                  Your score was <strong>{attemptResult.percentage}%</strong>. A minimum score of 70% is required to earn a course certificate of completion. Try reviewing the syllabus and attempt again!
                </p>
              </div>
            )}
          </div>

          {/* Results Summary Box */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            backgroundColor: "var(--bg-tertiary)",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem"
          }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block" }}>Earned Score:</span>
              <span style={{ fontSize: "1.25rem", fontWeight: "800" }}>{attemptResult.earnedPoints} / {attemptResult.maxPoints} Points</span>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block" }}>Correct Answers:</span>
              <span style={{ fontSize: "1.25rem", fontWeight: "800" }}>{attemptResult.correctCount} / {attemptResult.totalQuestions} Correct</span>
            </div>
          </div>

          {/* Answers Breakdown / Review section */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h4 style={{ fontWeight: "800", fontSize: "1.05rem", marginBottom: "1rem", borderBottom: "1.5px solid var(--border-color)", paddingBottom: "0.5rem" }}>
              Assessment Breakdown & Explanations
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {quiz.questions?.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const correct = userAns === q.correctIndex;
                return (
                  <div key={idx} style={{
                    border: "1px solid var(--border-color)",
                    padding: "1rem",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-primary)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <h5 style={{ fontSize: "0.9rem", fontWeight: "700", width: "90%" }}>
                        {idx + 1}. {q.question}
                      </h5>
                      {correct ? (
                        <CheckCircle2 size={16} style={{ color: "var(--success)", flexShrink: 0 }} />
                      ) : (
                        <XCircle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.75rem", paddingLeft: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", color: correct ? "var(--success)" : "var(--danger)" }}>
                        Your Choice: <strong>{q.options[userAns] || "Unanswered"}</strong>
                      </span>
                      {!correct && (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          Correct Option: <strong>{q.options[q.correctIndex]}</strong>
                        </span>
                      )}
                    </div>

                    {q.explanation && (
                      <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.4rem",
                        marginTop: "0.75rem",
                        padding: "0.6rem 0.8rem",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        borderLeft: "3.5px solid var(--primary)"
                      }}>
                        <CornerDownRight size={12} style={{ color: "var(--text-tertiary)", marginTop: "3px" }} />
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                          {q.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "1rem" }}>
            {!attemptResult.passed && (
              <button className="btn btn-outline" onClick={startQuiz} style={{ flex: 1 }}>
                <span>Try Again</span>
              </button>
            )}
            <button className="btn btn-primary" onClick={onBackToStudy} style={{ flex: 1 }}>
              <span>Back to Course Study</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
