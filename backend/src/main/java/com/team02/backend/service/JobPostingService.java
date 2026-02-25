package com.team02.backend.service;

import com.team02.backend.dto.request.JobImportDTO;
import com.team02.backend.dto.response.JobPostingResponse;
import com.team02.backend.entity.JobPosting;
import com.team02.backend.entity.JobSource;
import com.team02.backend.enums.JobLevel;
import com.team02.backend.enums.JobType;
import com.team02.backend.mapper.JobPostingMapper;
import com.team02.backend.repository.JobPostingRepository;
import com.team02.backend.repository.JobSourceRepository;
import com.team02.backend.specification.JobPostingSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobPostingService {

    JobPostingRepository jobPostingRepository;
    JobSourceRepository jobSourceRepository;

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

    public void importFromApi(List<JobImportDTO> jobs) {
        for(JobImportDTO jobImportDTO : jobs) {
          if (jobImportDTO.getExternalJobId() == null) {
            continue;
        }

        Optional<JobPosting> existing =
                jobPostingRepository.findByExternalJobId(jobImportDTO.getExternalJobId());

        JobPosting jobPosting;

        if (existing.isPresent()) {
            jobPosting = existing.get(); // update
        } else {
            jobPosting = new JobPosting(); // insert
            jobPosting.setExternalJobId(jobImportDTO.getExternalJobId());
        }

                jobPosting.setExternalJobId(jobImportDTO.getExternalJobId());
                jobPosting.setCompanyName(jobImportDTO.getCompanyName());
                jobPosting.setDescription(jobImportDTO.getDescription());
                jobPosting.setJobLevel(jobImportDTO.getJobLevel());
                jobPosting.setJobType(jobImportDTO.getJobType());
                jobPosting.setJobUrl(jobImportDTO.getJobUrl());
                jobPosting.setLocation(jobImportDTO.getLocation());
                jobPosting.setPostedAt(jobImportDTO.getPostedAt());
                jobPosting.setSalaryMax(jobImportDTO.getSalaryMax());
                jobPosting.setSalaryMin(jobImportDTO.getSalaryMin());
                jobPosting.setSalaryText(jobImportDTO.getSalaryText());
                jobPosting.setTitle(jobImportDTO.getTitle());

                JobSource jobSource = jobSourceRepository.
                        findByName("CareerViet")
                        .orElseThrow();

                jobPosting.setJobSource(jobSource);
                jobPostingRepository.save(jobPosting);
        }
    }
}