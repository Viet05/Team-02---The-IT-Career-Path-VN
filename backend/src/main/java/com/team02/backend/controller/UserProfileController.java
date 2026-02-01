package com.team02.backend.controller;


import com.team02.backend.dto.request.UserProfileUpdateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.security.CustomUserDetail;
import com.team02.backend.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/it-path/users/user_profile")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileController {

    UserProfileService userProfileService;

    @GetMapping("/me")
    public ApiResponse<Object> getUserProfile(Authentication authentication) {
        
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();
        return ApiResponse.builder()
                .code(200)
                .message("Get User Profile successfully")
                .data(userProfileService.getUserProfile(userId))
                .build();
    }

    @PostMapping("/me")
    public ApiResponse<Object> updateUserProfile(Authentication authentication,
            @RequestBody UserProfileUpdateRequest userProfileUpdateRequest) {
        CustomUserDetail userDetail =(CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();
        return ApiResponse.builder()
                .code(200)
                .message("Update User Profile successfully")
                .data(userProfileService.updateUserProfile(userId, userProfileUpdateRequest))
                .build();
    }
}
