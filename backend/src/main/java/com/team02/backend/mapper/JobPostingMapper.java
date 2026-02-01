package com.team02.backend.mapper;

import com.team02.backend.dto.response.JobPostingResponse;
import com.team02.backend.entity.JobPosting;

public class JobPostingMapper {

    public static JobPostingResponse toListResponse(JobPosting job) {
        return JobPostingResponse.builder()
            .jobPostingId(job.getJobPostingId())
            .title(job.getTitle())
            .companyName(job.getCompanyName())
            .salaryText(
                job.getSalaryMin() == 0 && job.getSalaryMax() == 0
                    ? "Cạnh tranh"
                    : job.getSalaryMin() + " - " + job.getSalaryMax()
            )
            .location(job.getLocation())
            .postedAt(job.getPostedAt())
            .jobUrl(job.getJobUrl())
            .jobSourceName(job.getJobSource().getName())
                .jobType(job.getJobType())
                .jobLevel(job.getJobLevel())
            .build();
    }
}
