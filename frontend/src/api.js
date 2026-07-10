import { supabase } from "./supabaseClient";

/**
 * EduVantage Supabase API Bridge
 * 
 * This module routes all UI data operations to the live Supabase project.
 */

export const api = {
  // --- USER AUTHENTICATION ---
  login: async (email, password) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      throw new Error("Invalid credentials or user not found");
    }
    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword;
  },

  register: async (name, email, password, phone, role) => {
    // Check if email exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: role || "student",
      phone: phone || "",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };

    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .select()
      .single();

    if (error) throw new Error(error.message);

    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword;
  },

  updateUserRole: async (userId, role) => {
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", userId)
      .select();
    
    if (error) throw new Error("Could not update user role");
    return data.map(({ password, ...u }) => u);
  },

  updateUserAvatar: async (userId, avatarUrl) => {
    const { data, error } = await supabase
      .from("users")
      .update({ avatar: avatarUrl })
      .eq("id", userId)
      .select();
    
    if (error) throw new Error("Could not update avatar");
    return data.map(({ password, ...u }) => u);
  },

  getUsers: async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw new Error("Could not fetch users catalog");
    return data;
  },

  // --- COURSE MODULES ---
  getCourses: async () => {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) throw new Error("Could not fetch courses catalog");
    return data;
  },

  createCourse: async (courseData) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      title: courseData.title || "Untitled Course",
      description: courseData.description || "",
      instructor: courseData.instructor || "Guest Instructor",
      category: courseData.category || "General",
      level: courseData.level || "Beginner",
      thumbnail: courseData.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
      modules: courseData.modules || []
    };

    const { data, error } = await supabase.from("courses").insert([newCourse]).select().single();
    if (error) throw new Error("Failed to create course");
    return data;
  },

  updateCourse: async (courseId, courseData) => {
    const { data, error } = await supabase
      .from("courses")
      .update(courseData)
      .eq("id", courseId)
      .select()
      .single();
    
    if (error) throw new Error("Failed to update course details");
    return data;
  },

  deleteCourse: async (courseId) => {
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) throw new Error("Failed to delete course");
    return true;
  },

  // --- ENROLLMENTS & LESSON STUDY PROGRESS ---
  getEnrollments: async () => {
    const { data, error } = await supabase.from("enrollments").select("*");
    if (error) throw new Error("Could not fetch enrollments");
    return data.map(e => ({
      ...e,
      userId: e.user_id,
      courseId: e.course_id,
      completedLessons: e.completed_lessons
    }));
  },

  enroll: async (userId, courseId) => {
    // Check if exists
    const { data: existing } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing) return existing;

    const newEnrollment = {
      id: `enroll-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      progress: 0,
      completed_lessons: [],
      enrolled_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from("enrollments").insert([newEnrollment]).select().single();
    if (error) throw new Error("Failed to enroll in course");
    
    // the frontend expects 'userId' and 'courseId' in camelCase. We'll map them back for the frontend logic
    return {
      ...data,
      userId: data.user_id,
      courseId: data.course_id,
      completedLessons: data.completed_lessons
    };
  },

  completeLesson: async (userId, courseId, lessonId) => {
    // 1. Get course to count total lessons
    const { data: course } = await supabase.from("courses").select("modules").eq("id", courseId).single();
    if (!course) throw new Error("Course not found");

    let totalLessons = 0;
    if (course.modules) {
      course.modules.forEach(m => {
        totalLessons += (m.lessons || []).length;
      });
    }

    // 2. Get enrollment
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (!enrollment) throw new Error("Enrollment not found");

    let completed = enrollment.completed_lessons || [];
    
    // Toggle logic (similar to mock db)
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
    } else {
      completed = completed.filter(id => id !== lessonId);
    }

    const progress = totalLessons > 0 ? Math.round((completed.length / totalLessons) * 100) : 0;

    const { data: updated, error } = await supabase
      .from("enrollments")
      .update({ completed_lessons: completed, progress })
      .eq("id", enrollment.id)
      .select()
      .single();

    if (error) throw new Error("Failed to update lesson status");
    
    return {
      ...updated,
      userId: updated.user_id,
      courseId: updated.course_id,
      completedLessons: updated.completed_lessons
    };
  },

  // --- QUIZZES & FINAL ASSESSMENTS ---
  getQuizzes: async () => {
    const { data, error } = await supabase.from("quizzes").select("*");
    if (error) throw new Error("Could not fetch quizzes");
    // Map camelCase for frontend
    return data.map(q => ({
      ...q,
      courseId: q.course_id
    }));
  },

  saveQuiz: async (courseId, quizData) => {
    const { data: existing } = await supabase.from("quizzes").select("id").eq("course_id", courseId).maybeSingle();

    const formattedQuiz = {
      id: existing ? existing.id : `quiz-${Date.now()}`,
      course_id: courseId,
      title: quizData.title || "Course Assessment",
      questions: quizData.questions || []
    };

    const { data, error } = await supabase.from("quizzes").upsert(formattedQuiz).select().single();
    if (error) throw new Error("Failed to save quiz details");
    return {
      ...data,
      courseId: data.course_id
    };
  },

  getQuizAttempts: async () => {
    const { data, error } = await supabase.from("quiz_attempts").select("*");
    if (error) throw new Error("Could not load quiz attempts");
    return data.map(a => ({
      ...a,
      userId: a.user_id,
      quizId: a.quiz_id,
      completedAt: a.completed_at
    }));
  },

  submitQuiz: async (userId, quizId, score, percentage, passed) => {
    const newAttempt = {
      id: `attempt-${Date.now()}`,
      user_id: userId,
      quiz_id: quizId,
      score,
      percentage,
      passed,
      completed_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from("quiz_attempts").insert([newAttempt]).select().single();
    if (error) throw new Error("Failed to submit quiz attempt metrics");
    return {
      ...data,
      userId: data.user_id,
      quizId: data.quiz_id,
      completedAt: data.completed_at
    };
  }
};
