package com.team02.backend.controller;

import com.team02.backend.dto.request.UserSkillAddRequest;
import com.team02.backend.dto.request.UserSkillUpdateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.security.CustomUserDetail;
import com.team02.backend.service.UserProfileSkillService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/it-path/users/user_profile/skills")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileSkillController {
    
    UserProfileSkillService userProfileSkillService;

    @GetMapping("/me")
    public ApiResponse<Object> getUserSkills(Authentication authentication) {

        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();

        return ApiResponse.builder()
            .code(200)
            .message("Get my skills successfully!")
            .data(userProfileSkillService.getSkillsByUserId(userId))
            .build();
    }   

    @PostMapping
    public ApiResponse<Object> addSkill(Authentication authentication,
            @RequestBody UserSkillAddRequest request) {
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        return ApiResponse.builder()
                .code(200)
                .message("Add skill successfully")
                .data(userProfileSkillService.addSkill(userDetail.getId(), request))
                .build();
    }

    @PutMapping("/{userProfileSkillId}")
    public ApiResponse<Object> updateSkill(Authentication authentication,
            @PathVariable Long userProfileSkillId,
            @RequestBody UserSkillUpdateRequest request) {

        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        return ApiResponse.builder()
                .code(200)
                .message("Update skill successfully")
                .data(userProfileSkillService.updateSkill(userDetail.getId(), userProfileSkillId, request))
                .build();
    }

    @DeleteMapping("/{userProfileSkillId}")
    public ApiResponse<Object> deleteSkill(Authentication authentication,
            @PathVariable Long userProfileSkillId) {

        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        userProfileSkillService.deleteSkill(userDetail.getId(), userProfileSkillId);
        return ApiResponse.builder()
                .code(200)
                .message("Delete skill successfully")
                .build();
    }
}