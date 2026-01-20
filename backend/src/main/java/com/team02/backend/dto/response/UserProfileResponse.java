package com.team02.backend.dto.response;


import com.team02.backend.entity.UserProfileSkill;
import com.team02.backend.entity.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponse {

    private Long userProfileId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String university;
    private String major;
    private String currentLevel;
    private String careerGoal;
    private String bio;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
