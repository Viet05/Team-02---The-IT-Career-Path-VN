package com.team02.backend.repository;

import com.team02.backend.entity.JobPosting;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

  Long countByPostedAtAfter(LocalDateTime date);

  List<JobPosting> findTop10ByPostedAtAfter(LocalDateTime date);

  @Query(value = "SELECT DATE(posted_at) as date, COUNT(*) as count FROM job_posting WHERE posted_at >= :startDate GROUP BY DATE(posted_at)")
  List<Object[]> countJobsByDate(@Param("startDate") LocalDateTime startDate);
}
