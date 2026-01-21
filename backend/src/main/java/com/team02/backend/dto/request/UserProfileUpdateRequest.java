package com.team02.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileUpdateRequest {
    private String fullName;
    private LocalDate dateOfBirth;
    private String university;
    private String major;
    private String currentLevel;
    private String careerGoal;
    private String bio;
    private String avatarUrl;
    private LocalDateTime updatedAt;
}
