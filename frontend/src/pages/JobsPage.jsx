import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllJobs, getFavouriteJobs, addFavouriteJob, removeFavouriteJob } from "../services/jobService";
import { getRecommendations } from "../services/recommendationService";
import { getToken } from "../services/session";
import Card from "../components/Card";
import Button from "../components/Button";
import Pill from "../components/Pill";
import EmptyState from "../components/EmptyState";
import "../styles/jobs-page.css";

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"];
const JOB_LEVELS = ["FRESHER", "JUNIOR", "MIDDLE", "SENIOR", "LEADER", "INSPECTOR", "STAFF"];

// Helper: dịch enum từ backend sang text hiển thị
const formatEnum = (value) => {
  if (!value) return "";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function JobsPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [favouriteMap, setFavouriteMap] = useState({}); // { jobPostingId: userFavouriteJobId }
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    jobLevel: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllJobs({
          keyword: searchTerm || undefined,
          location: filters.location || undefined,
          jobType: filters.jobType || undefined,
          jobLevel: filters.jobLevel || undefined,
        });
        setJobs(Array.isArray(data) ? data : []);
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Không thể tải danh sách việc làm.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, filters]);

  // Fetch favourites and recommendations for logged-in users
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUserData = async () => {
      try {
        const [favData, recData] = await Promise.allSettled([
          getFavouriteJobs(),
          getRecommendations(6),
        ]);

        if (favData.status === "fulfilled" && Array.isArray(favData.value)) {
          const map = {};
          favData.value.forEach((fav) => {
            const favId = fav.userFavouriteJobId || fav.id;
            if (fav.jobPosting?.jobPostingId) {
              map[fav.jobPosting.jobPostingId] = favId;
            } else if (fav.jobPosting?.id) {
              map[fav.jobPosting.id] = favId;
            } else if (fav.jobPostingId) {
              map[fav.jobPostingId] = favId;
            }
          });
          setFavouriteMap(map);
        }

        if (recData.status === "fulfilled" && Array.isArray(recData.value)) {
          setRecommendedJobs(recData.value.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  const handleToggleFavourite = async (job) => {
    const jobId = job.jobPostingId || job.id;
    if (!jobId) {
      console.error("Job ID applies is missing");
      return;
    }
    const existingFavId = favouriteMap[jobId];

    try {
      if (existingFavId) {
        // Xóa khỏi yêu thích
        await removeFavouriteJob(existingFavId);
        setFavouriteMap((prev) => {
          const next = { ...prev };
          delete next[jobId];
          return next;
        });
      } else {
        // Thêm vào yêu thích
        const result = await addFavouriteJob(jobId);
        const newFavId = result?.id || result?.userFavouriteJobId;
        if (newFavId) {
          setFavouriteMap((prev) => ({ ...prev, [jobId]: newFavId }));
        }
      }
    } catch (err) {
      console.error("Failed to toggle favourite:", err);
    }
  };

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <div className="page-header">
          <div>
            <h1>Job Opportunities</h1>
            <p>Find your next career opportunity</p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="search-card">
          <input
            type="text"
            className="search-input"
            placeholder="Search jobs by title, company, or skills..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Card>

        <div className="jobs-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <Card>
              <h3>Filters</h3>

              <div className="filter-section">
                <label className="filter-label">Location</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="e.g., Ho Chi Minh City"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                />
              </div>

              <div className="filter-section">
                <label className="filter-label">Type</label>
                <select
                  className="filter-input"
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                >
                  <option value="">All Types</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{formatEnum(t)}</option>
                  ))}
                </select>
              </div>

              <div className="filter-section">
                <label className="filter-label">Level</label>
                <select
                  className="filter-input"
                  value={filters.jobLevel}
                  onChange={(e) => setFilters({ ...filters, jobLevel: e.target.value })}
                >
                  <option value="">All Levels</option>
                  {JOB_LEVELS.map((l) => (
                    <option key={l} value={l}>{formatEnum(l)}</option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setFilters({ location: "", jobType: "", jobLevel: "" });
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                Reset Filters
              </Button>
            </Card>
          </aside>

          {/* Main Results Section */}
          <main className="results-section">
            <div className="results-header">
              <div>
                <h2>
                  {loading ? "Loading..." : `${jobs.length} ${jobs.length === 1 ? "job" : "jobs"} found`}
                </h2>
              </div>
            </div>

            {loading && (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <p>Đang tải danh sách việc làm...</p>
              </div>
            )}

            {error && !loading && (
              <EmptyState
                icon="⚠️"
                title="Lỗi tải dữ liệu"
                message={error}
              />
            )}

            {!loading && !error && paginatedJobs.length === 0 && (
              <EmptyState
                icon="🔍"
                title="No jobs found"
                message="Try adjusting your search or filters"
              />
            )}

            {!loading && !error && paginatedJobs.length > 0 && (
              <>
                <div className="jobs-list">
                  {paginatedJobs.map((job) => {
                    const jobId = job.jobPostingId || job.id;
                    const isSaved = !!(favouriteMap[jobId]);

                    return (
                      <Card key={jobId} className="job-card" hover>
                        <div className="job-card-header">
                          <div>
                            <h3>{job.title || job.jobTitle}</h3>
                            <p className="job-company">{job.companyName || job.company}</p>
                          </div>
                          {isLoggedIn && (
                            <button
                              className={`job-save-btn ${isSaved ? "saved" : ""}`}
                              onClick={() => handleToggleFavourite(job)}
                              aria-label={isSaved ? "Unsave job" : "Save job"}
                            >
                              {isSaved ? "★" : "☆"}
                            </button>
                          )}
                        </div>

                        <div className="job-meta">
                          {job.location && <span>{job.location}</span>}
                          {job.jobType && (
                            <>
                              <span>•</span>
                              <span>{formatEnum(job.jobType)}</span>
                            </>
                          )}
                          {job.jobLevel && (
                            <>
                              <span>•</span>
                              <span>{formatEnum(job.jobLevel)}</span>
                            </>
                          )}
                          {(job.minSalary || job.maxSalary) && (
                            <>
                              <span>•</span>
                              <span>
                                {job.minSalary && job.maxSalary
                                  ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`
                                  : job.minSalary
                                    ? `From ${job.minSalary.toLocaleString()}`
                                    : `Up to ${job.maxSalary.toLocaleString()}`}
                              </span>
                            </>
                          )}
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="job-tags">
                            {job.skills.slice(0, 5).map((skill, idx) => (
                              <Pill key={idx} variant="default">
                                {skill.skillName || skill.name || skill}
                              </Pill>
                            ))}
                          </div>
                        )}

                        <div className="job-card-footer">
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => navigate(`/jobs/${jobId}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Recommended Jobs Sidebar */}
          {isLoggedIn && recommendedJobs.length > 0 && (
            <aside className="recommended-jobs-sidebar">
              <Card>
                <h3>Recommended for You</h3>
                <div className="recommended-jobs-list">
                  {recommendedJobs.map((job, idx) => (
                    <Link key={job.jobPostingId || job.id || idx} to={`/jobs/${job.jobPostingId || job.id}`} className="recommended-job-card">
                      <h4>{job.jobTitle || job.title}</h4>
                      <p>{job.companyName || job.company}</p>
                      {job.matchScore !== undefined && (
                        <p style={{ color: 'var(--color-primary)', marginTop: '4px', fontSize: '12px' }}>
                          Match: {job.matchScore > 1 ? Math.round(job.matchScore) : Math.round(job.matchScore * 100)}%
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </Card>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
