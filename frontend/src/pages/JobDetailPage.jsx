import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, getFavouriteJobs, addFavouriteJob, removeFavouriteJob } from "../services/jobService";
import { mockRoadmaps } from "../data/mockRoadmaps";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import Pill from "../components/Pill";
import EmptyState from "../components/EmptyState";
import "../styles/job-detail-page.css";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const { user, selectedRoadmap } = useUserState();
  const [favouriteMap, setFavouriteMap] = React.useState({});

  React.useEffect(() => {
    if (!user) return;
    const fetchFavs = async () => {
      try {
        const data = await getFavouriteJobs();
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(fav => {
            const jId = fav.jobPosting?.id || fav.jobPostingId || fav.jobPosting?.jobPostingId;
            if (jId) map[jId] = fav.id || fav.userFavouriteJobId;
          });
          setFavouriteMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch favourites:", err);
      }
    };
    fetchFavs();
  }, [user]);

  React.useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        setError("Lỗi tải thông tin công việc");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return <div className="job-detail-page"><div style={{ padding: "40px", textAlign: "center" }}>Đang tải...</div></div>;
  }

  if (!job) {
    return (
      <div className="job-detail-page">
        <EmptyState
          icon="❌"
          title="Job not found"
          message="The job you're looking for doesn't exist"
          actionLabel="Back to Jobs"
          onAction={() => navigate("/jobs")}
        />
      </div>
    );
  }

  const jobId = job.jobPostingId || job.id;
  const isSaved = !!favouriteMap[jobId];

  const handleToggleSavedJob = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để lưu công việc!");
      return;
    }
    const existingFavId = favouriteMap[jobId];
    try {
      if (existingFavId) {
        await removeFavouriteJob(existingFavId);
        setFavouriteMap((prev) => {
          const next = { ...prev };
          delete next[jobId];
          return next;
        });
      } else {
        const result = await addFavouriteJob(jobId);
        const newFavId = result?.id || result?.userFavouriteJobId;
        if (newFavId) {
          setFavouriteMap((prev) => ({ ...prev, [jobId]: newFavId }));
        }
      }
    } catch (err) {
      console.error("Lỗi khi lưu việc làm", err);
    }
  };

  const getMissingSkills = () => {
    if (!user || !selectedRoadmap) return [];
    const roadmap = mockRoadmaps.find(
      (r) => r.id === selectedRoadmap
    );
    if (!roadmap) return [];
    const jobSkills = job.skills || [];
    return jobSkills.filter((tag) => !roadmap.skills.includes(tag));
  };

  const missingSkills = getMissingSkills();

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <Button variant="ghost" onClick={() => navigate("/jobs")}>
          ← Back to Jobs
        </Button>

        <div className="job-detail-layout">
          <main className="job-detail-main">
            <Card>
              <div className="job-header">
                <div>
                  <h1>{job.title}</h1>
                  <p className="job-company">{job.companyName}</p>
                  <div className="job-meta">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.jobType}</span>
                    <span>•</span>
                    <span>{job.jobLevel}</span>
                    {(job.salaryText || job.salaryMin || job.salaryMax) && (
                      <>
                        <span>•</span>
                        <span>{job.salaryText ||
                          (job.salaryMin && job.salaryMax ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}` : "")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  className={`job-save-btn-large ${isSaved ? "saved" : ""}`}
                  onClick={handleToggleSavedJob}
                >
                  {isSaved ? "★ Saved" : "☆ Save Job"}
                </button>
              </div>

              <div className="job-description">
                {job.description.split("\n").map((line, idx) => {
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <h3 key={idx} className="description-heading">
                        {line.replace(/\*\*/g, "")}
                      </h3>
                    );
                  }
                  return (
                    <p key={idx} className={line.trim() ? "" : "empty-line"}>
                      {line || "\u00A0"}
                    </p>
                  );
                })}
              </div>

              <div className="job-tags-section">
                <h3>Required Skills</h3>
                <div className="job-tags">
                  {(job.skills || []).map((tag) => (
                    <Pill key={tag} variant="default">
                      {tag}
                    </Pill>
                  ))}
                </div>
              </div>

              {missingSkills.length > 0 && (
                <div className="missing-skills-section">
                  <h3>Missing Skills</h3>
                  <p>You're missing these skills for this job. Consider learning them!</p>
                  <div className="job-tags">
                    {missingSkills.map((skill) => (
                      <Pill key={skill} variant="default">
                        {skill}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </main>

          <aside className="job-detail-sidebar">
            <Card>
              <h3>Job Details</h3>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{job.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{job.jobType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Level:</span>
                <span className="detail-value">{job.jobLevel}</span>
              </div>
              {(job.salaryText || job.salaryMin || job.salaryMax) && (
                <div className="detail-row">
                  <span className="detail-label">Salary:</span>
                  <span className="detail-value">{job.salaryText}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Posted:</span>
                <span className="detail-value">{new Date(job.postedAt).toLocaleDateString()}</span>
              </div>
            </Card>

            <Card>
              <Button variant="primary" fullWidth size="lg">
                Apply Now
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate("/jobs")}>
                Browse More Jobs
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
