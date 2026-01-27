package com.team02.backend.mapper;

import com.team02.backend.dto.request.RoadmapCreateRequest;
import com.team02.backend.entity.Roadmap;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoadmapMapper {

  Roadmap toRoadmap(RoadmapCreateRequest request);
}
