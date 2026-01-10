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
import jakarta.validation.constraints.DecimalMin;
import java.time.LocalDateTime;
import java.util.List;
import jdk.jfr.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "job_posting")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobPosting {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "job_posting_id")
  private Long jobPostingId;

  @Column(name = "external_job_id")
  private String externalJobId;

  @Column(name = "title")
  private String title;

  @Column(name = "company_name")
  private String companyName;

  @Column(name = "location")
  private String location;

  @Column(name = "salary_min")
  private double  salaryMin;

  @Column(name = "salary_max")
  private double  salaryMax;

  @Column(name = "description")
  private String description;

  @Column(name = "job_url")
  private String jobUrl;

  @Timestamp
  private LocalDateTime postedAt;

  @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<JobSkill> jobSkills;

  @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserFavoriteJob> userFavoriteJobs;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "job_source_id", nullable = false)
  private JobSource jobSource;
}
