import React, { useState, useEffect } from "react";
import { useUserState } from "../store/useLocalStorage";
import { getAllSkills, getUserSkills, addUserSkill, deleteUserSkill } from "../services/skillService";
import Card from "../components/Card";
import Pill from "../components/Pill";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import "../styles/skills-page.css";

const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function SkillsPage() {
  const { user } = useUserState();
  const [userSkills, setUserSkills] = useState([]);    // Skills user đã có
  const [allSkills, setAllSkills] = useState([]);      // Tất cả skills trong hệ thống
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);          // ID skill đang thêm
  const [selectedLevel, setSelectedLevel] = useState("BEGINNER");

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allData, userSkillData] = await Promise.allSettled([
          getAllSkills(),
          getUserSkills(),
        ]);
        if (allData.status === "fulfilled") {
          setAllSkills(Array.isArray(allData.value) ? allData.value : []);
        }
        if (userSkillData.status === "fulfilled") {
          setUserSkills(Array.isArray(userSkillData.value) ? userSkillData.value : []);
        }
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
    try {
      await deleteUserSkill(userSkill.id);
      setUserSkills((prev) => prev.filter((s) => s.id !== userSkill.id));
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  if (!user) {
    return (
      <div className="skills-page">
        <Card>
          <EmptyState
            icon="👤"
            title="Please log in"
            message="You need to be logged in to manage your skills"
          />
        </Card>
      </div>
    );
  }

  // Set of skill IDs user đã có để check nhanh
  const userSkillIds = new Set(userSkills.map((s) => s.skillId || s.skill?.id));

  return (
    <div className="skills-page">
      <div className="skills-container">
        <div className="page-header">
          <div>
            <h1>My Skills</h1>
            <p>Track your skills and see what you need to learn</p>
          </div>
        </div>

        {/* My Current Skills */}
        <Card className="roadmap-skills-card">
          <h2>My Skills ({userSkills.length})</h2>
          {loading ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Đang tải...</p>
          ) : userSkills.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Bạn chưa thêm kỹ năng nào. Hãy thêm từ danh sách bên dưới.</p>
          ) : (
            <div className="skills-grid">
              {userSkills.map((skill) => (
                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill variant="primary">
                    {skill.skillName || skill.skill?.skillName || skill.name}
                    {skill.level && ` · ${skill.level}`}
                  </Pill>
                  <button
                    onClick={() => handleDeleteSkill(skill)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error, #ef4444)', fontSize: '14px' }}
                    title="Remove skill"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Add Skills from Catalog */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2>Add Skills from Catalog</h2>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
            >
              {SKILL_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <p className="skills-description">
            Click + to add a skill at the selected level.
          </p>
          {loading ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>Đang tải danh sách kỹ năng...</p>
          ) : (
            <div className="skills-grid">
              {allSkills.map((skill) => {
                const isAdded = userSkillIds.has(skill.id);
                return (
                  <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Pill variant={isAdded ? "primary" : "default"}>
                      {skill.skillName || skill.name}
                    </Pill>
                    {!isAdded && (
                      <button
                        onClick={() => handleAddSkill(skill)}
                        disabled={adding === skill.id}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '18px', fontWeight: 'bold' }}
                        title="Add skill"
                      >
                        {adding === skill.id ? "…" : "+"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
