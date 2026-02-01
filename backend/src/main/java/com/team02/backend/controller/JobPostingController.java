package com.team02.backend.controller;

import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.service.JobPostingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/it-path/jobs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Job Postings", description = "API quản lý tin tuyển dụng")
public class JobPostingController {

    JobPostingService jobPostingService;

    @GetMapping
    @Operation(
        summary = "Lấy danh sách tất cả tin tuyển dụng",
        description = "Lấy toàn bộ danh sách các tin tuyển dụng trong hệ thống"
    )
    public ApiResponse<Object> getAllJobPostings() {
        return ApiResponse.builder()
                .code(200)
                .message("Get all job postings successfully!")
                .data(jobPostingService.getAllJobPostings())
                .build();
    }
}