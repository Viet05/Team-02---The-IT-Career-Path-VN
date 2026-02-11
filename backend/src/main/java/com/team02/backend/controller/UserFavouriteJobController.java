package com.team02.backend.controller;

import com.team02.backend.dto.request.UserFavouriteJobAddRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.security.CustomUserDetail;
import com.team02.backend.service.UserFavouriteJobService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/it-path/jobs/favourite")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserFavouriteJobController {

    UserFavouriteJobService userFavouriteJobService;

    @GetMapping()
    public ApiResponse<Object> getListUserFavouriteJob(Authentication authentication) {
        CustomUserDetail customUserDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = customUserDetail.getId();

        return ApiResponse.builder()
                .code(200)
                .message("Success")
                .data(userFavouriteJobService.getUserFavouriteJobs(userId))
                .build();
    }

    @PostMapping()
    public ApiResponse<Object> addFavouriteJob(Authentication authentication,
                                               @RequestBody UserFavouriteJobAddRequest request){
        CustomUserDetail customUserDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = customUserDetail.getId();
        return ApiResponse.builder()
                .code(200)
                .message("Adding favourite job successfully")
                .data(userFavouriteJobService.addUserFavouriteJob(request,userId))
                .build();
    }

    @DeleteMapping("/{userFavouriteJobId}")
    public ApiResponse<Object> deleteFavouriteJob(Authentication authentication,
                                                  @PathVariable Long userFavouriteJobId) {
        CustomUserDetail customUserDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = customUserDetail.getId();
        userFavouriteJobService.deleteUserFavouriteJob(userId, userFavouriteJobId);
        return ApiResponse.builder()
                .code(200)
                .message("Success")
                .data("Delete successfully")
                .build();
    }
}
