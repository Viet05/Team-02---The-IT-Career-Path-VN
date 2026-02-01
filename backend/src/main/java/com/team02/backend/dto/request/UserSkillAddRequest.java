package com.team02.backend.dto.request;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSkillAddRequest {
    private Long skillId;
    private Integer level;
}
