package com.team02.backend.repository;

import com.team02.backend.entity.JobSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobSourceRepository extends JpaRepository<JobSource, Long> {
    Optional<JobSource> findByName(String name);
}