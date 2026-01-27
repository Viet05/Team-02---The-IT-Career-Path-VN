package com.team02.backend.dto.request;

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

  Long roadmapId;
  String title;
  String description;
  String nodeType;
  Integer orderIndex;
  Long parentNodeId;
}
