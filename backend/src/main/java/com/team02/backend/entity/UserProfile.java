package com.team02.backend.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import jdk.jfr.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_profile")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_profile_id")
  private Long userProfileId;

  @OneToOne
  @JoinColumn(name = "users_id" , nullable = false, unique = true)
  private Users usersId;

  @Column(name = "full_name")
  private String fullName;

  @Column(name = "date_of_birth")
  private LocalDate dateOfBirth;

  @Column(name = "university")
  private String university;

  @Column(name = "major")
  private String major;

  @Column(name = "current_level")
  private String currentLevel;

  @Column(name = "career_goal")
  private String careerGoal;

  @Column(name = "bio")
  private String bio;

  @Column(name = "avatar_url")
  private String avatarUrl;

  @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserProfileSkill> userProfileSkills;

  @Timestamp
  private LocalDateTime createdAt;

  @Timestamp
  private LocalDateTime updatedAt;
}
