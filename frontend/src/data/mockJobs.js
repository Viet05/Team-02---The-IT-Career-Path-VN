export const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer (React)",
    company: "TechCorp Inc.",
    location: "Ho Chi Minh City",
    type: "Full-time",
    level: "Junior/Middle",
    salary: "20-35M VND",
    description: `We are looking for a skilled Frontend Developer to join our team. You will be responsible for developing and maintaining user-facing features.

**Responsibilities:**
- Develop new user-facing features using React
- Build reusable components and front-end libraries
- Optimize applications for maximum speed and scalability
- Collaborate with backend developers and UI/UX designers

**Requirements:**
- 2+ years of experience with React
- Strong knowledge of JavaScript, HTML, CSS
- Experience with TypeScript
- Understanding of RESTful APIs
- Good problem-solving skills

**Nice to have:**
- Experience with Next.js
- Knowledge of state management (Redux, Zustand)
- Familiarity with testing frameworks`,
    tags: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Next.js"],
    posted: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    title: "Backend Developer (Node.js)",
    company: "StartupXYZ",
    location: "Hanoi",
    type: "Full-time",
    level: "Middle",
    salary: "25-40M VND",
    description: `Join our backend team to build scalable server-side applications.

**Responsibilities:**
- Design and develop RESTful APIs
- Write clean, maintainable code
- Optimize database queries
- Implement authentication and authorization

**Requirements:**
- 3+ years of experience with Node.js
- Strong knowledge of Express.js
- Experience with MongoDB or PostgreSQL
- Understanding of microservices architecture`,
    tags: ["Node.js", "Express", "MongoDB", "REST API", "JavaScript"],
    posted: "2024-01-18",
    status: "active",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Digital Solutions",
    location: "Remote",
    type: "Full-time",
    level: "Middle/Senior",
    salary: "30-50M VND",
    description: `We need a Full Stack Developer to work on both frontend and backend.

**Requirements:**
- React and Node.js experience
- Database design skills
- DevOps knowledge is a plus`,
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker"],
    posted: "2024-01-20",
    status: "active",
  },

  {
    id: 5,
    title: "Backend Developer (Java)",
    company: "Enterprise Systems",
    location: "Hanoi",
    type: "Full-time",
    level: "Senior",
    salary: "40-60M VND",
    description: `Senior Java developer needed for enterprise applications.`,
    tags: ["Java", "Spring", "PostgreSQL", "Microservices"],
    posted: "2024-01-19",
    status: "active",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Remote",
    type: "Full-time",
    level: "Middle/Senior",
    salary: "35-55M VND",
    description: `DevOps engineer to manage our cloud infrastructure.`,
    tags: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
    posted: "2024-01-21",
    status: "active",
  },
];

export const getJobById = (id) => {
  return mockJobs.find((j) => j.id === parseInt(id));
};

export const filterJobs = (jobs, filters) => {
  let filtered = [...jobs];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filters.location) {
    filtered = filtered.filter((job) =>
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.type) {
    filtered = filtered.filter((job) => job.type === filters.type);
  }

  if (filters.level) {
    filtered = filtered.filter((job) => job.level.includes(filters.level));
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((job) =>
      filters.tags.some((tag) => job.tags.includes(tag))
    );
  }

  return filtered;
};
