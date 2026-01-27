package com.team02.backend.repository;

import com.team02.backend.entity.JobSource;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface JobSourceRepository extends JpaRepository<JobSource, Long> {
}