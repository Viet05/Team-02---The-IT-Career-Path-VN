package com.team02.backend.dto.response;

import com.team02.backend.enums.ProgressStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRoleProgressResponse {

    private Long progressId;
    private Long userId;
    private Long roadmapNodeId;
    private String roadmapNodeTitle;
    private ProgressStatus status;
    private LocalDateTime updatedAt;
}
