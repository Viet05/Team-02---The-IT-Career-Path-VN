package com.team02.backend.controller;

import com.team02.backend.dto.request.UserRoleProgressRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.UserRoleProgressResponse;
import com.team02.backend.security.CustomUserDetail;
import com.team02.backend.service.UserRoleProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/it-path/progress")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "User Progress", description = "API quản lý tiến độ học tập của người dùng")
public class UserRoleProgressController {

    UserRoleProgressService userRoleProgressService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tiến độ học tập của user hiện tại")
    public ApiResponse<List<UserRoleProgressResponse>> getUserProgress(Authentication authentication) {
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();

        return ApiResponse.<List<UserRoleProgressResponse>>builder()
                .code(200)
                .message("Success")
                .data(userRoleProgressService.getUserProgress(userId))
                .build();
    }

    @PutMapping
    @Operation(summary = "Cập nhật tiến độ cho một roadmap node")
    public ApiResponse<UserRoleProgressResponse> updateProgress(
            Authentication authentication,
            @RequestBody @Valid UserRoleProgressRequest request) {
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();

        return ApiResponse.<UserRoleProgressResponse>builder()
                .code(200)
                .message("Progress updated successfully")
                .data(userRoleProgressService.updateProgress(userId, request))
                .build();
    }

    @PostMapping("/start/{roadmapNodeId}")
    @Operation(summary = "Bắt đầu học một roadmap node")
    public ApiResponse<UserRoleProgressResponse> startProgress(
            Authentication authentication,
            @PathVariable Long roadmapNodeId) {
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();

        return ApiResponse.<UserRoleProgressResponse>builder()
                .code(200)
                .message("Progress started")
                .data(userRoleProgressService.startProgress(userId, roadmapNodeId))
                .build();
    }

    @PostMapping("/complete/{roadmapNodeId}")
    @Operation(summary = "Đánh dấu hoàn thành một roadmap node")
    public ApiResponse<UserRoleProgressResponse> markAsCompleted(
            Authentication authentication,
            @PathVariable Long roadmapNodeId) {
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();

        return ApiResponse.<UserRoleProgressResponse>builder()
                .code(200)
                .message("Marked as completed")
                .data(userRoleProgressService.markAsCompleted(userId, roadmapNodeId))
                .build();
    }

    @PostMapping("/reset/{roadmapNodeId}")
    @Operation(summary = "Reset tiến độ của một roadmap node")
    public ApiResponse<String> resetProgress(
            Authentication authentication,
            @PathVariable Long roadmapNodeId) {
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();

        userRoleProgressService.resetProgress(userId, roadmapNodeId);
        return ApiResponse.<String>builder()
                .code(200)
                .message("Progress reset successfully")
                .data("Reset completed")
                .build();
    }

    @GetMapping("/completed-count")
    @Operation(summary = "Lấy số lượng node đã hoàn thành")
    public ApiResponse<Long> getCompletedCount(Authentication authentication) {
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();

        return ApiResponse.<Long>builder()
                .code(200)
                .message("Success")
                .data(userRoleProgressService.getCompletedCount(userId))
                .build();
    }
}
