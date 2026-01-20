package com.team02.backend.service;

import com.team02.backend.dto.response.ChartDataResponse;
import com.team02.backend.dto.response.DashboardStatsResponse;
import com.team02.backend.enums.UserRole;
import com.team02.backend.repository.JobPostingRepository;
import com.team02.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardService {

  UserRepository userRepository;
  JobPostingRepository postingRepository;

  public DashboardStatsResponse getDashboardStats() {

    Long totalUsers = userRepository.count();
    Long totalStudents = userRepository.countByRole(UserRole.STUDENT);
    Long totalJobs = postingRepository.count();

    LocalDateTime startOfDay = LocalDateTime.now().with(LocalDateTime.MIN);

    Long jobsToday = postingRepository.countByPostedAtAfter(startOfDay);

    return DashboardStatsResponse.builder()
        .totalUser(totalUsers)
        .totalStudent(totalStudents)
        .totalJobs(totalJobs)
        .jobsToday(jobsToday)
        .build();
  }

  public ChartDataResponse getChartData() {

    LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
    List<Object[]>  usersStat = userRepository.countUsersByCreatedDate(sevenDaysAgo);
    List<Object[]> jobsStat = postingRepository.countJobsByDate(sevenDaysAgo);

    Map<String, Long> userMap = usersStat.stream().collect(Collectors.toMap(
        row -> row[0].toString(),
        row -> ((Number) row[1]).longValue()
    ));

    Map<String, Long> jobMap = jobsStat.stream().collect(
        Collectors.toMap(
            row -> row[0].toString(),
            row -> ((Number) row[1]).longValue()
        )
    );

    List<String> labels = new ArrayList<>();
    List<Long> usersData = new ArrayList<>();
    List<Long> jobsData = new ArrayList<>();

    LocalDateTime current = LocalDateTime.now().minusDays(6);
    LocalDateTime today = LocalDateTime.now();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    while (!current.isBefore(today)) {
      String dateStr = current.format(formatter);
      labels.add(current.getDayOfWeek().name().substring(0, 3));

      usersData.add(userMap.getOrDefault(dateStr, 0L));
      jobsData.add(jobMap.getOrDefault(dateStr, 0L));
      current = current.plusDays(1);
    }

    return ChartDataResponse.builder()
        .label(labels)
        .activeUsers(usersData)
        .jobsCreated(jobsData)
        .build();
  }
}

