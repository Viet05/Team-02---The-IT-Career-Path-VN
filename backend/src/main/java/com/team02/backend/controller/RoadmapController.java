package com.team02.backend.controller;

import com.team02.backend.dto.request.ExcelFileDto;
import com.team02.backend.dto.request.RoadmapCreateRequest;
import com.team02.backend.dto.request.RoadmapDetailsRequest;
import com.team02.backend.dto.request.RoadmapNodeCreateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.RoadmapDetailsDTO;
import com.team02.backend.dto.response.RoadmapResponse;
import com.team02.backend.service.RoadmapService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/it-path/roadmaps")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoadmapController {

  RoadmapService service;

  @GetMapping("/all")
  public ApiResponse<List<RoadmapResponse>> getRoadmap() {
    return ApiResponse.<List<RoadmapResponse>>builder()
        .code(200)
        .message("Successfully")
        .data(service.getRoadmap())
        .build();
  }

  @GetMapping("/details")
  public ApiResponse<RoadmapDetailsDTO> getRoadmapDetails(@RequestBody RoadmapDetailsRequest request) {
    return ApiResponse.<RoadmapDetailsDTO>builder()
        .code(200)
        .message("Successfully")
        .data(service.getRoadmapDetails(request))
        .build();
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ApiResponse<RoadmapResponse> createRoadmap(@RequestBody RoadmapCreateRequest request) {
    return ApiResponse.<RoadmapResponse>builder()
        .code(200)
        .message("Successfully")
        .data(service.createRoadmap(request))
        .build();
  }

  @PostMapping("/node")
  @PreAuthorize("hasRole('ADMIN')")
  public ApiResponse<RoadmapResponse> createRoadmapNode(@RequestBody RoadmapNodeCreateRequest request) {
    return ApiResponse.<RoadmapResponse>builder()
        .code(200)
        .message("Successfully")
        .data(service.createRoadmapNode(request))
        .build();
  }

  @PostMapping("/excel")
  @PreAuthorize("hasRole('ADMIN')")
  public ApiResponse<String> importRoadmapExcel(@RequestBody ExcelFileDto request) {
    return ApiResponse.<String>builder()
        .code(200)
        .message("Successfully")
        .data(service.importExcel(request))
        .build();
  }
}
