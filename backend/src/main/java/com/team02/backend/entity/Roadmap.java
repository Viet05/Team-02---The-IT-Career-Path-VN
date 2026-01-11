package com.team02.backend.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roadmap")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Roadmap implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "roadmap_id")
  private Long roadmapId;

  @Column(name = "title")
  private String title;

  @Column(name = "description")
  private String description;

  @Column(name = "level")
  private String level;

  @OneToMany(mappedBy = "roadmap", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<RoadmapNode> roadmapNodes;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "career_role_id", nullable = false)
  private CareerRole careerRole;
}
