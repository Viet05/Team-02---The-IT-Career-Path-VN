package com.team02.backend.controller;

import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.service.JobPostingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/it-path/jobs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobPostingController {

    JobPostingService jobPostingService;

    @GetMapping
    public ApiResponse<Object> getAllJobPostings() {
        return ApiResponse.builder()
                .code(200)
                .message("Get all job postings successfully!")
                .data(jobPostingService.getAllJobPostings())
                .build();
    }
}