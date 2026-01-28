import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockJobs, filterJobs } from "../data/mockJobs";
import { mockRoadmaps } from "../data/mockRoadmaps";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import Pill from "../components/Pill";
import EmptyState from "../components/EmptyState";
import "../styles/jobs-page.css";

export default function JobsPage() {
  const navigate = useNavigate();
  const { user, selectedRoadmap, isJobSaved, toggleSavedJob } = useUserState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    level: "",
    tags: [],
  });
  const [showMatchedOnly, setShowMatchedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const allTags = [...new Set(mockJobs.flatMap((job) => job.tags))];

  const filteredJobs = useMemo(() => {
    let jobs = filterJobs(mockJobs, { ...filters, search: searchTerm });

    if (showMatchedOnly && user && selectedRoadmap) {
      const roadmap = mockRoadmaps.find((r) => r.id === selectedRoadmap);
      if (roadmap) {
        const userSkills = roadmap.skills;
        jobs = jobs.filter((job) =>
          job.tags.some((tag) => userSkills.includes(tag))
        );
      }
    }

    return jobs;
  }, [searchTerm, filters, showMatchedOnly, user, selectedRoadmap]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getMissingSkills = (job) => {
    if (!user || !selectedRoadmap) return [];
    const roadmap = mockRoadmaps.find((r) => r.id === selectedRoadmap);
    if (!roadmap) return [];
    return job.tags.filter((tag) => !roadmap.skills.includes(tag));
  };

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

              {user && selectedRoadmap && (
                <div className="filter-section">
                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={showMatchedOnly}
                      onChange={(e) => setShowMatchedOnly(e.target.checked)}
                    />
                    <span>Show matched jobs only</span>
                  </label>
                </div>
              )}

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
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="filter-section">
                <label className="filter-label">Level</label>
                <select
                  className="filter-input"
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                >
                  <option value="">All Levels</option>
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <div className="filter-section">
                <label className="filter-label">Skills</label>
                <div className="tags-filter">
                  {allTags.slice(0, 10).map((tag) => (
                    <Pill
                      key={tag}
                      variant={filters.tags.includes(tag) ? "primary" : "default"}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          tags: filters.tags.includes(tag)
                            ? filters.tags.filter((t) => t !== tag)
                            : [...filters.tags, tag],
                        });
                      }}
                    >
                      {tag}
                    </Pill>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setFilters({ location: "", type: "", level: "", tags: [] });
                  setSearchTerm("");
                  setShowMatchedOnly(false);
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
                  {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
                </h2>
              </div>
            </div>

            {paginatedJobs.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No jobs found"
                message="Try adjusting your search or filters"
              />
            ) : (
              <>
                <div className="jobs-list">
                  {paginatedJobs.map((job) => {
                    const missingSkills = getMissingSkills(job);
                    const isSaved = isJobSaved(job.id);

                    return (
                      <Card key={job.id} className="job-card" hover>
                        <div className="job-card-header">
                          <div>
                            <h3>{job.title}</h3>
                            <p className="job-company">{job.company}</p>
                          </div>
                          <button
                            className={`job-save-btn ${isSaved ? "saved" : ""}`}
                            onClick={() => toggleSavedJob(job.id)}
                            aria-label={isSaved ? "Unsave job" : "Save job"}
                          >
                            {isSaved ? "★" : "☆"}
                          </button>
                        </div>

                        <div className="job-meta">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                          <span>•</span>
                          <span>{job.level}</span>
                          {job.salary && (
                            <>
                              <span>•</span>
                              <span>{job.salary}</span>
                            </>
                          )}
                        </div>

                        <div className="job-tags">
                          {job.tags.map((tag) => (
                            <Pill key={tag} variant="default">
                              {tag}
                            </Pill>
                          ))}
                        </div>

                        {missingSkills.length > 0 && (
                          <div className="missing-skills">
                            <span className="missing-label">Missing skills:</span>
                            {missingSkills.map((skill) => (
                              <Pill key={skill} variant="default">
                                {skill}
                              </Pill>
                            ))}
                          </div>
                        )}

                        <div className="job-card-footer">
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => navigate(`/jobs/${job.id}`)}
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
          <aside className="recommended-jobs-sidebar">
            <Card>
              <h3>Recommended for You</h3>
              <div className="recommended-jobs-list">
                {mockJobs.slice(0, 5).map((job) => (
                  <Link key={job.id} to={`/jobs/${job.id}`} className="recommended-job-card">
                    <h4>{job.title}</h4>
                    <p>{job.company}</p>
                    {job.salary && <p style={{ color: 'var(--color-primary)', marginTop: '4px' }}>{job.salary}</p>}
                  </Link>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
