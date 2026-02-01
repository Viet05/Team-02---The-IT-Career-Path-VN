package com.team02.backend.controller;

import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.ChartDataResponse;
import com.team02.backend.dto.response.DashboardStatsResponse;
import com.team02.backend.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Dashboard (Admin)", description = "API dashboard thống kê (Chỉ dành cho Admin)")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

  DashboardService dashboardService;

  @GetMapping("/get-stats")
  @Operation(
    summary = "Lấy thống kê dashboard",
    description = "Lấy các số liệu thống kê tổng quan cho dashboard admin"
  )
  public ApiResponse<DashboardStatsResponse> getDashboardStats() {

    return ApiResponse.<DashboardStatsResponse>builder()
        .code(200)
        .message("Get data successfully")
        .data(dashboardService.getDashboardStats())
        .build();
  }

  @GetMapping("/get-chart")
  @Operation(
    summary = "Lấy dữ liệu biểu đồ",
    description = "Lấy dữ liệu để hiển thị các biểu đồ thống kê"
  )
  public ApiResponse<ChartDataResponse> getChartData() {

    return ApiResponse.<ChartDataResponse>builder()
        .code(200)
        .message("Get chart successfully")
        .data(dashboardService.getChartData())
        .build();
  }

  @GetMapping("/get-recent")
  @Operation(
    summary = "Lấy bài đăng gần đây",
    description = "Lấy danh sách các tin tuyển dụng được đăng gần đây"
  )
  public ApiResponse<Object> getRecent() {
    return ApiResponse.<Object>builder()
        .code(200)
        .message("Get recent data successfully")
        .data(dashboardService.getRecentPostings())
        .build();
  }
}
