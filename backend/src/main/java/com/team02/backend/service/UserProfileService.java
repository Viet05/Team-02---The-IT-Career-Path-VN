package com.team02.backend.service;

import com.team02.backend.dto.request.UserProfileUpdateRequest;
import com.team02.backend.dto.response.UserProfileResponse;
import com.team02.backend.entity.UserProfile;
import com.team02.backend.entity.Users;
import com.team02.backend.repository.UserProfileRepository;
import com.team02.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileService {

    UserRepository userRepository;
    UserProfileRepository userProfileRepository;

    public UserProfileResponse getUserProfile(Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUsers(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));


        return new UserProfileResponse(
                profile.getUserProfileId(),
                profile.getFullName(),
                profile.getDateOfBirth(),
                profile.getUniversity(),
                profile.getMajor(),
                profile.getCurrentLevel(),
                profile.getCareerGoal(),
                profile.getBio(),
                profile.getAvatarUrl(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }

    public UserProfileResponse updateUserProfile(Long id, UserProfileUpdateRequest request) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile userProfile = userProfileRepository.findByUsers(user)
                .orElseGet(() -> {
                    // Nếu chưa có profile, tạo mới
                    return UserProfile.builder()
                            .users(user)
                            .createdAt(LocalDateTime.now())
                            .build();
                });

        userProfile.setFullName(request.getFullName());
        userProfile.setDateOfBirth(request.getDateOfBirth());
        userProfile.setUniversity(request.getUniversity());
        userProfile.setMajor(request.getMajor());
        userProfile.setCurrentLevel(request.getCurrentLevel());
        userProfile.setCareerGoal(request.getCareerGoal());
        userProfile.setBio(request.getBio());
        userProfile.setAvatarUrl(request.getAvatarUrl());
        userProfile.setUpdatedAt(LocalDateTime.now());

        UserProfile saved =  userProfileRepository.save(userProfile);

        return new UserProfileResponse(
                saved.getUserProfileId(),
                saved.getFullName(),
                saved.getDateOfBirth(),
                saved.getUniversity(),
                saved.getMajor(),
                saved.getCurrentLevel(),
                saved.getCareerGoal(),
                saved.getBio(),
                saved.getAvatarUrl(),
                saved.getCreatedAt(),
                saved.getUpdatedAt()
        );
    }
}
