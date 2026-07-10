export const initialUsers = [
  {
    id: "user-admin",
    name: "Dr. Elizabeth Vance",
    email: "admin@lms.com",
    password: "admin123",
    role: "admin",
    phone: "+91 94451 23456",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
  },
  {
    id: "user-student",
    name: "Alexander Mercer",
    email: "student@lms.com",
    password: "student123",
    role: "student",
    phone: "+91 98840 98765",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
  }
];

export const initialCourses = [
  {
    id: "course-1",
    title: "Introduction to Modern Frontend Engineering",
    description: "Master React, modern Javascript (ES6+), semantic HTML, responsive grids, and advanced DOM optimization concepts.",
    instructor: "Sarah Jenkins, Principal Architect",
    category: "Web Development",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
    modules: [
      {
        id: "c1-m1",
        title: "Module 1: The Modern Web & React Foundations",
        lessons: [
          {
            id: "c1-m1-l1",
            title: "1.1 Anatomy of a Web App: From DOM to Virtual DOM",
            duration: "15 min",
            content: `### 1.1 Anatomy of a Web App: From DOM to Virtual DOM

In this lesson, we explore how modern browsers construct, parse, and render web documents. 

#### The Document Object Model (DOM)
The DOM represents the page structure as a tree of nodes. Every HTML tag is turned into a Javascript object that can be queried and modified.

#### The Performance Problem
Traditional DOM updates are slow because they trigger **reflows** (recalculating layouts) and **repaints** (redrawing elements).

#### Enter React: The Virtual DOM
React solves this by keeping a lightweight virtual representation of the DOM in memory:
1. **State changes**: React builds a new virtual DOM tree.
2. **Diffing**: React compares this tree with the previous virtual DOM tree.
3. **Reconciliation**: Only the differences are batched and updated in the real DOM.

\`\`\`javascript
// Example React Component structure
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

#### Key Takeaway
By grouping DOM changes, modern frameworks achieve high refresh rates and butter-smooth user experiences.`
          },
          {
            id: "c1-m1-l2",
            title: "1.2 React Hooks: State & Effect Lifecycles",
            duration: "20 min",
            content: `### 1.2 React Hooks: State & Effect Lifecycles

Hooks are functions that let functional components tap into React state and lifecycle features.

#### 1. useState
Manages component-local state.
\`\`\`javascript
const [theme, setTheme] = useState('light');
\`\`\`

#### 2. useEffect
Handles side effects like data fetching, subscriptions, or manual DOM adjustments.
- **No Dependency Array**: Runs after *every* render.
- **Empty Dependency Array \`[]\`**: Runs only *once* after mount.
- **With Dependencies \`[stateVal]\`**: Runs whenever dependencies change.

\`\`\`javascript
useEffect(() => {
  document.title = \`Theme is \${theme}\`;
  
  // Cleanup function
  return () => {
    console.log("Cleanup on update/unmount");
  };
}, [theme]);
\`\`\`

#### Rules of Hooks
1. Call hooks only at the **top level** (not inside loops or conditions).
2. Call hooks only from **React functional components** or custom hooks.`
          }
        ]
      },
      {
        id: "c1-m2",
        title: "Module 2: Layouts & Core Designing",
        lessons: [
          {
            id: "c1-m2-l1",
            title: "2.1 Flexbox vs CSS Grid Systems",
            duration: "18 min",
            content: `### 2.1 Flexbox vs CSS Grid Systems

Designing responsive layouts requires understanding two distinct layout models: Flexbox (1D) and CSS Grid (2D).

#### Flexbox: One-Dimensional Alignment
Ideal for components that align items along a single axis (row OR column), such as navigation menus, button groups, or toolbars.
- Key properties: \`display: flex;\`, \`justify-content\`, \`align-items\`, \`flex-grow\`.

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

#### CSS Grid: Two-Dimensional Grids
Ideal for complex page structures with rows AND columns, like galleries, dashboards, or card grids.
- Key properties: \`display: grid;\`, \`grid-template-columns\`, \`grid-gap\`.

\`\`\`css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
\`\`\`

Combine both to build responsive layouts.`
          }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "Database Design & SQL Masterclass",
    description: "Deep dive into Relational Databases, Normalization, Query Optimization, Indexing, and localStorage DB implementations.",
    instructor: "Marcus Aurelius, DB Consultant",
    category: "Database",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600",
    modules: [
      {
        id: "c2-m1",
        title: "Module 1: Relational Modeling & Schema Design",
        lessons: [
          {
            id: "c2-m1-l1",
            title: "1.1 Entities, Attributes & Primary/Foreign Keys",
            duration: "15 min",
            content: `### 1.1 Entities, Attributes & Primary/Foreign Keys

Every robust application starts with structural database modeling.

#### Entities and Attributes
- **Entity**: An object of interest (e.g., \`User\`, \`Course\`).
- **Attribute**: Properties describing the entity (e.g., user's \`email\`, course's \`title\`).

#### Primary Keys (PK)
A unique identifier for a row (e.g., \`userId\`). Must be unique and non-null.

#### Foreign Keys (FK)
A column that references a PK in another table to establish relationships (e.g., \`enrollment.userId\` refers to \`user.id\`). This maintains **Referential Integrity**.`
          },
          {
            id: "c2-m1-l2",
            title: "1.2 Database Normalization: 1NF, 2NF, 3NF",
            duration: "25 min",
            content: `### 1.2 Database Normalization: 1NF, 2NF, 3NF

Normalization reduces data redundancy and prevents update anomalies.

1. **First Normal Form (1NF)**: Atomic values, no repeating groups.
2. **Second Normal Form (2NF)**: Meets 1NF, and all non-key columns depend fully on the primary key.
3. **Third Normal Form (3NF)**: Meets 2NF, and no non-key column depends transitively on the primary key.

*Redundancy leads to issues where updating an email in one table leaves it outdated in another. Normalization separates entities into dedicated tables linked by keys.*`
          }
        ]
      }
    ]
  },
  {
    id: "course-3",
    title: "UI/UX Principles & Micro-interactions",
    description: "Learn how to build sleek layouts using CSS variables, custom themes, dark-mode styling, glassmorphism, and responsive CSS keyframe animations.",
    instructor: "Elena Rostova, Lead UI Designer",
    category: "UI/UX Design",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=600",
    modules: [
      {
        id: "c3-m1",
        title: "Module 1: Modern Visual Design & Styling",
        lessons: [
          {
            id: "c3-m1-l1",
            title: "1.1 The Anatomy of Glassmorphism",
            duration: "12 min",
            content: `### 1.1 The Anatomy of Glassmorphism

Glassmorphism is a popular aesthetic simulating translucent glass sheets.

#### Key CSS Ingredients:
1. **Translucent Background**: Using semi-transparent RGBA or HSLA.
2. **Backdrop Blur**: \`backdrop-filter: blur(10px);\`
3. **Subtle Border**: Light border to mimic the glass edge.
4. **Soft Box Shadow**: Adds depth.

\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
}
\`\`\`

Use on dark colored, rich gradient backgrounds for maximum aesthetic contrast.`
          }
        ]
      }
    ]
  }
];

export const initialQuizzes = [
  {
    id: "quiz-1",
    courseId: "course-1",
    title: "Frontend Engineering Assessment",
    questions: [
      {
        question: "Which mechanism does React use to batch DOM updates for speed?",
        options: [
          "Direct DOM Rewrites",
          "The Virtual DOM & Reconciliation",
          "Shadow DOM APIs",
          "Background Worker Nodes"
        ],
        correctIndex: 1,
        points: 10,
        explanation: "React relies on the Virtual DOM to compare structures (diffing) and update only modified portions in a single reflow batch."
      },
      {
        question: "When does a useEffect hook with an empty dependency array [] execute?",
        options: [
          "Every single render cycle",
          "Only once, right after the component mounts",
          "Before the component returns its JSX",
          "Never"
        ],
        correctIndex: 1,
        points: 10,
        explanation: "Passing an empty dependency array tells React that the hook does not depend on any state variables, executing it exactly once at mount."
      },
      {
        question: "Which layout system is ideal for aligning items along a single dimension axis?",
        options: [
          "CSS Grid",
          "Flexbox",
          "Floats",
          "Absolute Positions"
        ],
        correctIndex: 1,
        points: 10,
        explanation: "Flexbox aligns content along one dimension (row or column), whereas CSS Grid is designed for two-dimensional grids (rows AND columns)."
      }
    ]
  },
  {
    id: "quiz-2",
    courseId: "course-2",
    title: "Database Modeling Quiz",
    questions: [
      {
        question: "Which normal form requires all non-key columns to depend fully on the primary key (no partial dependencies)?",
        options: [
          "First Normal Form (1NF)",
          "Second Normal Form (2NF)",
          "Third Normal Form (3NF)",
          "Boyce-Codd Normal Form"
        ],
        correctIndex: 1,
        points: 15,
        explanation: "2NF is defined by eliminating partial key dependency. All non-key attributes must rely on the full composite key."
      },
      {
        question: "What does a Foreign Key guarantee in database relationships?",
        options: [
          "Faster index speeds",
          "Referential Integrity",
          "Table isolation",
          "Column normalization"
        ],
        correctIndex: 1,
        points: 15,
        explanation: "Foreign Keys ensure referential integrity, meaning an entry cannot reference a primary key record that does not exist in the primary table."
      }
    ]
  },
  {
    id: "quiz-3",
    courseId: "course-3",
    title: "UI Design & Glassmorphism Challenge",
    questions: [
      {
        question: "Which CSS property is crucial to create the frosted-glass look of Glassmorphism?",
        options: [
          "filter: blur()",
          "backdrop-filter: blur()",
          "opacity",
          "mix-blend-mode"
        ],
        correctIndex: 1,
        points: 10,
        explanation: "backdrop-filter: blur() applies graphical effects such as blurring to the area behind an element."
      }
    ]
  }
];
