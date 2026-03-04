import React, { useState, useEffect } from "react";
import { useUserState } from "../store/useLocalStorage";
import { getAllSkills, getUserSkills, addUserSkill, deleteUserSkill } from "../services/skillService";
import EmptyState from "../components/EmptyState";
import "../styles/skills-page.css";

const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const LEVEL_META = {
  BEGINNER: { label: "Beginner", color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "🌱" },
  INTERMEDIATE: { label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "⚡" },
  ADVANCED: { label: "Advanced", color: "#6366f1", bg: "rgba(99,102,241,0.12)", icon: "🔥" },
  1: { label: "Beginner", color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "🌱" },
  2: { label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "⚡" },
  3: { label: "Advanced", color: "#6366f1", bg: "rgba(99,102,241,0.12)", icon: "🔥" },
};

export default function SkillsPage() {
  const { user } = useUserState();
  const [userSkills, setUserSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("BEGINNER");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allData, userSkillData] = await Promise.allSettled([
          getAllSkills(),
          getUserSkills(),
        ]);
        if (allData.status === "fulfilled")
          setAllSkills(Array.isArray(allData.value) ? allData.value : []);
        if (userSkillData.status === "fulfilled")
          setUserSkills(Array.isArray(userSkillData.value) ? userSkillData.value : []);
      } catch (err) {
        console.error("Failed to load skills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleAddSkill = async (skill) => {
    setAdding(skill.id);
    try {
      const newSkill = await addUserSkill(skill.id, selectedLevel);
      setUserSkills((prev) => [...prev, newSkill]);
    } catch (err) {
      console.error("Failed to add skill:", err);
    } finally {
      setAdding(null);
    }
  };

  const handleDeleteSkill = async (userSkill) => {
    setDeleting(userSkill.userProfileSkillId);
    try {
      await deleteUserSkill(userSkill.userProfileSkillId);
      setUserSkills((prev) =>
        prev.filter((s) => s.userProfileSkillId !== userSkill.userProfileSkillId)
      );
    } catch (err) {
      console.error("Failed to delete skill:", err);
    } finally {
      setDeleting(null);
    }
  };

  if (!user) {
    return (
      <div className="skills-page">
        <EmptyState icon="👤" title="Please log in" message="You need to be logged in to manage your skills" />
      </div>
    );
  }

  const userSkillIds = new Set(userSkills.map((s) => s.skillId));
  const filteredSkills = allSkills.filter(
    (s) => !userSkillIds.has(s.id) && s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="skills-page">
      <div className="skills-container">

        {/* ── Header ── */}
        <div className="skills-header">
          <div className="skills-header-text">
            <h1>My Skills</h1>
            <p>Track your skills and showcase your expertise to employers</p>
          </div>
          <div className="skills-stats">
            <div className="stat-badge">
              <span className="stat-num">{userSkills.length}</span>
              <span className="stat-label">Total Skills</span>
            </div>
          </div>
        </div>

        {/* ── My Skills ── */}
        <section className="skills-section">
          <div className="section-title-row">
            <h2 className="section-title">
              <span className="section-icon">✦</span>
              Current Skills
            </h2>
          </div>

          {loading ? (
            <div className="skills-loading">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skill-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          ) : userSkills.length === 0 ? (
            <div className="skills-empty">
              <span className="skills-empty-icon">🎯</span>
              <p>No skills added yet. Browse the catalog below to get started!</p>
            </div>
          ) : (
            <div className="user-skills-grid">
              {userSkills.map((skill) => {
                const meta = LEVEL_META[skill.level] || LEVEL_META["BEGINNER"];
                return (
                  <div key={skill.userProfileSkillId} className="user-skill-card">
                    <div className="skill-card-inner">
                      <div className="skill-name">{skill.name}</div>
                      <div
                        className="skill-level-badge"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        {meta.icon} {meta.label}
                      </div>
                    </div>
                    <button
                      className="skill-remove-btn"
                      onClick={() => handleDeleteSkill(skill)}
                      disabled={deleting === skill.userProfileSkillId}
                      title="Remove skill"
                      aria-label={`Remove ${skill.name}`}
                    >
                      {deleting === skill.userProfileSkillId ? (
                        <span className="removing-spinner" />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Add Skills Catalog ── */}
        <section className="skills-section">
          <div className="section-title-row">
            <h2 className="section-title">
              <span className="section-icon">＋</span>
              Add from Catalog
            </h2>
          </div>

          <div className="catalog-controls">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="level-selector">
              <span className="level-label-text">Add as:</span>
              {SKILL_LEVELS.map((l) => {
                const m = LEVEL_META[l];
                return (
                  <button
                    key={l}
                    onClick={() => setSelectedLevel(l)}
                    className={`level-pill ${selectedLevel === l ? "level-pill--active" : ""}`}
                    style={
                      selectedLevel === l
                        ? { color: m.color, background: m.bg, borderColor: m.color }
                        : {}
                    }
                  >
                    {m.icon} {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="skills-loading">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skill-skeleton" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="skills-empty">
              <span className="skills-empty-icon">🔍</span>
              <p>{search ? `No skills matching "${search}"` : "All available skills have been added!"}</p>
            </div>
          ) : (
            <div className="catalog-skills-grid">
              {filteredSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => handleAddSkill(skill)}
                  disabled={adding === skill.id}
                  className={`catalog-skill-chip ${adding === skill.id ? "catalog-skill-chip--adding" : ""}`}
                  title={`Add ${skill.name} at ${selectedLevel} level`}
                >
                  <span className="chip-name">{skill.name}</span>
                  <span className="chip-add-icon">
                    {adding === skill.id ? (
                      <span className="adding-spinner" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
