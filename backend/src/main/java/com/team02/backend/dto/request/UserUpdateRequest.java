package com.team02.backend.dto.request;

import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {
    @Size(min = 8, max = 50)
    private String username;
    @Size(min = 8, max = 20)
    private String password;
    private UserRole role;
}
