package com.team02.backend.service;

import com.team02.backend.dto.response.RecommendedJobResponse;
import com.team02.backend.entity.JobPosting;
import com.team02.backend.entity.JobSkill;
import com.team02.backend.entity.Skill;
import com.team02.backend.entity.UserProfile;
import com.team02.backend.entity.UserProfileSkill;
import com.team02.backend.entity.Users;
import com.team02.backend.enums.JobLevel;
import com.team02.backend.exception.ResourceNotFoundException;
import com.team02.backend.repository.JobPostingRepository;
import com.team02.backend.repository.UserProfileRepository;
import com.team02.backend.repository.UserProfileSkillRepository;
import com.team02.backend.repository.UserRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RecommendationService {

  UserRepository userRepository;
  UserProfileRepository userProfileRepository;
  UserProfileSkillRepository profileSkillRepository;
  JobPostingRepository postingRepository;

  private static final double SKILL_WEIGHT = 0.55;
  private static final double LEVEL_WEIGHT = 0.20;
  private static final double CAREER_GOAL_WEIGHT = 0.15;
  private static final double CITY_WEIGHT = 0.10;

  private record SkillScoreResult(
      double score,
      List<String> matchedSkills,
      List<String> missingSkills) {
  }

  private SkillScoreResult calculateScore(
      JobPosting jobPosting,
      Map<Long, Integer> candidateSkillMap) {
    List<JobSkill> jobSkills = jobPosting.getJobSkills();

    if (jobSkills == null || jobSkills.isEmpty()) {
      return new SkillScoreResult(0, List.of(), List.of());
    }

    double sumContribution = 0;
    List<String> matchedSkills = new ArrayList<>();
    List<String> missingSkills = new ArrayList<>();

    for (JobSkill js : jobSkills) {
      Skill skill = js.getSkill();
      Integer level = candidateSkillMap.get(skill.getSkillId());

      if (level != null && level > 0) {
        sumContribution += Math.min(level, 5) / 5.0;
        matchedSkills.add(skill.getName());
      } else {
        missingSkills.add(skill.getName());
      }
    }

    double rawRatio = sumContribution / jobSkills.size();
    double skillScore = rawRatio * 100;

    return new SkillScoreResult(skillScore, matchedSkills, missingSkills);
  }

  private double calculateLevelScore(String candidateLevelStr, JobLevel jobLevel) {

    int candidateLevel = mapCandidateLevel(candidateLevelStr);
    int jobLevelValue = mapJobLevel(jobLevel);

    int diff = Math.abs(candidateLevel - jobLevelValue);
    return Math.max(0, 100 - diff * 30);
  }

  private int mapCandidateLevel(String level) {
    if (level == null)
      return 1;

    return switch (level.trim().toLowerCase()) {
      case "junior" -> 2;
      case "middle" -> 3;
      case "senior" -> 4;
      default -> 1;
    };
  }

  private int mapJobLevel(JobLevel level) {
    if (level == null)
      return 1;

    return switch (level) {
      case JUNIOR -> 2;
      case MIDDLE -> 3;
      case SENIOR -> 4;
    };
  }

  private double calculateCareerGoalScore(String careerGoal, String jobTitle) {

    if (careerGoal == null || careerGoal.isBlank() || jobTitle == null) {
      return 0;
    }

    String normalizedGoal = normalizeText(careerGoal);
    String normalizedTitle = normalizeText(jobTitle);

    String[] keywords = normalizedGoal.split("\\s+");
    long matchedCount = Arrays.stream(keywords)
        .filter(k -> !k.isBlank() && normalizedTitle.contains(k))
        .count();

    return (double) matchedCount / keywords.length * 100;
  }

  private String normalizeText(String text) {
    return text.toLowerCase()
        .replaceAll("[^a-z0-9 ]", " ")
        .trim();
  }

  private double calculateCityScore(String candidateCity, String jobLocation) {

    if (candidateCity == null || candidateCity.isBlank()) {
      return 0;
    }

    if (jobLocation == null || jobLocation.isBlank()) {
      return 0;
    }

    String cCity = normalizeText(candidateCity);
    String jCity = normalizeText(jobLocation);

    if (cCity.equals("remote") || jCity.equals("remote")) {
      return 100;
    }

    if (cCity.equals(jCity)) {
      return 100;
    }

    if (cCity.contains(jCity) || jCity.contains(cCity)) {
      return 60;
    }

    return 0;
  }

  private RecommendedJobResponse toResponse(JobScoreHolder holder) {

    JobPosting job = holder.getJob();

    return RecommendedJobResponse.builder()
        .jobPostingId(job.getJobPostingId())
        .title(job.getTitle())
        .companyName(job.getCompanyName())
        .location(job.getLocation())
        .jobType(job.getJobType())
        .jobLevel(job.getJobLevel())
        .salaryMin(job.getSalaryMin())
        .salaryMax(job.getSalaryMax())
        .jobUrl(job.getJobUrl())
        .matchScore(round(holder.getFinalScore()))
        .skillScore(round(holder.getSkillScore()))
        .levelScore(round(holder.getLevelScore()))
        .careerGoalScore(round(holder.getCareerGoalScore()))
        .cityScore(round(holder.getCityScore()))
        .matchedSkills(holder.getMatchedSkills())
        .missingSkills(holder.getMissingSkills())
        .build();
  }

  private double round(double value) {
    return Math.round(value * 10.0) / 10.0;
  }

  public List<RecommendedJobResponse> getRecommendedJobResponses(Long userId, int topN) {

    Users users = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

    UserProfile userProfile = userProfileRepository.findByUsers(users).orElseThrow(
        () -> new ResourceNotFoundException("User profile not found"));

    List<UserProfileSkill> userProfileSkills = profileSkillRepository
        .findByUserProfile_UserProfileId(userProfile.getUserProfileId());

    Map<Long, Integer> candidateSkillMap = userProfileSkills.stream()
        .collect(Collectors.toMap(
            ups -> ups.getSkill().getSkillId(),
            UserProfileSkill::getLevel));

    List<JobPosting> jobs = postingRepository.findAllWithSkills();

    if (jobs.isEmpty()) {
      return Collections.emptyList();
    }

    List<JobScoreHolder> scoredJobs = jobs.stream()
        .map(job -> calculateJobScore(job, userProfile, candidateSkillMap))
        .sorted(Comparator.comparingDouble(JobScoreHolder::getFinalScore).reversed())
        .limit(topN)
        .toList();

    return scoredJobs.stream()
        .map(this::toResponse)
        .toList();
  }

  private JobScoreHolder calculateJobScore(
      JobPosting job,
      UserProfile profile,
      Map<Long, Integer> candidateSkillMap) {

    SkillScoreResult skillResult = calculateScore(job, candidateSkillMap);
    double levelScore = calculateLevelScore(profile.getCurrentLevel(), job.getJobLevel());
    double careerGoalScore = calculateCareerGoalScore(profile.getCareerGoal(), job.getTitle());
    double cityScore = calculateCityScore(profile.getCity(), job.getLocation());

    double finalScore = skillResult.score() * SKILL_WEIGHT +
        levelScore * LEVEL_WEIGHT +
        careerGoalScore * CAREER_GOAL_WEIGHT +
        cityScore * CITY_WEIGHT;

    return new JobScoreHolder(
        job,
        finalScore,
        skillResult.score(),
        levelScore,
        careerGoalScore,
        cityScore,
        skillResult.matchedSkills(),
        skillResult.missingSkills());
  }
}
