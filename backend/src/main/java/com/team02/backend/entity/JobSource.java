package com.team02.backend.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "job_source")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobSource {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "job_source_id")
  private Long jobSourceId;

  @Column(name = "name")
  private String name;

  @Column(name = "api_url")
  private String apiUrl;

  @OneToMany(mappedBy = "jobSource", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<JobPosting> jobs;
}
