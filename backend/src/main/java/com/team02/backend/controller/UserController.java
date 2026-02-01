package com.team02.backend.controller;

import com.team02.backend.dto.request.UserUpdateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.UserAdminResponse;
import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import com.team02.backend.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/it-path/admin/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    UserService userService;


//    @GetMapping()
//    public ApiResponse<Object> getAllUsers(){
//        List<UserAdminResponse> userAdminResponse = userService.getUsers();
//        return ApiResponse.builder()
//                .code(200)
//                .message("Get list users successfully")
//                .data(userAdminResponse)
//                .build();
//    }

    @PutMapping("/{id}")
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

    @PutMapping("/{id}/status")
    public ApiResponse<Object> blockUser(@PathVariable long id){
        return ApiResponse.builder()
                .code(200)
                .message("Block user successfully")
                .data(userService.blockUser(id))
                .build();
    }

    @GetMapping()
    public ApiResponse<Object> searchAndFilterUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) UserRole role
    ){
        return ApiResponse.builder()
                .code(200)
                .message("Search and filter successfully")
                .data(userService.searchAndFilterUsers(keyword,
                        status, role))
                .build();
    }
}
