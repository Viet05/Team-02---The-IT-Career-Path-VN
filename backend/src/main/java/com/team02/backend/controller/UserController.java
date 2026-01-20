package com.team02.backend.controller;

import com.team02.backend.dto.request.UserUpdateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.UserAdminResponse;
import com.team02.backend.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/it-path/admin/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    UserService userService;
    @GetMapping()
    public ApiResponse<Object> getAllUsers(){
        List<UserAdminResponse> userAdminResponse = userService.getUsers();
        return ApiResponse.builder()
                .code(200)
                .message("Get list users successfully")
                .data(userAdminResponse)
                .build();
    }

    @PostMapping("/{id}")
    public ApiResponse<Object> updateUser(@RequestBody UserUpdateRequest request,
                                          @PathVariable long id){
        UserAdminResponse userAdminResponse = userService.updateUser(id, request);
        return ApiResponse.builder()
                .code(200)
                .message("Update successfully")
                .data(userAdminResponse)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> deleteUser(@PathVariable long id){
        userService.deleteUserById(id);
        return ApiResponse.builder()
                .code(200)
                .message("Delete successfully")
                .build();
    }

    @PostMapping("/{id}/status")
    public ApiResponse<Object> blockUser(@PathVariable long id){
        return ApiResponse.builder()
                .code(200)
                .message("Block user successfully")
                .data(userService.blockUser(id))
                .build();
    }
}
