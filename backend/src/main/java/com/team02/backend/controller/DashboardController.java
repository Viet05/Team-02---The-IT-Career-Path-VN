package com.team02.backend.controller;

import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.ChartDataResponse;
import com.team02.backend.dto.response.DashboardStatsResponse;
import com.team02.backend.service.DashboardService;
import java.util.logging.Level;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/it-path/admin/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

  DashboardService dashboardService;

  @GetMapping("/get-stats")
  public ApiResponse<DashboardStatsResponse> getDashboardStats() {

    return ApiResponse.<DashboardStatsResponse>builder()
        .code(200)
        .message("Get data successfully")
        .data(dashboardService.getDashboardStats())
        .build();
  }

  @GetMapping("/get-chart")
  public ApiResponse<ChartDataResponse> getChartData() {

    return ApiResponse.<ChartDataResponse>builder()
        .code(200)
        .message("Get chart successfully")
        .data(dashboardService.getChartData())
        .build();
  }
}
