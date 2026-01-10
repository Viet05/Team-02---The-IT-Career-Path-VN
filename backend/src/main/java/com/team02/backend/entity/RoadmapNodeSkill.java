package com.team02.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roadmap_node_skill", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"roadmap_node_id", "skill_id"})
})
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoadmapNodeSkill {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "roadmap_node_skill_id")
  private Long roadmapNodeSkillId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "roadmap_node_id", nullable = false)
  private RoadmapNode roadmapNode;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "skill_id", nullable = false)
  private Skill skill;
}
