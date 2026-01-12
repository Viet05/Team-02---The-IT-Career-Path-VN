import React, { useMemo, useState } from "react";
import "../styles/job.css";

const MOCK_JOBS = [
  {
    id: 1,
    title: "Backend Developer (Java)",
    company: "Company Name",
    location: "HCM",
    type: "Full-time",
    level: "Junior/Middle",
    salary: "20-35M",
    tags: ["Java", "Spring", "MySQL"],
    posted: "Đăng 52 phút trước",
  },
  {
    id: 2,
    title: "Backend Developer (Node.js)",
    company: "Company Name",
    location: "HCM",
    type: "Full-time",
    level: "Junior/Middle",
    salary: "20-35M",
    tags: ["Node.js", "Express", "MySQL"],
    posted: "Đăng 1 giờ trước",
  },
  {
    id: 3,
    title: "Backend Developer (Java)",
    company: "Company Name",
    location: "Hà Nội",
    type: "Full-time",
    level: "Intern/Junior",
    salary: "15-25M",
    tags: ["Java", "Spring", "REST"],
    posted: "Đăng 3 giờ trước",
  },
  {
    id: 4,
    title: "Backend Developer (Node.js)",
    company: "Company Name",
    location: "Remote",
    type: "Part-time",
    level: "Middle/Senior",
    salary: "30-50M",
    tags: ["Node.js", "Docker", "PostgreSQL"],
    posted: "Đăng 1 ngày trước",
  },
];

function Tag({ children }) {
  return <span className="job-tag">{children}</span>;
}

export default function JobsPage() {
  // search
  const [keyword, setKeyword] = useState("");

  // filters
  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("");
  const [city, setCity] = useState("");
  const [workType, setWorkType] = useState("");
  const [skillText, setSkillText] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [showSalary, setShowSalary] = useState(false);

  // sort + pagination
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = useMemo(() => {
    const kw = (keyword || "").toLowerCase().trim();
    const pos = (position || "").toLowerCase().trim();
    const lv = (level || "").toLowerCase().trim();
    const ct = (city || "").toLowerCase().trim();
    const wt = (workType || "").toLowerCase().trim();
    const st = (skillText || "").toLowerCase().trim();

    let list = [...MOCK_JOBS];

    // basic keyword: title/company/tags
    if (kw) {
      list = list.filter((j) => {
        const hay = `${j.title} ${j.company} ${j.tags.join(" ")}`.toLowerCase();
        return hay.includes(kw);
      });
    }

    if (pos) list = list.filter((j) => j.title.toLowerCase().includes(pos));
    if (lv) list = list.filter((j) => j.level.toLowerCase().includes(lv));
    if (ct) list = list.filter((j) => j.location.toLowerCase().includes(ct));
    if (wt) list = list.filter((j) => j.type.toLowerCase().includes(wt));

    if (st) {
      // skillText: "java, spring" -> match any token in tags/title
      const tokens = st.split(",").map((t) => t.trim()).filter(Boolean);
      if (tokens.length) {
        list = list.filter((j) => {
          const hay = `${j.title} ${j.tags.join(" ")}`.toLowerCase();
          return tokens.some((t) => hay.includes(t));
        });
      }
    }

    if (remoteOnly) list = list.filter((j) => j.location.toLowerCase().includes("remote"));

    // salary range chỉ là demo: nếu có min/max thì lọc bằng số (M)
    const min = salaryMin ? Number(salaryMin) : null;
    const max = salaryMax ? Number(salaryMax) : null;
    if (min !== null || max !== null) {
      list = list.filter((j) => {
        // "20-35M" -> [20,35]
        const nums = (j.salary || "").replace("M", "").split("-").map((x) => Number(x.trim()));
        const lo = nums[0] || 0;
        const hi = nums[1] || lo;

        const okMin = min === null ? true : hi >= min;
        const okMax = max === null ? true : lo <= max;
        return okMin && okMax;
      });
    }

    // sort demo
    if (sort === "Newest") {
      // giữ nguyên mock
    } else if (sort === "Oldest") {
      list = list.slice().reverse();
    }

    return list;
  }, [keyword, position, level, city, workType, skillText, salaryMin, salaryMax, remoteOnly, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const applyFilters = () => {
    setPage(1);
  };

  const resetFilters = () => {
    setPosition("");
    setLevel("");
    setCity("");
    setWorkType("");
    setSkillText("");
    setSalaryMin("");
    setSalaryMax("");
    setRemoteOnly(false);
    setShowSalary(false);
    setPage(1);
  };

  return (
    <main className="jobs-page">
      <div className="jobs-container">
        {/* intro line */}
        <div className="jobs-hint">
          Tìm kiếm / lọc việc làm IT theo vị trí, kỹ năng, level.
        </div>

        {/* search bar */}
        <section className="jobs-search">
          <input
            className="jobs-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Keyword (VD: Backend, Java, React...)"
          />
          <button className="btn btn-primary" type="button" onClick={() => setPage(1)}>
            Search
          </button>
        </section>

        <div className="jobs-grid">
          {/* filters */}
          <aside className="jobs-filters">
            <div className="card">
              <h3>Bộ lọc</h3>

              <label className="field">
                <span>Vị trí tuyển dụng</span>
                <input
                  className="input"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="VD: Backend Developer"
                />
              </label>

              <label className="field">
                <span>Level</span>
                <select className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="">Intern / Junior / Middle / Senior</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                </select>
              </label>

              <label className="field">
                <span>Địa điểm</span>
                <select className="input" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Hà Nội / HCM / Remote</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="HCM">HCM</option>
                  <option value="Remote">Remote</option>
                </select>
              </label>

              <label className="field">
                <span>Hình thức</span>
                <select className="input" value={workType} onChange={(e) => setWorkType(e.target.value)}>
                  <option value="">Full-time / Part-time</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </label>

              <label className="field">
                <span>Kỹ năng (tags)</span>
                <input
                  className="input"
                  value={skillText}
                  onChange={(e) => setSkillText(e.target.value)}
                  placeholder="VD: Java, Spring, React..."
                />
              </label>

              <div className="field">
                <span>Mức lương (range)</span>
                <div className="range">
                  <input
                    className="input"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="Min"
                    inputMode="numeric"
                  />
                  <input
                    className="input"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="Max"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <label className="check">
                <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
                <span>Remote only</span>
              </label>

              <label className="check">
                <input type="checkbox" checked={showSalary} onChange={(e) => setShowSalary(e.target.checked)} />
                <span>Có lương hiển thị</span>
              </label>

              <div className="filter-actions">
                <button className="btn btn-outline" type="button" onClick={applyFilters}>
                  Áp dụng bộ lọc
                </button>
                <button className="btn btn-outline" type="button" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>
          </aside>

          {/* results */}
          <section className="jobs-results">
            <div className="card results-head">
              <div>
                <div className="results-title">Kết quả</div>
                <div className="results-sub">{total} jobs found</div>
              </div>

              <div className="sort">
                <span>Sort:</span>
                <select
                  className="input sort-select"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                </select>
              </div>
            </div>

            <div className="jobs-list">
              {paged.map((j) => (
                <div key={j.id} className="card job-item">
                  <div className="job-top">
                    <div>
                      <div className="job-title">{j.title}</div>
                      <div className="job-meta">
                        <div>{j.company}</div>
                        <div>
                          {j.location} • {j.type} • {j.level}
                          {showSalary ? ` • ${j.salary}` : " • (Đăng nhập để xem mức lương)"}
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-outline job-view" type="button">
                      View
                    </button>
                  </div>

                  <div className="job-tags">
                    {j.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>

                  <div className="job-time">{j.posted}</div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} type="button">
                &lt;
              </button>

              {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    className={`page-btn ${p === currentPage ? "active" : ""}`}
                    onClick={() => setPage(p)}
                    type="button"
                  >
                    {p}
                  </button>
                );
              })}

              <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} type="button">
                &gt;
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
