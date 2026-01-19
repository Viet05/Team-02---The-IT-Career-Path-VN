import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { getRoadmapById } from "../data/mockRoadmaps";
import { mockJobs, getJobById } from "../data/mockJobs";
import Card from "../components/Card";
import Button from "../components/Button";
import Pill from "../components/Pill";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import "../styles/hub-page.css";

export default function HubPage() {
  const navigate = useNavigate();
  const {
    user,
    selectedRoadmap,
    getProgressPercentage,
    savedJobs,
    savedLessons,
    getProgress,
  } = useUserState();

  const roadmap = selectedRoadmap ? getRoadmapById(selectedRoadmap) : null;
  const progress = roadmap ? getProgressPercentage(selectedRoadmap, roadmap.totalSteps) : 0;
  const roadmapProgress = roadmap ? getProgress(roadmap.id) : {};

  const getNextStep = () => {
    if (!roadmap) return null;
    for (const step of roadmap.steps) {
      if (!roadmapProgress[step.id]) {
        return step;
      }
    }
    return null;
  };

  const nextStep = getNextStep();
  const nextLesson = nextStep ? nextStep.lessons[0] : null;

  const savedJobsData = savedJobs.map((id) => getJobById(id)).filter(Boolean);
  const savedLessonsData = savedLessons
    .map((lessonId) => {
      if (!roadmap) return null;
      for (const step of roadmap.steps) {
        const lesson = step.lessons.find((l) => l.id === lessonId);
        if (lesson) return { lesson, step, roadmap };
      }
      return null;
    })
    .filter(Boolean);

  const recommendedJobs = mockJobs
    .filter((job) => {
      if (!roadmap) return false;
      return job.tags.some((tag) => roadmap.skills.includes(tag));
    })
    .slice(0, 6);

  if (!user) {
    return (
      <div className="hub-page">
        <EmptyState
          icon="👤"
          title="Please log in"
          message="You need to be logged in to access your learning hub"
          actionLabel="Go to Login"
          onAction={() => navigate("/auth/login")}
        />
      </div>
    );
  }

  return (
    <div className="hub-page">
      <div className="hub-container">
        <div className="hub-header">
          <div>
            <h1>Welcome back, {user.name || "User"}! 👋</h1>
            <p>Continue your learning journey</p>
          </div>
        </div>

        {/* Continue Learning */}
        {roadmap && nextStep && (
          <section className="hub-section">
            <h2>Continue Learning</h2>
            <Card className="continue-card">
              <div className="continue-content">
                <div>
                  <div className="continue-badge">{roadmap.icon} {roadmap.title}</div>
                  <h3>Next: {nextStep.title}</h3>
                  <p>{nextStep.description}</p>
                  {nextLesson && (
                    <div className="next-lesson">
                      <span>📚 {nextLesson.title}</span>
                      <span>•</span>
                      <span>{nextLesson.duration} min</span>
                    </div>
                  )}
                </div>
                <div className="continue-actions">
                  <ProgressBar value={progress} max={100} showLabel={true} size="lg" />
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (nextLesson) {
                        navigate(`/roadmaps/${roadmap.id}/lesson/${nextLesson.id}`);
                      } else {
                        navigate(`/roadmaps/${roadmap.id}`);
                      }
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Saved Items */}
        <div className="hub-grid">
          {/* Saved Jobs */}
          <section className="hub-section">
            <div className="section-header-row">
              <h2>Saved Jobs</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/jobs")}>
                View All
              </Button>
            </div>
            {savedJobsData.length === 0 ? (
              <Card>
                <EmptyState
                  icon="💼"
                  title="No saved jobs"
                  message="Save jobs you're interested in"
                  actionLabel="Browse Jobs"
                  onAction={() => navigate("/jobs")}
                />
              </Card>
            ) : (
              <div className="saved-items-grid">
                {savedJobsData.slice(0, 3).map((job) => (
                  <Card key={job.id} className="saved-item-card" hover>
                    <h3>{job.title}</h3>
                    <p className="saved-item-meta">{job.company} • {job.location}</p>
                    <div className="saved-item-tags">
                      {job.tags.slice(0, 3).map((tag) => (
                        <Pill key={tag} variant="default">
                          {tag}
                        </Pill>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Saved Lessons */}
          <section className="hub-section">
            <div className="section-header-row">
              <h2>Saved Lessons</h2>
              {roadmap && (
                <Button variant="ghost" size="sm" onClick={() => navigate(`/roadmaps/${roadmap.id}`)}>
                  View Roadmap
                </Button>
              )}
            </div>
            {savedLessonsData.length === 0 ? (
              <Card>
                <EmptyState
                  icon="📚"
                  title="No saved lessons"
                  message="Save lessons to review later"
                />
              </Card>
            ) : (
              <div className="saved-items-list">
                {savedLessonsData.slice(0, 5).map((item, idx) => (
                  <Card key={idx} className="saved-lesson-item" hover>
                    <Link
                      to={`/roadmaps/${item.roadmap.id}/lesson/${item.lesson.id}`}
                      className="saved-lesson-link"
                    >
                      <div className="saved-lesson-icon">
                        {item.lesson.type === "Video" ? "▶️" : item.lesson.type === "Article" ? "📄" : "📚"}
                      </div>
                      <div className="saved-lesson-content">
                        <h4>{item.lesson.title}</h4>
                        <p className="saved-item-meta">
                          {item.step.title} • {item.lesson.duration} min
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Recommended Jobs */}
        {recommendedJobs.length > 0 && (
          <section className="hub-section">
            <div className="section-header-row">
              <div>
                <h2>Recommended Jobs</h2>
                <p>Jobs matched to your skills</p>
              </div>
              <Button variant="outline" onClick={() => navigate("/jobs")}>
                View All
              </Button>
            </div>
            <div className="recommended-jobs-grid">
              {recommendedJobs.map((job) => (
                <Card key={job.id} className="job-card-small" hover>
                  <h3>{job.title}</h3>
                  <p className="saved-item-meta">{job.company} • {job.location}</p>
                  <div className="saved-item-tags">
                    {job.tags.slice(0, 3).map((tag) => (
                      <Pill key={tag} variant="default">
                        {tag}
                      </Pill>
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
