package com.team02.backend.service;

import com.team02.backend.dto.request.UserSkillAddRequest;
import com.team02.backend.dto.request.UserSkillUpdateRequest;
import com.team02.backend.dto.response.UserSkillResponse;
import com.team02.backend.entity.*;
import com.team02.backend.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileSkillService {

    UserProfileSkillRepository userProfileSkillRepository;
    UserProfileRepository userProfileRepository;
    UserRepository userRepository;
    SkillRepository skillRepository;

    public List<UserSkillResponse> getSkillsByUserId(Long userId) {
         Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUsers(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return userProfileSkillRepository
                .findByUserProfile_UserProfileId(profile.getUserProfileId())
                .stream()
                .map(skill -> UserSkillResponse.builder()
                    .userProfileSkillId(skill.getUserProfileSkillId())
                    .name(skill.getSkill().getName())
                    .description(skill.getSkill().getDescription())
                    .level(skill.getLevel())
                    .build())
                .toList();
    }
    public UserSkillResponse addSkill(Long userId, UserSkillAddRequest request) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUsers(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (userProfileSkillRepository.existsByUserProfileAndSkill(profile, skill)) {
            throw new RuntimeException("Skill already added");
        }

        UserProfileSkill ups = UserProfileSkill.builder()
                .userProfile(profile)
                .skill(skill)
                .level(request.getLevel())
                .build();

        UserProfileSkill saved = userProfileSkillRepository.save(ups);

        return UserSkillResponse.builder()
                .userProfileSkillId(saved.getUserProfileSkillId())
                .name(skill.getName())
                .description(skill.getDescription())
                .level(saved.getLevel())
                .build();
    }

    public UserSkillResponse updateSkill(Long userId, Long userProfileSkillId,
                    UserSkillUpdateRequest request) {
        UserProfileSkill ups = userProfileSkillRepository.findById(userProfileSkillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!ups.getUserProfile().getUsers().getUserId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        ups.setLevel(request.getLevel());
        userProfileSkillRepository.save(ups);

        return UserSkillResponse.builder()
                .userProfileSkillId(ups.getUserProfileSkillId())
                .name(ups.getSkill().getName())
                .description(ups.getSkill().getDescription())
                .level(ups.getLevel())
                .build();
    }

    public void deleteSkill(Long userId, Long userProfileSkillId) {

        UserProfileSkill ups = userProfileSkillRepository.findById(userProfileSkillId)
            .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!ups.getUserProfile().getUsers().getUserId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        userProfileSkillRepository.delete(ups);
    }

}
