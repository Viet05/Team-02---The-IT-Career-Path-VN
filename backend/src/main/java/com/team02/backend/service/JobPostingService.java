package com.team02.backend.service;

import com.team02.backend.dto.response.JobPostingResponse;
import com.team02.backend.entity.JobPosting;
import com.team02.backend.enums.JobLevel;
import com.team02.backend.enums.JobType;
import com.team02.backend.mapper.JobPostingMapper;
import com.team02.backend.repository.JobPostingRepository;
import com.team02.backend.specification.JobPostingSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobPostingService {

    JobPostingRepository jobPostingRepository;

    public List<JobPostingResponse> getAllJobPostings() {
        return jobPostingRepository.findAll()
                .stream()
                .map(JobPostingMapper::toListResponse)
                .toList();
    }

    public List<JobPostingResponse> searchAndFilterJobPosting(
            String keyword,
            String location,
            JobType jobType,
            JobLevel jobLevel,
            Long skillId,
            Double minSalary,
            Double maxSalary
    ) {
        Specification<JobPosting> spec =
                JobPostingSpecification.getJobPostingSpecification(keyword, location
                        , jobType, jobLevel, skillId, minSalary, maxSalary);

        List<JobPostingResponse> jobPostings = jobPostingRepository.findAll(spec)
                .stream()
                .map(JobPostingMapper::toListResponse)
                .toList();
        return jobPostings;
    }
}