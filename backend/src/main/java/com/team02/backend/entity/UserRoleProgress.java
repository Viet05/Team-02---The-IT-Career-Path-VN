package com.team02.backend.entity;

import com.team02.backend.enums.ProgressStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "user_role_progress",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"users_id", "roadmap_node_id"})
    })
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRoleProgress implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_role_progress_id")
  private Long userRoleProgressId;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private ProgressStatus status;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "users_id", nullable = false)
  private Users usersId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "roadmap_node_id", nullable = false)
  private RoadmapNode roadmapNode;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
