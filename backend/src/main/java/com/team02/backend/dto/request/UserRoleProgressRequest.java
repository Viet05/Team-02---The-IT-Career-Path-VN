package com.team02.backend.dto.request;

import com.team02.backend.enums.ProgressStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRoleProgressRequest {

    @NotNull(message = "Roadmap node ID is required")
    private Long roadmapNodeId;

    @NotNull(message = "Status is required")
    private ProgressStatus status;
}
