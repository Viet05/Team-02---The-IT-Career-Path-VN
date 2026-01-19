import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import "../styles/roadmap.css";

const MOCK_ROADMAP = {
  id: 1,
  title: "Frontend Developer Roadmap",
  description: "Complete guide to becoming a Frontend Developer",
  steps: [
    {
      id: 1,
      title: "HTML & CSS Basics",
      description: "Learn the fundamentals of web structure and styling",
      completed: true,
      lessons: [
        {
          id: 1,
          title: "Introduction to HTML",
          content: "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
          duration: "30 min",
          type: "Article",
        },
        {
          id: 2,
          title: "CSS Fundamentals",
          content: "CSS (Cascading Style Sheets) is used to style and layout web pages...",
          duration: "45 min",
          type: "Video",
        },
        {
          id: 3,
          title: "Responsive Design",
          content: "Learn how to make your websites work on all devices...",
          duration: "1 hour",
          type: "Tutorial",
        },
      ],
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      description: "Master the core concepts of JavaScript",
      completed: true,
      lessons: [
        {
          id: 4,
          title: "Variables and Data Types",
          content: "Understanding variables, let, const, and different data types in JavaScript...",
          duration: "25 min",
          type: "Article",
        },
        {
          id: 5,
          title: "Functions and Scope",
          content: "Learn about function declarations, arrow functions, and scope...",
          duration: "40 min",
          type: "Video",
        },
      ],
    },
    {
      id: 3,
      title: "React Basics",
      description: "Build modern user interfaces with React",
      completed: false,
      lessons: [
        {
          id: 6,
          title: "React Components",
          content: "Understanding components, props, and JSX in React...",
          duration: "50 min",
          type: "Video",
        },
        {
          id: 7,
          title: "State and Hooks",
          content: "Learn about useState, useEffect, and other React hooks...",
          duration: "1 hour",
          type: "Tutorial",
        },
      ],
    },
    {
      id: 4,
      title: "Advanced React",
      description: "Advanced patterns and best practices",
      completed: false,
      lessons: [
        {
          id: 8,
          title: "Context API",
          content: "Managing global state with React Context...",
          duration: "35 min",
          type: "Video",
        },
      ],
    },
  ],
};

export default function RoadmapDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [roadmap] = useState(MOCK_ROADMAP);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const toggleStepComplete = (stepId) => {
    // In real app, this would update the backend
    console.log("Toggle step:", stepId);
  };

  const getProgress = () => {
    const completed = roadmap.steps.filter((s) => s.completed).length;
    return Math.round((completed / roadmap.steps.length) * 100);
  };

  return (
    <div className="roadmap-detail">
      <div className="roadmap-container">
        <button className="back-btn" onClick={() => nav(-1)}>
          ← Back
        </button>

        <div className="roadmap-header">
          <h1>{roadmap.title}</h1>
          <p className="roadmap-description">{roadmap.description}</p>
          <div className="roadmap-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getProgress()}%` }} />
            </div>
            <span className="progress-text">{getProgress()}% Complete</span>
          </div>
        </div>

        <div className="roadmap-steps">
          {roadmap.steps.map((step, index) => (
            <div key={step.id} className="roadmap-step">
              <div className="step-header">
                <div className="step-number">{index + 1}</div>
                <div className="step-info">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <label className="step-checkbox">
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => toggleStepComplete(step.id)}
                  />
                  <span>Done</span>
                </label>
              </div>

              <div className="step-lessons">
                <h4>Lessons ({step.lessons.length})</h4>
                <div className="lessons-list">
                  {step.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="lesson-item"
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="lesson-icon">
                        {lesson.type === "Video" ? "▶️" : lesson.type === "Article" ? "📄" : "📚"}
                      </div>
                      <div className="lesson-content">
                        <div className="lesson-title">{lesson.title}</div>
                        <div className="lesson-meta">
                          <span>{lesson.duration}</span>
                          <span>•</span>
                          <span>{lesson.type}</span>
                        </div>
                      </div>
                      <div className="lesson-arrow">→</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        title={selectedLesson?.title}
        size="large"
      >
        {selectedLesson && (
          <div className="lesson-detail">
            <div className="lesson-detail-meta">
              <span className="lesson-badge">{selectedLesson.type}</span>
              <span className="lesson-duration">{selectedLesson.duration}</span>
            </div>
            <div className="lesson-detail-content">
              <p>{selectedLesson.content}</p>
              <div className="lesson-actions">
                <button className="btn btn-primary">Start Learning</button>
                <button className="btn btn-outline" onClick={() => setShowLessonModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
