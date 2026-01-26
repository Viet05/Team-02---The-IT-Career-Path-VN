import { mockJobs } from "../data/mockJobs";
import { mockRoadmaps } from "../data/mockRoadmaps";

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockService = {
  // Jobs
  async getJobs(params = {}) {
    await delay(300);
    let filtered = [...mockJobs];

    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.tags?.some((t) => t.toLowerCase().includes(kw))
      );
    }

    if (params.level) {
      filtered = filtered.filter((j) =>
        j.level.toLowerCase().includes(params.level.toLowerCase())
      );
    }

    if (params.location) {
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(params.location.toLowerCase())
      );
    }

    if (params.type) {
      filtered = filtered.filter((j) =>
        j.type.toLowerCase().includes(params.type.toLowerCase())
      );
    }

    return {
      data: filtered,
      total: filtered.length,
      message: "Success",
    };
  },

  async getJobById(id) {
    await delay(200);
    const job = mockJobs.find((j) => j.id === parseInt(id));
    if (!job) {
      throw new Error("Job not found");
    }
    return { data: job, message: "Success" };
  },

  // Roadmaps
  async getRoadmaps() {
    await delay(300);
    return {
      data: mockRoadmaps,
      total: mockRoadmaps.length,
      message: "Success",
    };
  },

  async getRoadmapById(id) {
    await delay(200);
    const roadmap = mockRoadmaps.find((r) => r.id === parseInt(id));
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }
    return { data: roadmap, message: "Success" };
  },

  // Auth
  async login(email, password) {
    await delay(500);
    if (email === "student@test.com" && password === "password") {
      return {
        data: {
          token: "mock_student_token_" + Date.now(),
          role: "STUDENT",
          user: { id: 1, email, role: "STUDENT" },
        },
        message: "Login successful",
      };
    }
    if (email === "company@test.com" && password === "password") {
      return {
        data: {
          token: "mock_company_token_" + Date.now(),
          role: "COMPANY",
          user: { id: 2, email, role: "COMPANY" },
        },
        message: "Login successful",
      };
    }
    if (email === "admin@test.com" && password === "password") {
      return {
        data: {
          token: "mock_admin_token_" + Date.now(),
          role: "ADMIN",
          user: { id: 3, email, role: "ADMIN" },
        },
        message: "Login successful",
      };
    }
    throw new Error("Invalid email or password");
  },

  async register(data) {
    await delay(500);
    return {
      data: {
        id: Math.random(),
        ...data,
        role: "STUDENT",
        createdAt: new Date().toISOString(),
      },
      message: "Registration successful",
    };
  },

  async logout() {
    await delay(200);
    return { message: "Logout successful" };
  },

  // User Profile
  async getProfile() {
    await delay(300);
    return {
      data: {
        id: 1,
        email: "student@test.com",
        username: "student_user",
        role: "STUDENT",
        profile: {
          fullName: "Nguyễn Văn A",
          avatar: "https://via.placeholder.com/150",
          bio: "Passionate about web development",
          university: "FPT University",
          major: "Information Technology",
          dateOfBirth: "2003-01-15",
          currentLevel: "Beginner",
          careerGoal: "Full Stack Developer",
        },
      },
      message: "Success",
    };
  },

  async updateProfile(data) {
    await delay(400);
    return {
      data: { ...data, id: 1 },
      message: "Profile updated successfully",
    };
  },
};
