import * as db from "./db";

/**
 * EduVantage API Bridge
 * 
 * This module routes all UI data operations. To connect the UI to your Python backend:
 * 1. Set the python backend URL in BASE_URL.
 * 2. Swap the localStorage mock lines for the fetch() templates provided inside each function.
 */
const BASE_URL = "http://localhost:8000"; // Switch to your Flask/FastAPI backend URL

export const api = {
  // --- USER AUTHENTICATION ---
  login: async (email, password) => {
    // Local Mock:
    return db.dbLoginUser(email, password);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Login failed");
    }
    return await res.json(); // Expected payload: { id, name, email, role, avatar }
    */
  },

  register: async (name, email, password, phone, role) => {
    // Local Mock:
    return db.dbRegisterUser(name, email, password, phone, role);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Registration failed");
    }
    return await res.json(); // Expected payload: { id, name, email, role, avatar }
    */
  },

  updateUserRole: async (userId, role) => {
    // Local Mock:
    return db.dbUpdateUserRole(userId, role);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error("Could not update user role");
    return await res.json();
    */
  },

  updateUserAvatar: async (userId, avatarUrl) => {
    // Local Mock:
    return db.dbUpdateUserAvatar(userId, avatarUrl);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/users/${userId}/avatar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl })
    });
    if (!res.ok) throw new Error("Could not update avatar");
    return await res.json();
    */
  },

  getUsers: async () => {
    // Local Mock:
    return db.dbGetUsers();

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/users`);
    if (!res.ok) throw new Error("Could not fetch users catalog");
    return await res.json();
    */
  },


  // --- COURSE MODULES ---
  getCourses: async () => {
    // Local Mock:
    return db.dbGetCourses();

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/courses`);
    if (!res.ok) throw new Error("Could not fetch courses catalog");
    return await res.json();
    */
  },

  createCourse: async (courseData) => {
    // Local Mock:
    return db.dbCreateCourse(courseData);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseData)
    });
    if (!res.ok) throw new Error("Failed to create course");
    return await res.json();
    */
  },

  updateCourse: async (courseId, courseData) => {
    // Local Mock:
    return db.dbUpdateCourse(courseId, courseData);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/courses/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseData)
    });
    if (!res.ok) throw new Error("Failed to update course details");
    return await res.json();
    */
  },

  deleteCourse: async (courseId) => {
    // Local Mock:
    return db.dbDeleteCourse(courseId);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/courses/${courseId}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete course");
    return true;
    */
  },


  // --- ENROLLMENTS & LESSON STUDY PROGRESS ---
  getEnrollments: async () => {
    // Local Mock:
    return db.dbGetEnrollments();

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/enrollments`);
    if (!res.ok) throw new Error("Could not fetch enrollments");
    return await res.json();
    */
  },

  enroll: async (userId, courseId) => {
    // Local Mock:
    return db.dbEnrollInCourse(userId, courseId);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId })
    });
    if (!res.ok) throw new Error("Failed to enroll in course");
    return await res.json();
    */
  },

  completeLesson: async (userId, courseId, lessonId) => {
    // Local Mock:
    return db.dbMarkLessonComplete(userId, courseId, lessonId);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/enrollments/lesson-complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId, lessonId })
    });
    if (!res.ok) throw new Error("Failed to update lesson status");
    return await res.json(); // Expected payload: updated enrollment record
    */
  },


  // --- QUIZZES & FINAL ASSESSMENTS ---
  getQuizzes: async () => {
    // Local Mock:
    return db.dbGetQuizzes();

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/quizzes`);
    if (!res.ok) throw new Error("Could not fetch quizzes");
    return await res.json();
    */
  },

  saveQuiz: async (courseId, quizData) => {
    // Local Mock:
    return db.dbSaveQuiz(courseId, quizData);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/quizzes/${courseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData)
    });
    if (!res.ok) throw new Error("Failed to save quiz details");
    return await res.json();
    */
  },

  getQuizAttempts: async () => {
    // Local Mock:
    return db.dbGetQuizAttempts();

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/quizzes/attempts`);
    if (!res.ok) throw new Error("Could not load quiz attempts");
    return await res.json();
    */
  },

  submitQuiz: async (userId, quizId, score, percentage, passed) => {
    // Local Mock:
    return db.dbSubmitQuizAttempt(userId, quizId, score, percentage, passed);

    // Python Backend integration:
    /*
    const res = await fetch(`${BASE_URL}/api/quizzes/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, quizId, score, percentage, passed })
    });
    if (!res.ok) throw new Error("Failed to submit quiz attempt metrics");
    return await res.json();
    */
  }
};
