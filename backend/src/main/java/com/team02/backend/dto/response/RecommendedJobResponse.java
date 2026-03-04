package com.team02.backend.dto.response;

import com.team02.backend.enums.JobLevel;
import com.team02.backend.enums.JobType;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendedJobResponse {

  private Long jobPostingId;
  private String title;
  private String companyName;
  private String location;

  private JobType jobType;
  private JobLevel jobLevel;

  private Double salaryMin;
  private Double salaryMax;
  private String jobUrl;


  private Double matchScore;
  private Double skillScore;
  private Double levelScore;
  private Double careerGoalScore;
  private Double cityScore;


  private List<String> matchedSkills;
  private List<String> missingSkills;
}
