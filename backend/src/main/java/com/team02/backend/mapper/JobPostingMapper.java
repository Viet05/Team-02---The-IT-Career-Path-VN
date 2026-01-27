package com.team02.backend.mapper;

import com.team02.backend.dto.response.JobPostingListResponse;
import com.team02.backend.entity.JobPosting;

public class JobPostingMapper {

    public static JobPostingListResponse toListResponse(JobPosting job) {
        return JobPostingListResponse.builder()
            .jobPostingId(job.getJobPostingId())
            .title(job.getTitle())
            .companyName(job.getCompanyName())
            .salary(
                job.getSalaryMin() == 0 && job.getSalaryMax() == 0
                    ? "Cạnh tranh"
                    : job.getSalaryMin() + " - " + job.getSalaryMax()
            )
            .location(job.getLocation())
            .postedAt(job.getPostedAt())
            .jobUrl(job.getJobUrl())
            .jobSourceName(job.getJobSource().getName())
            .build();
    }
}
