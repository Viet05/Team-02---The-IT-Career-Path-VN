package com.team02.backend.controller;

import com.team02.backend.dto.request.UserSkillAddRequest;
import com.team02.backend.dto.request.UserSkillUpdateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.security.CustomUserDetail;
import com.team02.backend.service.UserProfileSkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/it-path/users/user_profile/skills")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "User Profile Skills", description = "API quản lý kỹ năng người dùng")
@SecurityRequirement(name = "bearerAuth")
public class UserProfileSkillController {

    UserProfileSkillService userProfileSkillService;

    @GetMapping("/me")
    @Operation(summary = "Lấy danh sách kỹ năng", description = "Lấy danh sách kỹ năng của người dùng hiện tại")
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
    @Operation(summary = "Thêm kỹ năng mới", description = "Thêm một kỹ năng mới vào hồ sơ người dùng")
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
    @Operation(summary = "Cập nhật kỹ năng", description = "Cập nhật thông tin kỹ năng (level)")
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
    @Operation(summary = "Xóa kỹ năng", description = "Xóa kỹ năng khỏi hồ sơ người dùng")
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