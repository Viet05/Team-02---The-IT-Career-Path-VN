import React from "react";
import "../styles/home.css";

const roles = ["Frontend", "Backend", "Full Stack", "DevOps", "Data", "Security"];

const jobs = [
  {
    time: "Đăng 52 phút trước",
    hot: "HOT",
    title: "Bridge Engineer cum Project Manager (Japanese N2) | $3k",
    company: "Hybrid Technologies",
    location: "Hà Nội",
    workType: "Tại văn phòng",
    tags: ["Project Management", "Java", "Scrum", "Agile", "Japanese", "+1"],
  },
  {
    time: "Đăng 52 phút trước",
    hot: "HOT",
    title: "Bridge Software Engineer (BrSE, PO, Japanese)",
    company: "IT Việt Nam",
    location: "Hà Nội",
    workType: "Tại văn phòng",
    tags: ["Bridge Engineer", "Product Owner", "Project Management", "+2"],
  },
];

function JobCard({ job }) {
  return (
    <div className="job-card">
      <div className="job-top">
        <span className="job-time">{job.time}</span>
        <span className="job-badge">{job.hot}</span>
      </div>

      <div className="job-title">{job.title}</div>

      <div className="job-row">
        <span className="job-dot" />
        <span className="job-company">{job.company}</span>
      </div>

      <div className="job-row job-muted">
        <span className="job-ico">⊕</span>
        <span>Đăng nhập để xem mức lương</span>
      </div>

      <div className="job-row job-muted">
        <span className="job-ico">📌</span>
        <span>{job.workType}</span>
        <span className="job-sep">•</span>
        <span>{job.location}</span>
      </div>

      <div className="job-tags">
        {job.tags.map((t) => (
          <span key={t} className="job-tag">{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home73">
      <main className="home73-grid">
        {/* 7 phần (trái): role như cũ */}
        <section className="left">
          <div className="box">
            <div className="box-title">Giới thiệu trang</div>
            <p className="box-text">
              Mô tả ngắn: roadmap + tích tiến độ + tìm/lọc job + gợi ý job.
            </p>
          </div>

          <div className="box role-box">
            <div className="box-title">Role map</div>
            <div className="role-grid">
              {roles.map((r) => (
                <button key={r} className="role-btn" type="button">
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="box">
            <div className="box-title">Skill</div>
            <div className="chip-row">
              {["Git","HTML/CSS","JavaScript","React","Java","Spring","MySQL","Docker","Linux","REST"].map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 3 phần (phải): jobs nhỏ */}
        <aside className="right">
          <div className="box">
            <div className="box-title">Jobs gợi ý</div>
            <div className="job-list">
              {jobs.map((j) => (
                <JobCard key={j.title} job={j} />
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
