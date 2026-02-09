package com.team02.backend.entity;

import com.team02.backend.enums.JobLevel;
import com.team02.backend.enums.JobType;
import jakarta.persistence.*;

import java.io.Serializable;
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
public class JobPosting implements Serializable {

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
  private Double  salaryMin;

  @Column(name = "salary_max")
  private Double  salaryMax;

  @Column(name = "description")
  private String description;

  @Column(name = "job_url")
  private String jobUrl;

  @Column(name = "job_type")
  @Enumerated(EnumType.STRING)
  private JobType jobType;

  @Column(name = "job_level")
  @Enumerated(EnumType.STRING)
  private JobLevel jobLevel;

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
