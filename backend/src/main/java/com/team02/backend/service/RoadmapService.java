package com.team02.backend.service;

import com.team02.backend.dto.request.ExcelFileDto;
import com.team02.backend.dto.request.RoadmapCreateRequest;
import com.team02.backend.dto.request.RoadmapDetailsRequest;
import com.team02.backend.dto.request.RoadmapNodeCreateRequest;
import com.team02.backend.dto.request.RoadmapNodeImport;
import com.team02.backend.dto.response.RoadmapDetailsDTO;
import com.team02.backend.dto.response.RoadmapNodeResponse;
import com.team02.backend.dto.response.RoadmapResponse;
import com.team02.backend.entity.CareerRole;
import com.team02.backend.entity.Roadmap;
import com.team02.backend.entity.RoadmapNode;
import com.team02.backend.exception.DuplicateResourceException;
import com.team02.backend.exception.FileProcessingException;
import com.team02.backend.exception.ResourceNotFoundException;
import com.team02.backend.exception.ValidationException;
import com.team02.backend.mapper.RoadmapMapper;
import com.team02.backend.repository.CareerRoleRepository;
import com.team02.backend.repository.RoadmapNodeProjection;
import com.team02.backend.repository.RoadmapNodeRepository;
import com.team02.backend.repository.RoadmapRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Builder
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoadmapService {

  RoadmapRepository roadmapRepo;
  RoadmapNodeRepository roadmapNodeRepo;
  RoadmapMapper roadmapMapper;
  CareerRoleRepository careerRoleRepo;

  public List<RoadmapResponse> getRoadmap() {

    List<Roadmap> roadmap = roadmapRepo.findAll();
    return roadmap.stream().map(
        roadmap1 -> new RoadmapResponse(
            roadmap1.getRoadmapId(),
            roadmap1.getTitle()))
        .toList();
  }

  @Transactional
  public RoadmapDetailsDTO getRoadmapDetails(RoadmapDetailsRequest request) {

    Roadmap roadmaps = roadmapRepo.findById(request.getRoadmapId()).orElseThrow(
        () -> new ResourceNotFoundException("Roadmap", request.getRoadmapId()));

    List<RoadmapNodeProjection> roadmapNode = roadmapNodeRepo.findNodeWithProgress(
        request.getRoadmapId(), request.getUserId());

    List<RoadmapNodeResponse> nodeResponses = roadmapNode.stream()
        .map(node -> RoadmapNodeResponse.builder()
            .id(node.getId())
            .title(node.getTitle())
            .description(node.getDescription())
            .nodeType(node.getNodeType())
            .orderIndex(node.getOrderIndex())
            .parentNodeId(node.getParentId())
            .status(node.getStatus())
            .build())
        .toList();

    return RoadmapDetailsDTO.builder()
        .id(roadmaps.getRoadmapId())
        .title(roadmaps.getTitle())
        .description(roadmaps.getDescription())
        .level(roadmaps.getLevel())
        .careerRole(roadmaps.getCareerRole().getName())
        .roadmapNodes(nodeResponses)
        .build();
  }

  @Transactional
  public RoadmapResponse createRoadmap(RoadmapCreateRequest request) {

    if (roadmapRepo.findByTitle(request.getTitle()).isPresent()) {
      throw new DuplicateResourceException("Roadmap", "title", request.getTitle());
    }

    CareerRole careerRole = careerRoleRepo
        .findByName(request.getCareerRoleName())
        .orElseGet(() -> {
          CareerRole newRole = CareerRole.builder()
              .name(request.getCareerRoleName())
              .description(request.getCareerRoleDescription())
              .build();
          return careerRoleRepo.save(newRole);
        });

    Roadmap roadmap = roadmapMapper.toRoadmap(request);
    roadmap.setCareerRole(careerRole);
    roadmapRepo.save(roadmap);
    return new RoadmapResponse(roadmap.getRoadmapId(), roadmap.getTitle());
  }

  @Transactional
  public RoadmapResponse createRoadmapNode(RoadmapNodeCreateRequest request) {

    Roadmap roadmaps = roadmapRepo.findById(request.getRoadmapId()).orElseThrow(
        () -> new ResourceNotFoundException("Roadmap", request.getRoadmapId()));

    RoadmapNode parentNode = null;
    if (request.getParentNodeId() != null) {
      parentNode = roadmapNodeRepo.findById(request.getParentNodeId()).orElseThrow(
          () -> new ResourceNotFoundException("Roadmap node", request.getParentNodeId()));

      // Validate that parent node belongs to the same roadmap
      if (!parentNode.getRoadmap().getRoadmapId().equals(request.getRoadmapId())) {
        throw new ValidationException("Parent node must belong to the same roadmap as the child node");
      }
    }

    RoadmapNode node = RoadmapNode.builder()
        .title(request.getTitle())
        .description(request.getDescription())
        .nodeType(request.getNodeType())
        .orderIndex(request.getOrderIndex())
        .roadmap(roadmaps)
        .parentNode(parentNode)
        .build();

    roadmapNodeRepo.save(node);

    return new RoadmapResponse(roadmaps.getRoadmapId(), roadmaps.getTitle());
  }

  public List<RoadmapNodeImport> parse(MultipartFile file) {

    List<RoadmapNodeImport> rows = new ArrayList<>();

    try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {

      Sheet sheet = workbook.getSheetAt(0);

      for (Row row : sheet) {

        if (row.getRowNum() == 0)
          continue;

        if (row.getCell(0) == null)
          continue;

        RoadmapNodeImport dto = new RoadmapNodeImport();

        dto.setLevel((int) row.getCell(0).getNumericCellValue());
        dto.setTitle(row.getCell(1).getStringCellValue().trim());
        dto.setDescription(
            row.getCell(2) != null ? row.getCell(2).getStringCellValue().trim() : null);
        dto.setNodeType(row.getCell(3).getStringCellValue().trim());
        dto.setOrderIndex((int) row.getCell(4).getNumericCellValue());

        rows.add(dto);
      }

    } catch (Exception e) {
      throw new FileProcessingException("Failed to parse Excel file. Please check the file format", e);
    }

    return rows;
  }

  @Transactional
  public String importExcel(ExcelFileDto request) {

    List<RoadmapNodeImport> rows = parse(request.getFile());

    Roadmap roadmap = roadmapRepo.findById(request.getRoadmapId()).orElseThrow(
        () -> new ResourceNotFoundException("Roadmap", request.getRoadmapId()));

    Map<Integer, RoadmapNode> levelNode = new HashMap<>();

    for (RoadmapNodeImport row : rows) {

      RoadmapNode parentNode = null;

      if (row.getLevel() > 0) {
        parentNode = levelNode.get(row.getLevel() - 1);
        if (parentNode == null) {
          throw new ValidationException(
              "Parent node not found for level " + row.getLevel() + ". Please ensure nodes are properly ordered");
        }

      }
      RoadmapNode roadmapNode = RoadmapNode.builder()
          .title(row.getTitle())
          .description(row.getDescription())
          .nodeType(row.getNodeType())
          .orderIndex(row.getOrderIndex())
          .roadmap(roadmap)
          .parentNode(parentNode)
          .build();

      roadmapNodeRepo.save(roadmapNode);
      levelNode.put(row.getLevel(), roadmapNode);
    }

    return "Import successfully";
  }

  public String deleteRoadmap(Long roadmapId) {

    roadmapRepo.deleteById(roadmapId);
    return "Roadmap deleted";
  }
}
