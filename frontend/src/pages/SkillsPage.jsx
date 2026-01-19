import React, { useState } from "react";
import { useUserState } from "../store/useLocalStorage";
import { getRoadmapById } from "../data/mockRoadmaps";
import Card from "../components/Card";
import Pill from "../components/Pill";
import EmptyState from "../components/EmptyState";
import "../styles/skills-page.css";

export default function SkillsPage() {
  const { user, selectedRoadmap } = useUserState();
  const roadmap = selectedRoadmap ? getRoadmapById(selectedRoadmap) : null;

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

  const roadmapSkills = roadmap ? roadmap.skills : [];
  const allSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Angular",
    "Node.js",
    "Express",
    "Python",
    "Java",
    "Spring",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "Git",
    "REST API",
    "GraphQL",
    "Next.js",
    "Redux",
    "Tailwind CSS",
  ];

  return (
    <div className="skills-page">
      <div className="skills-container">
        <div className="page-header">
          <div>
            <h1>My Skills</h1>
            <p>Track your skills and see what you need to learn</p>
          </div>
        </div>

        {roadmap && (
          <Card className="roadmap-skills-card">
            <h2>Skills from {roadmap.title}</h2>
            <div className="skills-grid">
              {roadmapSkills.map((skill) => (
                <Pill key={skill} variant="primary">
                  {skill}
                </Pill>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <h2>All Skills</h2>
          <p className="skills-description">
            These are common skills in IT. Mark the ones you want to learn or already know.
          </p>
          <div className="skills-grid">
            {allSkills.map((skill) => {
              const isInRoadmap = roadmapSkills.includes(skill);
              return (
                <Pill
                  key={skill}
                  variant={isInRoadmap ? "primary" : "default"}
                  className={isInRoadmap ? "roadmap-skill" : ""}
                >
                  {skill}
                </Pill>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
