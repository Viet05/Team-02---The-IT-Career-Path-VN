package com.team02.backend.entity;

import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import jdk.jfr.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Users implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "users_id")
  private Long userId;

  @Column(name = "username")
  private String username;

  @Column(name = "email")
  private String email;

  @Column(name = "password")
  private String password;

  @Column(name = "role")
  @Enumerated(EnumType.STRING)
  private UserRole role;

  @Column(name = "status")
  @Enumerated(EnumType.STRING)
  private UserStatus status;

  @OneToOne(mappedBy = "usersId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private UserProfile userProfile;

  @OneToMany(mappedBy = "usersId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserRoleProgress> userRoleProgressList;

  @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserFavoriteJob> userFavoriteJobList;

  @Timestamp
  private LocalDateTime createdAt;

  @Timestamp
  private LocalDateTime updatedAt;
}
