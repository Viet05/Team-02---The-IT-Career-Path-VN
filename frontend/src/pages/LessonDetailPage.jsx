import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById } from "../data/mockRoadmaps";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import "../styles/lesson-detail-page.css";

export default function LessonDetailPage() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const lessonData = getLessonById(id, lessonId);
  const { isLessonSaved, toggleSavedLesson } = useUserState();

  if (!lessonData) {
    return (
      <div className="lesson-detail-page">
        <EmptyState
          icon="❌"
          title="Lesson not found"
          message="The lesson you're looking for doesn't exist"
          actionLabel="Back to Roadmap"
          onAction={() => navigate(`/roadmaps/${id}`)}
        />
      </div>
    );
  }

  const { lesson, step, roadmap } = lessonData;
  const isSaved = isLessonSaved(lesson.id);

  return (
    <div className="lesson-detail-page">
      <div className="lesson-detail-container">
        <Button variant="ghost" onClick={() => navigate(`/roadmaps/${id}`)}>
          ← Back to Roadmap
        </Button>

        <Card className="lesson-card">
          <div className="lesson-header">
            <div className="lesson-breadcrumb">
              <span>{roadmap.title}</span>
              <span>•</span>
              <span>{step.title}</span>
            </div>
            <button
              className={`lesson-save-btn ${isSaved ? "saved" : ""}`}
              onClick={() => toggleSavedLesson(lesson.id)}
              aria-label={isSaved ? "Unsave lesson" : "Save lesson"}
            >
              {isSaved ? "★ Saved" : "☆ Save"}
            </button>
          </div>

          <div className="lesson-meta-badges">
            <span className="lesson-badge">{lesson.type}</span>
            <span className="lesson-duration">{lesson.duration} minutes</span>
          </div>

          <h1>{lesson.title}</h1>

          <div className="lesson-content">
            <p>{lesson.content}</p>
          </div>

          <div className="lesson-actions">
            <Button variant="primary" onClick={() => window.open(lesson.url, "_blank")}>
              Start Learning
            </Button>
            <Button variant="outline" onClick={() => navigate(`/roadmaps/${id}`)}>
              Back to Steps
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
