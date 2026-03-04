package com.team02.backend.service;

import com.team02.backend.entity.JobPosting;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JobScoreHolder {

  private final JobPosting job;

  private final double finalScore;
  private final double skillScore;
  private final double levelScore;
  private final double careerGoalScore;
  private final double cityScore;

  private final List<String> matchedSkills;
  private final List<String> missingSkills;
}
