package com.team02.backend.repository;

import com.team02.backend.enums.ProgressStatus;

public interface RoadmapNodeProjection {

  Long getId();
  String getTitle();
  String getDescription();
  String getNodeType();
  int getOrderIndex();
  Long getParentId();
  ProgressStatus getStatus();
}
