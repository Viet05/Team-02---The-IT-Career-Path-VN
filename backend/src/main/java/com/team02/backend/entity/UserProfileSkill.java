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
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_profile_skill", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "user_profile_id", "skill_id" })
})
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileSkill implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_profile_skill_id")
  private Long userProfileSkillId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_profile_id", nullable = false)
  private UserProfile userProfile;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "skill_id", nullable = false)
  private Skill skill;

  @Column(name = "level")
  private Integer level;
}
