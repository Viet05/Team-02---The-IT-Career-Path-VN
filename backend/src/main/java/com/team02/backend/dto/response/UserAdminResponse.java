package com.team02.backend.dto.response;

import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAdminResponse {
    private Long userId;
    private String username;
    private String email;
    private UserRole role;
    private UserStatus status;
}
