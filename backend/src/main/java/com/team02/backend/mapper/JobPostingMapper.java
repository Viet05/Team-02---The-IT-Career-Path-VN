package com.team02.backend.mapper;

import com.team02.backend.dto.response.JobPostingResponse;
import com.team02.backend.entity.JobPosting;

import java.util.stream.Collectors;

public class JobPostingMapper {

    public static JobPostingResponse toListResponse(JobPosting job) {
        return JobPostingResponse.builder()
                .jobPostingId(job.getJobPostingId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .description(job.getDescription())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .salaryText(job.getSalaryText())
                .location(job.getLocation())
                .postedAt(job.getPostedAt())
                .jobUrl(job.getJobUrl())
                .jobSourceName(job.getJobSource() != null ? job.getJobSource().getName() : null)
                .jobType(job.getJobType())
                .jobLevel(job.getJobLevel())
                .skills(job.getJobSkills() != null
                        ? job.getJobSkills().stream()
                                .map(js -> js.getSkill().getName())
                                .collect(Collectors.toList())
                        : null)
                .build();
    }
}
