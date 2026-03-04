package com.team02.backend.service;

import com.team02.backend.dto.request.JobImportDTO;
import com.team02.backend.entity.JobPosting;
import com.team02.backend.entity.JobSource;
import com.team02.backend.repository.JobPostingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Helper bean tách riêng để importSingleJob chạy trong REQUIRES_NEW
 * transaction,
 * tránh self-invocation bypass Spring proxy.
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobImportHelper {

    JobPostingRepository jobPostingRepository;

    /**
     * Mỗi job chạy trong transaction riêng (REQUIRES_NEW).
     * Nếu duplicate key → transaction này rollback, không ảnh hưởng job khác.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void importSingleJob(JobImportDTO dto, JobSource jobSource) {
        Optional<JobPosting> existing = jobPostingRepository
                .findByExternalJobId(dto.getExternalJobId());

        JobPosting jobPosting = existing.orElseGet(() -> {
            JobPosting jp = new JobPosting();
            jp.setExternalJobId(dto.getExternalJobId());
            return jp;
        });

        jobPosting.setCompanyName(dto.getCompanyName());
        jobPosting.setDescription(dto.getDescription());
        jobPosting.setJobLevel(dto.getJobLevel());
        jobPosting.setJobType(dto.getJobType());
        jobPosting.setJobUrl(dto.getJobUrl());
        jobPosting.setLocation(dto.getLocation());
        jobPosting.setPostedAt(dto.getPostedAt());
        jobPosting.setSalaryMax(dto.getSalaryMax());
        jobPosting.setSalaryMin(dto.getSalaryMin());
        jobPosting.setSalaryText(dto.getSalaryText());
        jobPosting.setTitle(dto.getTitle());
        jobPosting.setJobSource(jobSource);

        jobPostingRepository.save(jobPosting);
    }
}
