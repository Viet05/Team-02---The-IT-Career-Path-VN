package com.team02.backend.service;

import com.team02.backend.dto.response.JobPostingResponse;
import com.team02.backend.entity.JobPosting;
import com.team02.backend.repository.JobPostingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

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
}