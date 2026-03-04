package com.team02.backend.controller;

import com.team02.backend.dto.request.UserUpdateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.UserAdminResponse;
import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import com.team02.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "User Management (Admin)", description = "API quản lý người dùng (Chỉ dành cho Admin)")
@SecurityRequirement(name = "bearerAuth")
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
    @Operation(
        summary = "Cập nhật thông tin người dùng",
        description = "Chỉnh sửa thông tin của người dùng theo ID"
    )
    public ApiResponse<Object> updateUser(
            @RequestBody UserUpdateRequest request,
            @Parameter(description = "ID của người dùng") @PathVariable long id){
        UserAdminResponse userAdminResponse = userService.updateUser(id, request);
        return ApiResponse.builder()
                .code(200)
                .message("Update successfully")
                .data(userAdminResponse)
                .build();
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Xóa người dùng",
        description = "Xóa người dùng khỏi hệ thống theo ID"
    )
    public ApiResponse<Object> deleteUser(
            @Parameter(description = "ID của người dùng") @PathVariable long id){
        userService.deleteUserById(id);
        return ApiResponse.builder()
                .code(200)
                .message("Delete successfully")
                .build();
    }

    @PutMapping("/{id}/status")
    @Operation(
        summary = "Khóa/Mở khóa người dùng",
        description = "Thay đổi trạng thái hoạt động của người dùng"
    )
    public ApiResponse<Object> blockUser(
            @Parameter(description = "ID của người dùng") @PathVariable long id){
        return ApiResponse.builder()
                .code(200)
                .message("Block user successfully")
                .data(userService.blockUser(id))
                .build();
    }

    @GetMapping()
    @Operation(
        summary = "Tìm kiếm và lọc người dùng",
        description = "Tìm kiếm người dùng theo từ khóa, trạng thái và vai trò"
    )
    public ApiResponse<Object> searchAndFilterUsers(
            @Parameter(description = "Từ khóa tìm kiếm") @RequestParam(required = false) String keyword,
            @Parameter(description = "Trạng thái người dùng") @RequestParam(required = false) UserStatus status,
            @Parameter(description = "Vai trò người dùng") @RequestParam(required = false) UserRole role
    ){
        return ApiResponse.builder()
                .code(200)
                .message("Search and filter successfully")
                .data(userService.searchAndFilterUsers(keyword,
                        status, role))
                .build();
    }
}
