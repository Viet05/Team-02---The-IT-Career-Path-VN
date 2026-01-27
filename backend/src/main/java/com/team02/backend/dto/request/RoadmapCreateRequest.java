package com.team02.backend.dto.request;

import com.team02.backend.entity.CareerRole;
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
public class RoadmapCreateRequest {

  String title;
  String description;
  String level;
  String careerRoleName;
  String careerRoleDescription;
}
