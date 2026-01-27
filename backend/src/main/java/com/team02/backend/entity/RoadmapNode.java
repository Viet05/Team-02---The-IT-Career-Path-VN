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
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roadmap_node")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoadmapNode implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "roadmap_node_id")
  private Long roadmapNodeId;

  @Column(name = "title")
  private String title;

  @Column(name = "description")
  private String description;

  @Column(name = "node_type")
  private String nodeType;

  @Column(name = "order_index")
  private int orderIndex;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_node_id")
  private RoadmapNode parentNode;

  @OneToMany(mappedBy = "parentNode", fetch = FetchType.LAZY)
  private List<RoadmapNode> children = new ArrayList<>();

  @OneToMany(mappedBy = "roadmapNode", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserRoleProgress> userRoleProgressList;

  @OneToMany(mappedBy = "roadmapNode", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<LearningResource> learningResourceList;

  @OneToMany(mappedBy = "roadmapNode", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<RoadmapNodeSkill> roadmapNodeSkillList;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "roadmap_id", nullable = false)
  private Roadmap roadmap;
}
