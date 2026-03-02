package com.team02.backend.controller;

import com.team02.backend.dto.request.JobImportDTO;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.entity.JobPosting;
import com.team02.backend.entity.Skill;
import com.team02.backend.enums.JobLevel;
import com.team02.backend.enums.JobType;
import com.team02.backend.service.JobPostingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/it-path/jobs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Job Postings", description = "API quản lý tin tuyển dụng")
public class JobPostingController {

    JobPostingService jobPostingService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả tin tuyển dụng", description = "Lấy toàn bộ danh sách các tin tuyển dụng trong hệ thống")
    public ApiResponse<Object> getAllJobPostings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) JobLevel jobLevel,
            @RequestParam(required = false) Long skillId,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) Double maxSalary) {
        return ApiResponse.builder()
                .code(200)
                .message("Get all job postings successfully!")
                .data(jobPostingService.searchAndFilterJobPosting(
                        keyword,
                        location,
                        jobType,
                        jobLevel,
                        skillId,
                        minSalary,
                        maxSalary))
                .build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết tin tuyển dụng", description = "Lấy thông tin chi tiết của một tin tuyển dụng theo ID")
    public ApiResponse<Object> getJobPostingById(@PathVariable Long id) {
        return ApiResponse.builder()
                .code(200)
                .message("Get job posting successfully!")
                .data(jobPostingService.getJobPostingById(id))
                .build();
    }

    @PostMapping("/import")
    public ApiResponse<Object> importJobPostings(@RequestBody List<JobImportDTO> jobs) {
        jobPostingService.importFromApi(jobs);
        return ApiResponse.builder()
                .code(200)
                .message("Import job postings successfully!")
                .build();
    }
    // @PostMapping("/import")
    // public ResponseEntity<?> importJobs(@RequestBody String rawBody) {
    // System.out.println("RAW BODY:");
    // System.out.println(rawBody);
    // return ResponseEntity.ok().build();
    // }

}