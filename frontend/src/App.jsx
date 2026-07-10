import React, { useState, useEffect } from "react";
import { api } from "./api";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import QuizDashboard from "./pages/QuizDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Courses from "./pages/Courses";
import CourseStudy from "./pages/CourseStudy";
import QuizView from "./pages/QuizView";
import "./App.css";

export default function App() {
  // Database State
  const [dbRefresh, setDbRefresh] = useState(0);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);

  // Auth & Session state
  const [currentUser, setCurrentUser] = useState(null);
  
  // High-Level view Router State
  // 'landing' | 'auth' | 'portal'
  const [activeView, setActiveView] = useState("landing");
  const [authDefaultRole, setAuthDefaultRole] = useState("student");

  // Dashboard Sub-Tab Navigation State
  // 'student-dashboard' | 'all-courses' | 'quiz-dashboard' | 'admin-courses' | 'study' | 'quiz'
  const [activeTab, setActiveTab] = useState("student-dashboard");
  
  // Specific course study trackers
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Layout states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("lms_theme") || "light";
  });

  // Initial Seed & Session Check on mount
  useEffect(() => {
    const checkSession = async () => {
      // Refresh local database seeds
      await refreshData();

      const savedSession = localStorage.getItem("lms_session");
      if (savedSession) {
        try {
          const user = JSON.parse(savedSession);
          setCurrentUser(user);
          setActiveView("portal");
          if (user.role === "admin") {
            setActiveTab("admin-courses");
          } else {
            setActiveTab("student-dashboard");
          }
        } catch (e) {
          console.error("Error reading saved session", e);
        }
      }
    };
    checkSession();
  }, []);

  // Update theme token on HTML root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("lms_theme", theme);
  }, [theme]);

  // Sync state database changes asynchronously
  useEffect(() => {
    const sync = async () => {
      await refreshData();
      if (currentUser) {
        const freshUsers = await api.getUsers();
        const match = freshUsers.find(u => u.id === currentUser.id);
        if (match) {
          const { password, ...userNoPassword } = match;
          setCurrentUser(userNoPassword);
          
          // Redirect adjustments if role is altered dynamically
          const isAdminTab = activeTab === "admin-courses" || activeTab === "admin-quizzes" || activeTab === "admin-users";
          if (userNoPassword.role === "admin" && !isAdminTab && activeTab !== "study" && activeTab !== "quiz") {
            setActiveTab("admin-courses");
          } else if (userNoPassword.role === "student" && isAdminTab) {
            setActiveTab("student-dashboard");
          }
        }
      }
    };
    sync();
  }, [dbRefresh]);

  const refreshData = async () => {
    try {
      const [u, c, e, q, a] = await Promise.all([
        api.getUsers(),
        api.getCourses(),
        api.getEnrollments(),
        api.getQuizzes(),
        api.getQuizAttempts()
      ]);
      setUsers(u);
      setCourses(c);
      setEnrollments(e);
      setQuizzes(q);
      setQuizAttempts(a);
    } catch (err) {
      console.error("Error refreshing database state", err);
    }
  };

  const triggerDbRefresh = () => {
    setDbRefresh(prev => prev + 1);
  };

  const handlePortalSelect = (targetRole) => {
    setAuthDefaultRole(targetRole);
    setActiveView("auth");
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("lms_session", JSON.stringify(user));
    setActiveView("portal");
    
    if (user.role === "admin") {
      setActiveTab("admin-courses");
    } else {
      setActiveTab("student-dashboard");
    }
    triggerDbRefresh();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("lms_session");
    setSelectedCourseId("");
    setActiveQuiz(null);
    setActiveTab("student-dashboard");
    setActiveView("landing");
  };

  const handleUpdateAvatar = async (newAvatarUrl) => {
    if (!currentUser) return;
    try {
      await api.updateUserAvatar(currentUser.id, newAvatarUrl);
      const updatedUser = { ...currentUser, avatar: newAvatarUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem("lms_session", JSON.stringify(updatedUser));
      triggerDbRefresh();
    } catch (e) {
      console.error("Could not update user avatar", e);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const selectCourseToStudy = (courseId) => {
    setSelectedCourseId(courseId);
    setActiveTab("study");
  };

  const startQuizAssessment = (quizObj) => {
    setActiveQuiz(quizObj);
    setActiveTab("quiz");
  };

  const handleMarkLessonComplete = async (courseId, lessonId) => {
    if (!currentUser) return;
    try {
      await api.completeLesson(currentUser.id, courseId, lessonId);
      triggerDbRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  // Switcher rendering for App dashboards
  const renderDashboardView = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case "student-dashboard":
        return (
          <StudentDashboard
            user={currentUser}
            courses={courses}
            enrollments={enrollments}
            quizAttempts={quizAttempts}
            onSelectCourse={selectCourseToStudy}
            onNavigateToBrowse={() => setActiveTab("all-courses")}
          />
        );
      case "all-courses":
        return (
          <Courses
            user={currentUser}
            courses={courses}
            enrollments={enrollments}
            onSelectCourse={selectCourseToStudy}
            onRefreshDB={triggerDbRefresh}
          />
        );
      case "quiz-dashboard":
        return (
          <QuizDashboard
            user={currentUser}
            courses={courses}
            enrollments={enrollments}
            quizzes={quizzes}
            quizAttempts={quizAttempts}
            onSelectCourse={selectCourseToStudy}
            onStartQuiz={startQuizAssessment}
          />
        );
      case "admin-courses":
      case "admin-quizzes":
      case "admin-users":
        return (
          <AdminDashboard
            user={currentUser}
            courses={courses}
            users={users}
            enrollments={enrollments}
            quizzes={quizzes}
            quizAttempts={quizAttempts}
            defaultTab={activeTab.replace("admin-", "")}
            onTabChange={(newTab) => setActiveTab(`admin-${newTab}`)}
            onRefreshDB={triggerDbRefresh}
          />
        );
      case "study":
        const targetCourse = courses.find(c => c.id === selectedCourseId);
        const targetEnroll = enrollments.find(e => e.userId === currentUser.id && e.courseId === selectedCourseId);
        
        if (!targetCourse) {
          return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p>Course details not found or deleted by admin.</p>
              <button className="btn btn-primary" onClick={() => setActiveTab("student-dashboard")}>
                Return to Dashboard
              </button>
            </div>
          );
        }

        return (
          <CourseStudy
            user={currentUser}
            course={targetCourse}
            enrollment={targetEnroll}
            quizzes={quizzes}
            onMarkLessonComplete={handleMarkLessonComplete}
            onStartQuiz={startQuizAssessment}
            onBackToDashboard={() => setActiveTab("student-dashboard")}
          />
        );
      case "quiz":
        if (!activeQuiz) return null;
        return (
          <QuizView
            user={currentUser}
            quiz={activeQuiz}
            onBackToStudy={() => setActiveTab("study")}
            onRefreshDB={triggerDbRefresh}
          />
        );
      default:
        return <div>View not implemented.</div>;
    }
  };

  // --- ROUTER VIEWPORT ---
  if (activeView === "landing") {
    return (
      <LandingPage 
        onSelectPortal={handlePortalSelect}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  if (activeView === "auth") {
    return (
      <Auth 
        onLoginSuccess={handleLoginSuccess}
        defaultRole={authDefaultRole}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // Active portal session view
  const studentEnrollmentsData = enrollments
    .filter(e => e.userId === currentUser.id)
    .map(enroll => courses.find(c => c.id === enroll.courseId))
    .filter(Boolean);

  return (
    <div className="app-container">
      {/* Header bar */}
      <Navbar 
        user={currentUser}
        onLogout={handleLogout}
        onUpdateAvatar={handleUpdateAvatar}
        theme={theme}
        toggleTheme={toggleTheme}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Responsive Left Navigation */}
      <Sidebar 
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        enrolledCourses={studentEnrollmentsData}
        onSelectCourse={selectCourseToStudy}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <main className="main-content">
        {renderDashboardView()}
      </main>
    </div>
  );
}
