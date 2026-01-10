import React from "react";
import { Link } from "react-router-dom";
import "../styles/about.css";

const team = [
  {
    name: "Nguyễn Văn A",
    role: "Lead Developer",
    bio: "Mình là A, đam mê Web Performance, phụ trách kiến trúc dự án & code frontend chính.",
    avatar: "/team/a.jpg",
    links: {
      github: "https://github.com/your-github-a",
      linkedin: "https://linkedin.com/in/your-linkedin-a",
      facebook: "https://facebook.com/your-facebook-a",
    },
  },
  {
    name: "Trần Thị B",
    role: "UI/UX Designer",
    bio: "Mình là B, thích thiết kế tối giản, phụ trách UI kit, flow và trải nghiệm người dùng.",
    avatar: "/team/b.jpg",
    links: {
      github: "https://github.com/your-github-b",
      linkedin: "https://linkedin.com/in/your-linkedin-b",
      facebook: "https://facebook.com/your-facebook-b",
    },
  },
  {
    name: "Lê Văn C",
    role: "Content Researcher",
    bio: "Mình là C, quan tâm lộ trình học tập, phụ trách chọn lọc tài liệu và viết nội dung roadmap.",
    avatar: "/team/c.jpg",
    links: {
      github: "https://github.com/your-github-c",
      linkedin: "https://linkedin.com/in/your-linkedin-c",
      facebook: "https://facebook.com/your-facebook-c",
    },
  },
  {
    name: "Phạm Thị D",
    role: "Backend Developer",
    bio: "Mình là D, thích hệ thống và API, phụ trách backend, database và triển khai.",
    avatar: "/team/d.jpg",
    links: {
      github: "https://github.com/your-github-d",
      linkedin: "https://linkedin.com/in/your-linkedin-d",
      facebook: "https://facebook.com/your-facebook-d",
    },
  },
];

const values = [
  { title: "Cập nhật", desc: "Nội dung bám sát nhu cầu ngành và xu hướng thực tế." },
  { title: "Cộng đồng", desc: "Chia sẻ kiến thức, hỗ trợ nhau học tập và làm project." },
  { title: "Dễ hiểu", desc: "Trực quan, ít “hàn lâm”, ưu tiên ví dụ và thực hành." },
  { title: "Chất lượng", desc: "Chọn lọc tài liệu tốt, tránh rác thông tin." },
];

const journey = [
  { time: "MM/YYYY", title: "Ý tưởng ra đời", desc: "Nhóm nhận ra nhiều bạn bị “ngợp” khi tự học IT và cần một roadmap tinh gọn." },
  { time: "MM/YYYY", title: "Prototype", desc: "Xây khung roadmap, trang tài liệu, và định hình trải nghiệm người dùng." },
  { time: "MM/YYYY", title: "Vượt khó", desc: "Đồng bộ lịch, thống nhất UI, chuẩn hóa nội dung và hệ thống hóa tài liệu." },
  { time: "Hiện tại", title: "Beta / v1.0", desc: "Hoàn thiện roadmap, mở góp ý và cập nhật đều đặn theo phản hồi cộng đồng." },
];

function SocialLinks({ links }) {
  const items = [
    { label: "GitHub", href: links.github },
    { label: "LinkedIn", href: links.linkedin },
    { label: "Facebook", href: links.facebook },
  ].filter((x) => !!x.href);

  return (
    <div className="about-links">
      {items.map((it) => (
        <a key={it.label} className="about-link" href={it.href} target="_blank" rel="noreferrer">
          {it.label}
        </a>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-container">
        {/* HERO */}
        <section className="about-hero">
          <div className="about-badge">About • Our Mission • Our Team</div>

          <h1 className="about-title">Từ sinh viên IT, dành cho sinh viên IT.</h1>

          <p className="about-desc">
            Sinh viên IT thường bị “ngợp” giữa quá nhiều công nghệ và lộ trình. Tụi mình xây web này để giúp bạn học đúng
            thứ cần học, theo roadmap rõ ràng và nguồn tài liệu chất lượng.
          </p>

          <div className="about-actions">
            <Link to="/roadmap" className="btn btn-primary">Xem Roadmap</Link>
            <Link to="/jobs" className="btn btn-outline">Tham gia cộng đồng</Link>
          </div>
        </section>

        {/* MISSION */}
        <section className="about-section">
          <div className="about-head">
            <div>
              <h2>Mục tiêu & Sứ mệnh</h2>
              <p className="sub">Our Mission</p>
            </div>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <h3>Vấn đề</h3>
              <p>
                Sinh viên IT dễ lạc lối giữa hàng tá roadmap, khóa học, framework, tutorial… Học nhiều nhưng thiếu hệ
                thống, khó biết “bắt đầu từ đâu” và “học tới đâu là đủ”.
              </p>
            </div>
            <div className="card">
              <h3>Giải pháp</h3>
              <p>
                Cung cấp roadmap tinh gọn theo mục tiêu (Web/Backend/Mobile/AI…), kèm tài liệu chọn lọc, ví dụ thực hành và
                gợi ý dự án để bạn học nhanh – đúng – áp dụng được.
              </p>
            </div>
            <div className="card">
              <h3>Thông điệp</h3>
              <p>
                <b>Từ sinh viên IT, dành cho sinh viên IT.</b> Làm đơn giản, thực tế và luôn lắng nghe cộng đồng để cải thiện.
              </p>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="about-section">
          <div className="about-head">
            <div>
              <h2>Giá trị cốt lõi</h2>
              <p className="sub">Core Values</p>
            </div>
          </div>

          <div className="grid grid-4">
            {values.map((v) => (
              <div key={v.title} className="card">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="about-section">
          <div className="about-head">
            <div>
              <h2>Đội ngũ phát triển</h2>
              <p className="sub">Meet the Team</p>
            </div>
          </div>

          <div className="grid grid-4">
            {team.map((m) => (
              <div key={m.name} className="card team-card">
                <div className="team-top">
                  {/* alt để trống để tránh trường hợp ảnh lỗi hiện chữ tên "đè" lên */}
                  <img
                    className="team-avatar"
                    src={m.avatar}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = "/team/default.jpg";
                    }}
                  />
                  <div>
                    <div className="team-name">{m.name}</div>
                    <div className="team-role">{m.role}</div>
                  </div>
                </div>

                <p className="team-bio">{m.bio}</p>
                <SocialLinks links={m.links} />
              </div>
            ))}
          </div>
        </section>

        {/* JOURNEY */}
        <section className="about-section">
          <div className="about-head">
            <div>
              <h2>Quá trình phát triển</h2>
              <p className="sub">Our Journey</p>
            </div>
          </div>

          <div className="timeline">
            {journey.map((j, idx) => (
              <div key={j.title} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div className="timeline-top">
                    <span className="pill">{j.time}</span>
                    <h3>{idx + 1}. {j.title}</h3>
                  </div>
                  <p>{j.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div>
            <h2>Sẵn sàng bắt đầu?</h2>
            <p>Chọn một roadmap phù hợp và học theo từng bước — tụi mình đã lọc sẵn phần quan trọng nhất.</p>
          </div>

          <div className="about-actions">
            <Link to="/roadmap" className="btn btn-light">Bắt đầu với Roadmap</Link>
            <Link to="/" className="btn btn-ghost">Liên hệ / Góp ý</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
