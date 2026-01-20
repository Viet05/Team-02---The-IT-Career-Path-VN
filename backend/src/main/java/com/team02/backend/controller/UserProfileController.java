package com.team02.backend.controller;


import com.team02.backend.dto.request.UserProfileUpdateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/it-path/users/user_profile")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileController {

    UserProfileService userProfileService;

    @GetMapping("/{id}")
    public ApiResponse<Object> getUserProfile(@PathVariable Long id) {
        return ApiResponse.builder()
                .code(200)
                .message("Get User Profile successfully")
                .data(userProfileService.getUserProfile(id))
                .build();
    }

    @PostMapping("/{id}")
    public ApiResponse<Object> updateUserProfile(@PathVariable Long id
            , @RequestBody UserProfileUpdateRequest userProfileUpdateRequest) {
        return ApiResponse.builder()
                .code(200)
                .message("Update User Profile successfully")
                .data(userProfileService.updateUserProfile(id, userProfileUpdateRequest))
                .build();
    }
}
