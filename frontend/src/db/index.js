import { initialUsers, initialCourses, initialQuizzes } from "./seedData";

// LocalStorage Keys
const KEYS = {
  USERS: "lms_users",
  COURSES: "lms_courses",
  QUIZZES: "lms_quizzes",
  ENROLLMENTS: "lms_enrollments",
  QUIZ_ATTEMPTS: "lms_quiz_attempts"
};

// Generic read/write helpers
const read = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
};

const write = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
};

// Initialize database with seed data if empty
export const initDB = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    write(KEYS.USERS, initialUsers);
  } else {
    // Securely update cached demo users to use Indian registered phone numbers
    const users = read(KEYS.USERS);
    let updated = false;
    users.forEach(u => {
      const match = initialUsers.find(iu => iu.id === u.id);
      if (match && u.phone !== match.phone) {
        u.phone = match.phone;
        updated = true;
      }
    });
    if (updated) {
      write(KEYS.USERS, users);
    }
  }
  if (!localStorage.getItem(KEYS.COURSES)) {
    write(KEYS.COURSES, initialCourses);
  }
  if (!localStorage.getItem(KEYS.QUIZZES)) {
    write(KEYS.QUIZZES, initialQuizzes);
  }
  if (!localStorage.getItem(KEYS.ENROLLMENTS)) {
    write(KEYS.ENROLLMENTS, []);
  }
  if (!localStorage.getItem(KEYS.QUIZ_ATTEMPTS)) {
    write(KEYS.QUIZ_ATTEMPTS, []);
  }
};

// --- USER OPERATIONS ---
export const dbGetUsers = () => read(KEYS.USERS);

export const dbLoginUser = (email, password) => {
  const users = read(KEYS.USERS);
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (found) {
    const { password, ...userWithoutPassword } = found;
    return userWithoutPassword;
  }
  return null;
};

export const dbRegisterUser = (name, email, password, phone, role = "student") => {
  const users = read(KEYS.USERS);
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
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
  
  users.push(newUser);
  write(KEYS.USERS, users);
  
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const dbUpdateUserRole = (userId, role) => {
  const users = read(KEYS.USERS);
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index].role = role;
    write(KEYS.USERS, users);
  }
  return users.map(({ password, ...u }) => u);
};

export const dbUpdateUserAvatar = (userId, avatarUrl) => {
  const users = read(KEYS.USERS);
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index].avatar = avatarUrl;
    write(KEYS.USERS, users);
  }
  return users.map(({ password, ...u }) => u);
};

// --- COURSE OPERATIONS ---
export const dbGetCourses = () => read(KEYS.COURSES);

export const dbCreateCourse = (courseData) => {
  const courses = read(KEYS.COURSES);
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
  courses.push(newCourse);
  write(KEYS.COURSES, courses);
  return newCourse;
};

export const dbUpdateCourse = (courseId, courseData) => {
  const courses = read(KEYS.COURSES);
  const index = courses.findIndex(c => c.id === courseId);
  if (index !== -1) {
    courses[index] = { ...courses[index], ...courseData };
    write(KEYS.COURSES, courses);
    return courses[index];
  }
  throw new Error("Course not found");
};

export const dbDeleteCourse = (courseId) => {
  let courses = read(KEYS.COURSES);
  courses = courses.filter(c => c.id !== courseId);
  write(KEYS.COURSES, courses);

  // Clean up associated enrollments
  let enrollments = read(KEYS.ENROLLMENTS);
  enrollments = enrollments.filter(e => e.courseId !== courseId);
  write(KEYS.ENROLLMENTS, enrollments);
};

// --- ENROLLMENT OPERATIONS ---
export const dbGetEnrollments = () => read(KEYS.ENROLLMENTS);

export const dbEnrollInCourse = (userId, courseId) => {
  const enrollments = read(KEYS.ENROLLMENTS);
  const exists = enrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (exists) return exists;

  const newEnrollment = {
    id: `enroll-${Date.now()}`,
    userId,
    courseId,
    progress: 0,
    completedLessons: [],
    enrolledAt: new Date().toISOString()
  };

  enrollments.push(newEnrollment);
  write(KEYS.ENROLLMENTS, enrollments);
  return newEnrollment;
};

export const dbMarkLessonComplete = (userId, courseId, lessonId) => {
  const enrollments = read(KEYS.ENROLLMENTS);
  const courses = read(KEYS.COURSES);
  const course = courses.find(c => c.id === courseId);
  if (!course) throw new Error("Course not found");

  // Calculate total lessons in this course
  let totalLessons = 0;
  course.modules.forEach(m => {
    totalLessons += m.lessons.length;
  });

  const enrollIndex = enrollments.findIndex(e => e.userId === userId && e.courseId === courseId);
  if (enrollIndex === -1) {
    throw new Error("Enrollment not found");
  }

  const enrollment = enrollments[enrollIndex];
  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  } else {
    // If double toggled, we can uncomplete it
    enrollment.completedLessons = enrollment.completedLessons.filter(id => id !== lessonId);
  }

  // Calculate new progress percentage
  enrollment.progress = totalLessons > 0 
    ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    : 0;

  write(KEYS.ENROLLMENTS, enrollments);
  return enrollment;
};

// --- QUIZ OPERATIONS ---
export const dbGetQuizzes = () => read(KEYS.QUIZZES);

export const dbSaveQuiz = (courseId, quizData) => {
  const quizzes = read(KEYS.QUIZZES);
  const index = quizzes.findIndex(q => q.courseId === courseId);
  
  const formattedQuiz = {
    id: index !== -1 ? quizzes[index].id : `quiz-${Date.now()}`,
    courseId,
    title: quizData.title || "Course Assessment",
    questions: quizData.questions || []
  };

  if (index !== -1) {
    quizzes[index] = formattedQuiz;
  } else {
    quizzes.push(formattedQuiz);
  }

  write(KEYS.QUIZZES, quizzes);
  return formattedQuiz;
};

// --- QUIZ ATTEMPTS ---
export const dbGetQuizAttempts = () => read(KEYS.QUIZ_ATTEMPTS);

export const dbSubmitQuizAttempt = (userId, quizId, score, percentage, passed) => {
  const attempts = read(KEYS.QUIZ_ATTEMPTS);
  const newAttempt = {
    id: `attempt-${Date.now()}`,
    userId,
    quizId,
    score,
    percentage,
    passed,
    completedAt: new Date().toISOString()
  };
  attempts.push(newAttempt);
  write(KEYS.QUIZ_ATTEMPTS, attempts);
  return newAttempt;
};
