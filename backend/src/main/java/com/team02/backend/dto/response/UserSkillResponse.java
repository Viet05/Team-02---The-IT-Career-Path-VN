package com.team02.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSkillResponse {
    private Long userProfileSkillId;
    private String name;
    private String description;
    private Integer level;
}
