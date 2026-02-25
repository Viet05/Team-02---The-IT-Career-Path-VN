package com.team02.backend.service;

import com.team02.backend.dto.request.UserFavouriteJobAddRequest;
import com.team02.backend.dto.response.UserFavouriteJobResponse;
import com.team02.backend.entity.JobPosting;
import com.team02.backend.entity.UserFavoriteJob;
import com.team02.backend.entity.Users;
import com.team02.backend.exception.DuplicateResourceException;
import com.team02.backend.exception.ResourceNotFoundException;
import com.team02.backend.repository.JobPostingRepository;
import com.team02.backend.repository.UserFavouriteJobRepository;
import com.team02.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserFavouriteJobService {

    UserFavouriteJobRepository userFavouriteJobRepository;
    UserRepository userRepository;
    JobPostingRepository jobPostingRepository;

    public UserFavouriteJobResponse addUserFavouriteJob(UserFavouriteJobAddRequest request, Long userId){
        Users user = userRepository.findById(userId).
                orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        JobPosting jobPosting = jobPostingRepository.findById(request.getJobPostingId())
                .orElseThrow(() -> new ResourceNotFoundException("JobPosting", "id", request.getJobPostingId()));

        // Check if already favourited
        boolean exists = userFavouriteJobRepository.existsByUsers_UserIdAndJobPosting_JobPostingId(userId, request.getJobPostingId());
        if (exists) {
            throw new DuplicateResourceException("UserFavoriteJob", "jobPostingId", request.getJobPostingId());
        }

        UserFavoriteJob userFavoriteJob = UserFavoriteJob.builder()
                .jobPosting(jobPosting)
                .users(user)
                .build();

        UserFavoriteJob saved =  userFavouriteJobRepository.save(userFavoriteJob);
        return UserFavouriteJobResponse.builder()
                .userFavouriteJobId(saved.getUserFavoriteJobId())
                .jobPostingId(jobPosting.getJobPostingId())
                .userId(userId)
                .build();
    }

    public List<UserFavouriteJobResponse> getUserFavouriteJobs(Long userId){
        userRepository.findById(userId).
                orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return userFavouriteJobRepository.findByUsers_UserId(userId)
                .stream()
                .map(userFavoriteJob -> new UserFavouriteJobResponse(
                        userFavoriteJob.getUserFavoriteJobId(),
                        userFavoriteJob.getJobPosting().getJobPostingId(),
                        userFavoriteJob.getUsers().getUserId()
                )).toList();
    }

    public void deleteUserFavouriteJob(Long userId, Long userFavoriteJobId){
        userRepository.findById(userId).
                orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserFavoriteJob userFavoriteJob = userFavouriteJobRepository.findById(userFavoriteJobId).
                orElseThrow(() -> new ResourceNotFoundException("UserFavoriteJob", "id", userFavoriteJobId));

        // Verify the favorite belongs to the user
        if (!userFavoriteJob.getUsers().getUserId().equals(userId)) {
            throw new ResourceNotFoundException("UserFavoriteJob", "id", userFavoriteJobId);
        }

        userFavouriteJobRepository.delete(userFavoriteJob);
    }
}
