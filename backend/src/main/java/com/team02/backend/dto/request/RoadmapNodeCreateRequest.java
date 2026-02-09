package com.team02.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoadmapNodeCreateRequest {

  @NotNull(message = "Roadmap ID is required")
  Long roadmapId;

  @NotBlank(message = "Title is required")
  String title;

  String description;

  @NotBlank(message = "Node type is required")
  String nodeType;

  @NotNull(message = "Order index is required")
  @Min(value = 0, message = "Order index must be non-negative")
  Integer orderIndex;

  Long parentNodeId;
}
