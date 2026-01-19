import React from "react";
import { Link } from "react-router-dom";
import "../styles/about.css";

const team = [
  {
    name: "Nguyen Van A",
    role: "Lead Developer",
    bio: "I'm A. I'm passionate about web performance and responsible for the project architecture and core frontend development.",
    avatar: "/team/a.jpg",
    links: {
      github: "https://github.com/your-github-a",
      linkedin: "https://linkedin.com/in/your-linkedin-a",
      facebook: "https://facebook.com/your-facebook-a",
    },
  },
  {
    name: "Tran Thi B",
    role: "UI/UX Designer",
    bio: "I'm B. I love minimal design and I take care of the UI kit, user flows, and overall user experience.",
    avatar: "/team/b.jpg",
    links: {
      github: "https://github.com/your-github-b",
      linkedin: "https://linkedin.com/in/your-linkedin-b",
      facebook: "https://facebook.com/your-facebook-b",
    },
  },
  {
    name: "Le Van C",
    role: "Content Researcher",
    bio: "I'm C. I'm interested in learning paths and responsible for curating resources and writing roadmap content.",
    avatar: "/team/c.jpg",
    links: {
      github: "https://github.com/your-github-c",
      linkedin: "https://linkedin.com/in/your-linkedin-c",
      facebook: "https://facebook.com/your-facebook-c",
    },
  },
  {
    name: "Pham Thi D",
    role: "Backend Developer",
    bio: "I'm D. I enjoy building systems and APIs, and I'm responsible for the backend, database, and deployment.",
    avatar: "/team/d.jpg",
    links: {
      github: "https://github.com/your-github-d",
      linkedin: "https://linkedin.com/in/your-linkedin-d",
      facebook: "https://facebook.com/your-facebook-d",
    },
  },
];

const values = [
  { title: "Up-to-date", desc: "Content aligned with real industry needs and trends." },
  { title: "Community", desc: "Share knowledge, support each other, and build projects together." },
  { title: "Easy to follow", desc: "Visual, practical, and focused on examples instead of theory." },
  { title: "Quality", desc: "Carefully curated resources to avoid information noise." },
];

const journey = [
  {
    time: "MM/YYYY",
    title: "The idea was born",
    desc: "We realized many students feel overwhelmed when self-learning IT and need a clear, compact roadmap.",
  },
  {
    time: "MM/YYYY",
    title: "Prototype",
    desc: "We built the initial roadmap structure, resource pages, and shaped the user experience.",
  },
  {
    time: "MM/YYYY",
    title: "Challenges",
    desc: "We synchronized schedules, unified the UI, standardized content, and organized learning materials.",
  },
  {
    time: "Now",
    title: "Beta / v1.0",
    desc: "We’re polishing the roadmaps, opening for feedback, and continuously updating based on the community.",
  },
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

          <h1 className="about-title" style={{ color: "white" }}>
            Built by IT students, for IT students.
          </h1>

          <p className="about-desc">
            IT students often feel overwhelmed by endless technologies and learning paths. We built this website to help
            you learn the right things, follow a clear roadmap, and use high-quality curated resources.
          </p>

          <div className="about-actions">
            <Link to="/roadmaps" className="btn btn-primary">
              Explore Roadmaps
            </Link>
            <Link to="/jobs" className="btn btn-outline">
              Browse Jobs
            </Link>
          </div>
        </section>

        {/* MISSION */}
        <section className="about-section">
          <div className="about-head">
            <div>
              <h2>Mission & Goals</h2>
              <p className="sub">Our Mission</p>
            </div>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <h3>The Problem</h3>
              <p>
                IT students can easily get lost among countless roadmaps, courses, frameworks, and tutorials. Many learn a
                lot but lack structure, and struggle to know “where to start” or “what is enough.”
              </p>
            </div>
            <div className="card">
              <h3>The Solution</h3>
              <p>
                Provide compact roadmaps by goal (Web/Backend/Mobile/AI…), along with curated resources, practical
                examples, and project suggestions so you can learn fast — learn right — and apply it.
              </p>
            </div>
            <div className="card">
              <h3>Our Message</h3>
              <p>
                <b>Built by IT students, for IT students.</b> Keep it simple, practical, and always improve by listening
                to the community.
              </p>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="about-section">
          <div className="about-head">
            <div>
              <h2>Core Values</h2>
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
              <h2>Our Team</h2>
              <p className="sub">Meet the Team</p>
            </div>
          </div>

          <div className="grid grid-4">
            {team.map((m) => (
              <div key={m.name} className="card team-card">
                <div className="team-top">
                  {/* empty alt to avoid showing fallback text over UI if image fails */}
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
              <h2>Our Journey</h2>
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
                    <h3>
                      {idx + 1}. {j.title}
                    </h3>
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
            <h2>Ready to get started?</h2>
            <p>Pick a roadmap and follow step by step — we’ve already curated the most important parts for you.</p>
          </div>

          <div className="about-actions">
            <Link to="/roadmap" className="btn btn-light">
              Start with a Roadmap
            </Link>
            <Link to="/" className="btn btn-ghost">
              Contact / Feedback
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
