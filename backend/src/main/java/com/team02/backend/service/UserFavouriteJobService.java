package com.team02.backend.service;

import com.team02.backend.dto.request.UserFavouriteJobAddRequest;
import com.team02.backend.dto.response.UserFavouriteJobResponse;
import com.team02.backend.entity.JobPosting;
import com.team02.backend.entity.UserFavoriteJob;
import com.team02.backend.entity.Users;
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
                orElseThrow(() -> new RuntimeException("User not found"));

        JobPosting jobPosting = jobPostingRepository.findById(request.getJobPostingId())
                .orElseThrow(() -> new RuntimeException("Job posting not found"));

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
        Users user = userRepository.findById(userId).
                orElseThrow(() -> new RuntimeException("User not found"));

        return userFavouriteJobRepository.findByUsers_UserId(userId)
                .stream()
                .map(userFavoriteJob -> new UserFavouriteJobResponse(
                        userFavoriteJob.getUserFavoriteJobId(),
                        userFavoriteJob.getJobPosting().getJobPostingId(),
                        userFavoriteJob.getUsers().getUserId()
                )).toList();
    }

    public void deleteUserFavouriteJob(Long userId, Long userFavoriteJobId){
        Users user = userRepository.findById(userId).
                orElseThrow(() -> new RuntimeException("User not found"));

        UserFavoriteJob userFavoriteJob = userFavouriteJobRepository.findById(userFavoriteJobId).
                orElseThrow(() -> new RuntimeException("User favourite job not found"));

        userFavouriteJobRepository.delete(userFavoriteJob);
    }
}
