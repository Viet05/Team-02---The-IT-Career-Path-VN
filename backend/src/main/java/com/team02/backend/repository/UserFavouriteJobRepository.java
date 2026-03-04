package com.team02.backend.repository;

import com.team02.backend.entity.UserFavoriteJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavouriteJobRepository extends JpaRepository<UserFavoriteJob, Long> {
    List<UserFavoriteJob> findByUsers_UserId(Long userId);

    boolean existsByUsers_UserIdAndJobPosting_JobPostingId(Long userId, Long jobPostingId);

    Optional<UserFavoriteJob> findByUsers_UserIdAndJobPosting_JobPostingId(Long userId, Long jobPostingId);
}
