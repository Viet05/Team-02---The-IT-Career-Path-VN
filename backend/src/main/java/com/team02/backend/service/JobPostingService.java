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
import com.team02.backend.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobPostingService {

        JobPostingRepository jobPostingRepository;
        JobSourceRepository jobSourceRepository;
        JobImportHelper jobImportHelper;

        @Transactional(readOnly = true)
        public List<JobPostingResponse> getAllJobPostings() {
                return jobPostingRepository.findAll()
                                .stream()
                                .map(JobPostingMapper::toListResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public JobPostingResponse getJobPostingById(Long id) {
                return jobPostingRepository.findById(id)
                                .map(JobPostingMapper::toListResponse)
                                .orElseThrow(() -> new ResourceNotFoundException("Job with ID: " + id + " not found"));
        }

        @Transactional(readOnly = true)
        public List<JobPostingResponse> searchAndFilterJobPosting(
                        String keyword,
                        String location,
                        JobType jobType,
                        JobLevel jobLevel,
                        Long skillId,
                        Double minSalary,
                        Double maxSalary) {
                Specification<JobPosting> spec = JobPostingSpecification.getJobPostingSpecification(keyword, location,
                                jobType, jobLevel, skillId, minSalary, maxSalary);

                List<JobPostingResponse> jobPostings = jobPostingRepository.findAll(spec)
                                .stream()
                                .map(JobPostingMapper::toListResponse)
                                .toList();
                return jobPostings;
        }

        public void importFromApi(List<JobImportDTO> jobs) {
                // Tìm hoặc tạo JobSource "CareerViet" (1 lần duy nhất cho cả batch)
                JobSource jobSource = jobSourceRepository.findByName("CareerViet")
                                .orElseGet(() -> jobSourceRepository.save(
                                                JobSource.builder()
                                                                .name("CareerViet")
                                                                .apiUrl("https://careerviet.vn")
                                                                .build()));

                for (JobImportDTO dto : jobs) {
                        if (dto.getExternalJobId() == null)
                                continue;
                        try {
                                // Gọi qua bean riêng → Spring proxy hoạt động → REQUIRES_NEW được áp dụng
                                jobImportHelper.importSingleJob(dto, jobSource);
                        } catch (Exception e) {
                                // Race condition: duplicate key → bỏ qua, tiếp tục job tiếp theo
                        }
                }
        }
}
