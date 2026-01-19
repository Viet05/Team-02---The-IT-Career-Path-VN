import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoadmapById } from "../data/mockRoadmaps";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import "../styles/roadmap-detail-page.css";

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roadmap = getRoadmapById(id);
  const { getProgress, updateProgress, getProgressPercentage, isLessonSaved, toggleSavedLesson } =
    useUserState();
  const [expandedStep, setExpandedStep] = useState(null);

  if (!roadmap) {
    return (
      <div className="roadmap-detail-page">
        <EmptyState
          icon="❌"
          title="Roadmap not found"
          message="The roadmap you're looking for doesn't exist"
          actionLabel="Back to Roadmaps"
          onAction={() => navigate("/roadmaps")}
        />
      </div>
    );
  }

  const progress = getProgress(roadmap.id);
  const progressPercentage = getProgressPercentage(roadmap.id, roadmap.totalSteps);
  const completedSteps = Object.values(progress).filter(Boolean).length;

  const getNextLesson = () => {
    for (const step of roadmap.steps) {
      const isStepCompleted = progress[step.id];
      if (!isStepCompleted) {
        return step.lessons[0];
      }
      for (const lesson of step.lessons) {
        // In a real app, check if lesson is completed
        return lesson;
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();

  return (
    <div className="roadmap-detail-page">
      <div className="roadmap-detail-container">
        <div className="roadmap-header">
          <Button variant="ghost" onClick={() => navigate("/roadmaps")}>
            ← Back to Roadmaps
          </Button>
          <div className="roadmap-header-content">
            <div className="roadmap-title-section">
              <div className="roadmap-icon-large">{roadmap.icon}</div>
              <div>
                <h1>{roadmap.title}</h1>
                <p>{roadmap.description}</p>
              </div>
            </div>
            <div className="roadmap-progress-overview">
              <ProgressBar value={progressPercentage} max={100} showLabel={true} size="lg" />
              <div className="progress-stats">
                <span>
                  {completedSteps} of {roadmap.totalSteps} steps completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {nextLesson && (
          <Card className="continue-learning-card">
            <div className="continue-content">
              <div>
                <h3>Continue Learning</h3>
                <p>Your next lesson: {nextLesson.title}</p>
              </div>
              <Button
                variant="primary"
                onClick={() => navigate(`/roadmaps/${id}/lesson/${nextLesson.id}`)}
              >
                Start Lesson
              </Button>
            </div>
          </Card>
        )}

        <div className="steps-section">
          <h2>Learning Path</h2>
          <div className="steps-list">
            {roadmap.steps.map((step, index) => {
              const isCompleted = progress[step.id];
              const isExpanded = expandedStep === step.id;

              return (
                <Card key={step.id} className="step-card">
                  <div className="step-header">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <div className="step-title-row">
                        <h3>{step.title}</h3>
                        <label className="step-checkbox">
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={(e) => updateProgress(roadmap.id, step.id, e.target.checked)}
                          />
                          <span>Mark as complete</span>
                        </label>
                      </div>
                      <p>{step.description}</p>
                      <div className="step-meta">
                        <span>{step.lessons.length} lessons</span>
                      </div>
                    </div>
                  </div>

                  {step.lessons.length > 0 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                        className="toggle-lessons-btn"
                      >
                        {isExpanded ? "Hide" : "Show"} Lessons ({step.lessons.length})
                      </Button>

                      {isExpanded && (
                        <div className="lessons-list">
                          {step.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              to={`/roadmaps/${id}/lesson/${lesson.id}`}
                              className="lesson-item"
                            >
                              <div className="lesson-icon">
                                {lesson.type === "Video" ? "▶️" : lesson.type === "Article" ? "📄" : "📚"}
                              </div>
                              <div className="lesson-content">
                                <div className="lesson-title">{lesson.title}</div>
                                <div className="lesson-meta">
                                  <span>{lesson.duration} min</span>
                                  <span>•</span>
                                  <span>{lesson.type}</span>
                                </div>
                              </div>
                              <button
                                className={`lesson-save-btn ${isLessonSaved(lesson.id) ? "saved" : ""}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleSavedLesson(lesson.id);
                                }}
                                aria-label={isLessonSaved(lesson.id) ? "Unsave lesson" : "Save lesson"}
                              >
                                {isLessonSaved(lesson.id) ? "★" : "☆"}
                              </button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
