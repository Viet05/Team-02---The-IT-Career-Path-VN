import { useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export function useUserState() {
  const [user, setUser] = useLocalStorage("devroadmap_user", null);
  const [onboarding, setOnboarding] = useLocalStorage("devroadmap_onboarding", false);
  const [selectedRoadmap, setSelectedRoadmap] = useLocalStorage("devroadmap_roadmap", null);
  const [progress, setProgress] = useLocalStorage("devroadmap_progress", {});
  const [savedJobs, setSavedJobs] = useLocalStorage("devroadmap_saved_jobs", []);
  const [savedLessons, setSavedLessons] = useLocalStorage("devroadmap_saved_lessons", []);
  const [role, setRole] = useLocalStorage("devroadmap_role", "user");

  const login = (userData) => {
    setUser(userData);
    if (userData.role) {
      setRole(userData.role);
    }
  };

  const logout = () => {
    setUser(null);
    setRole("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
  };

  const isAdmin = () => {
    return user && user.role === "admin";
  };

  const completeOnboarding = (data) => {
    setOnboarding(true);
    setSelectedRoadmap(data.roadmapId);
    setUser({
      name: data.name || "User",
      email: data.email || "",
      goalRole: data.goalRole,
      level: data.level,
      hoursPerWeek: data.hoursPerWeek,
    });
  };

  const updateProgress = (roadmapId, stepId, completed) => {
    setProgress((prev) => {
      const roadmapProgress = prev[roadmapId] || {};
      return {
        ...prev,
        [roadmapId]: {
          ...roadmapProgress,
          [stepId]: completed,
        },
      };
    });
  };

  const getProgress = (roadmapId) => {
    return progress[roadmapId] || {};
  };

  const getProgressPercentage = (roadmapId, totalSteps) => {
    const roadmapProgress = progress[roadmapId] || {};
    const completedSteps = Object.values(roadmapProgress).filter(Boolean).length;
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  };

  const toggleSavedJob = (jobId) => {
    setSavedJobs((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      }
      return [...prev, jobId];
    });
  };

  const toggleSavedLesson = (lessonId) => {
    setSavedLessons((prev) => {
      if (prev.includes(lessonId)) {
        return prev.filter((id) => id !== lessonId);
      }
      return [...prev, lessonId];
    });
  };

  const isJobSaved = (jobId) => {
    return savedJobs.includes(jobId);
  };

  const isLessonSaved = (lessonId) => {
    return savedLessons.includes(lessonId);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const setSelectedRoadmapId = (roadmapId) => {
    setSelectedRoadmap(roadmapId);
  };

  return {
    user,
    onboarding,
    selectedRoadmap,
    progress,
    savedJobs,
    savedLessons,
    login,
    logout,
    completeOnboarding,
    updateProgress,
    getProgress,
    getProgressPercentage,
    toggleSavedJob,
    toggleSavedLesson,
    isJobSaved,
    isLessonSaved,
    updateUser,
    setSelectedRoadmap: setSelectedRoadmapId,
    role,
    isAdmin,
  };
}
