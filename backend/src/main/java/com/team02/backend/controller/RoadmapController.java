package com.team02.backend.controller;

import com.team02.backend.dto.request.ExcelFileDto;
import com.team02.backend.dto.request.RoadmapCreateRequest;
import com.team02.backend.dto.request.RoadmapDetailsRequest;
import com.team02.backend.dto.request.RoadmapNodeCreateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.RoadmapDetailsDTO;
import com.team02.backend.dto.response.RoadmapResponse;
import com.team02.backend.service.RoadmapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/it-path/roadmaps")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Roadmaps", description = "API quản lý lộ trình học tập IT")
public class RoadmapController {

  RoadmapService service;

  @GetMapping("/all")
  @Operation(summary = "Lấy danh sách tất cả roadmap", description = "Lấy danh sách tất cả các lộ trình học tập IT")
  public ApiResponse<List<RoadmapResponse>> getRoadmap() {
    return ApiResponse.<List<RoadmapResponse>>builder()
        .code(200)
        .message("Successfully")
        .data(service.getRoadmap())
        .build();
  }

  @GetMapping("/details")
  @Operation(summary = "Lấy chi tiết roadmap", description = "Lấy thông tin chi tiết của một roadmap bao gồm các node và quan hệ")
  public ApiResponse<RoadmapDetailsDTO> getRoadmapDetails(@RequestBody RoadmapDetailsRequest request) {
    return ApiResponse.<RoadmapDetailsDTO>builder()
        .code(200)
        .message("Successfully")
        .data(service.getRoadmapDetails(request))
        .build();

  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "Tạo roadmap mới", description = "Tạo một lộ trình học tập mới (Chỉ Admin)")
  @SecurityRequirement(name = "bearerAuth")
  public ApiResponse<RoadmapResponse> createRoadmap(@RequestBody RoadmapCreateRequest request) {
    return ApiResponse.<RoadmapResponse>builder()
        .code(200)
        .message("Successfully")
        .data(service.createRoadmap(request))
        .build();
  }

  @PostMapping("/node")
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "Tạo node roadmap", description = "Thêm một node (bước học) vào roadmap hiện có (Chỉ Admin)")
  @SecurityRequirement(name = "bearerAuth")
  public ApiResponse<RoadmapResponse> createRoadmapNode(@RequestBody RoadmapNodeCreateRequest request) {
    return ApiResponse.<RoadmapResponse>builder()
        .code(200)
        .message("Successfully")
        .data(service.createRoadmapNode(request))
        .build();
  }

  @PostMapping(value = "/excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  @Operation(summary = "Import roadmap từ Excel", description = "Import dữ liệu roadmap từ file Excel (Chỉ Admin)")
  @SecurityRequirement(name = "bearerAuth")
  public ApiResponse<String> importRoadmapExcel(@ModelAttribute ExcelFileDto request) {
    return ApiResponse.<String>builder()
        .code(200)
        .message("Successfully")
        .data(service.importExcel(request))
        .build();
  }
}
