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
@Table(name = "job_skill", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"skill_id", "job_posting_skill"})
})
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobSkill {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "job_skill_id")
  private Long jobSkillId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "skill_id",nullable = false)
  private Skill skill;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "job_posting_id", nullable = false)
  private JobPosting jobPosting;
}
