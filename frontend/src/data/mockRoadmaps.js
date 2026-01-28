export const mockRoadmaps = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Master modern frontend development with React, TypeScript, and modern tooling",
    icon: "🎨",
    category: "Frontend",
    totalSteps: 12,
    totalLessons: 45,
    estimatedHours: 120,
    skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Next.js"],
    steps: [
      {
        id: 1,
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of web development",
        order: 1,
        lessons: [
          {
            id: 1,
            title: "Introduction to HTML",
            content: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. Learn about semantic HTML, forms, accessibility, and best practices.",
            duration: 30,
            type: "Article",
            url: "#",
          },
          {
            id: 2,
            title: "CSS Basics",
            content: "CSS (Cascading Style Sheets) is used to style and layout web pages. Master selectors, properties, flexbox, and grid.",
            duration: 45,
            type: "Video",
            url: "#",
          },
          {
            id: 3,
            title: "Responsive Design",
            content: "Learn how to make your websites work beautifully on all devices using media queries and responsive units.",
            duration: 60,
            type: "Tutorial",
            url: "#",
          },
        ],
      },
      {
        id: 2,
        title: "JavaScript Fundamentals",
        description: "Master the core concepts of JavaScript",
        order: 2,
        lessons: [
          {
            id: 4,
            title: "Variables and Data Types",
            content: "Understanding variables, let, const, and different data types in JavaScript.",
            duration: 25,
            type: "Article",
            url: "#",
          },
          {
            id: 5,
            title: "Functions and Scope",
            content: "Learn about function declarations, arrow functions, closures, and scope.",
            duration: 40,
            type: "Video",
            url: "#",
          },
          {
            id: 6,
            title: "Async JavaScript",
            content: "Master promises, async/await, and handling asynchronous operations.",
            duration: 50,
            type: "Tutorial",
            url: "#",
          },
        ],
      },
      {
        id: 3,
        title: "React Basics",
        description: "Build modern user interfaces with React",
        order: 3,
        lessons: [
          {
            id: 7,
            title: "React Components",
            content: "Understanding components, props, JSX, and component composition in React.",
            duration: 50,
            type: "Video",
            url: "#",
          },
          {
            id: 8,
            title: "State and Hooks",
            content: "Learn about useState, useEffect, and other React hooks for managing state and side effects.",
            duration: 60,
            type: "Tutorial",
            url: "#",
          },
        ],
      },
      {
        id: 4,
        title: "Advanced React",
        description: "Advanced patterns and best practices",
        order: 4,
        lessons: [
          {
            id: 9,
            title: "Context API",
            content: "Managing global state with React Context and avoiding prop drilling.",
            duration: 35,
            type: "Video",
            url: "#",
          },
          {
            id: 10,
            title: "Performance Optimization",
            content: "Learn React.memo, useMemo, useCallback, and code splitting for better performance.",
            duration: 45,
            type: "Tutorial",
            url: "#",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Build robust server-side applications with Node.js, databases, and APIs",
    icon: "⚙️",
    category: "Backend",
    totalSteps: 15,
    totalLessons: 60,
    estimatedHours: 150,
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST API", "GraphQL"],
    steps: [
      {
        id: 5,
        title: "Node.js Fundamentals",
        description: "Learn server-side JavaScript with Node.js",
        order: 1,
        lessons: [
          {
            id: 11,
            title: "Introduction to Node.js",
            content: "Understanding Node.js runtime, modules, and the event loop.",
            duration: 40,
            type: "Video",
            url: "#",
          },
          {
            id: 12,
            title: "NPM and Package Management",
            content: "Learn how to manage dependencies and publish packages.",
            duration: 30,
            type: "Article",
            url: "#",
          },
        ],
      },
      {
        id: 6,
        title: "Express.js",
        description: "Build web servers with Express",
        order: 2,
        lessons: [
          {
            id: 13,
            title: "Express Basics",
            content: "Setting up Express, routing, middleware, and request handling.",
            duration: 50,
            type: "Tutorial",
            url: "#",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Full Stack Developer",
    description: "End-to-end development skills from frontend to backend",
    icon: "🚀",
    category: "Full Stack",
    totalSteps: 20,
    totalLessons: 80,
    estimatedHours: 200,
    skills: ["React", "Node.js", "MongoDB", "TypeScript", "Docker", "AWS"],
    steps: [
      {
        id: 7,
        title: "Full Stack Architecture",
        description: "Understanding full stack application architecture",
        order: 1,
        lessons: [
          {
            id: 14,
            title: "System Design Basics",
            content: "Learn how to design scalable full stack applications.",
            duration: 60,
            type: "Video",
            url: "#",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "DevOps Engineer",
    description: "Master CI/CD, containers, and cloud infrastructure",
    icon: "🐳",
    category: "DevOps",
    totalSteps: 18,
    totalLessons: 55,
    estimatedHours: 180,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux"],
    steps: [],
  },
];

export const getRoadmapById = (id) => {
  return mockRoadmaps.find((r) => r.id === parseInt(id));
};

export const getLessonById = (roadmapId, lessonId) => {
  const roadmap = getRoadmapById(roadmapId);
  if (!roadmap) return null;

  for (const step of roadmap.steps) {
    const lesson = step.lessons.find((l) => l.id === parseInt(lessonId));
    if (lesson) return { lesson, step, roadmap };
  }
  return null;
};
