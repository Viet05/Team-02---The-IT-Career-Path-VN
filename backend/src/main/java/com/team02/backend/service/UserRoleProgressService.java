package com.team02.backend.service;

import com.team02.backend.dto.request.UserRoleProgressRequest;
import com.team02.backend.dto.response.UserRoleProgressResponse;
import com.team02.backend.entity.RoadmapNode;
import com.team02.backend.entity.UserRoleProgress;
import com.team02.backend.entity.Users;
import com.team02.backend.enums.ProgressStatus;
import com.team02.backend.exception.ResourceNotFoundException;
import com.team02.backend.repository.RoadmapNodeRepository;
import com.team02.backend.repository.UserRepository;
import com.team02.backend.repository.UserRoleProgressRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserRoleProgressService {

    UserRoleProgressRepository userRoleProgressRepository;
    UserRepository userRepository;
    RoadmapNodeRepository roadmapNodeRepository;

    @Transactional(readOnly = true)
    public List<UserRoleProgressResponse> getUserProgress(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return userRoleProgressRepository.findByUserIdWithRoadmapNode(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public UserRoleProgressResponse updateProgress(Long userId, UserRoleProgressRequest request) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        RoadmapNode roadmapNode = roadmapNodeRepository.findById(request.getRoadmapNodeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoadmapNode", "id", request.getRoadmapNodeId()));

        UserRoleProgress progress = userRoleProgressRepository
                .findByUserIdAndNodeId(userId, request.getRoadmapNodeId())
                .orElseGet(() -> UserRoleProgress.builder()
                        .usersId(user)
                        .roadmapNode(roadmapNode)
                        .status(ProgressStatus.NOT_STARTED)
                        .build());

        progress.setStatus(request.getStatus());
        UserRoleProgress saved = userRoleProgressRepository.save(progress);

        return toResponse(saved);
    }

    @Transactional
    public UserRoleProgressResponse markAsCompleted(Long userId, Long roadmapNodeId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        RoadmapNode roadmapNode = roadmapNodeRepository.findById(roadmapNodeId)
                .orElseThrow(() -> new ResourceNotFoundException("RoadmapNode", "id", roadmapNodeId));

        UserRoleProgress progress = userRoleProgressRepository
                .findByUserIdAndNodeId(userId, roadmapNodeId)
                .orElseGet(() -> UserRoleProgress.builder()
                        .usersId(user)
                        .roadmapNode(roadmapNode)
                        .status(ProgressStatus.NOT_STARTED)
                        .build());

        progress.setStatus(ProgressStatus.COMPLETED);
        UserRoleProgress saved = userRoleProgressRepository.save(progress);

        return toResponse(saved);
    }

    @Transactional
    public UserRoleProgressResponse startProgress(Long userId, Long roadmapNodeId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        RoadmapNode roadmapNode = roadmapNodeRepository.findById(roadmapNodeId)
                .orElseThrow(() -> new ResourceNotFoundException("RoadmapNode", "id", roadmapNodeId));

        UserRoleProgress progress = userRoleProgressRepository
                .findByUserIdAndNodeId(userId, roadmapNodeId)
                .orElseGet(() -> UserRoleProgress.builder()
                        .usersId(user)
                        .roadmapNode(roadmapNode)
                        .build());

        progress.setStatus(ProgressStatus.IN_PROGRESS);
        UserRoleProgress saved = userRoleProgressRepository.save(progress);

        return toResponse(saved);
    }

    @Transactional
    public void resetProgress(Long userId, Long roadmapNodeId) {
        UserRoleProgress progress = userRoleProgressRepository
                .findByUserIdAndNodeId(userId, roadmapNodeId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found"));

        progress.setStatus(ProgressStatus.NOT_STARTED);
        userRoleProgressRepository.save(progress);
    }

    @Transactional(readOnly = true)
    public long getCompletedCount(Long userId) {
        return userRoleProgressRepository.countCompletedByUserId(userId);
    }

    private UserRoleProgressResponse toResponse(UserRoleProgress progress) {
        return UserRoleProgressResponse.builder()
                .progressId(progress.getUserRoleProgressId())
                .userId(progress.getUsersId().getUserId())
                .roadmapNodeId(progress.getRoadmapNode().getRoadmapNodeId())
                .roadmapNodeTitle(progress.getRoadmapNode().getTitle())
                .status(progress.getStatus())
                .updatedAt(progress.getUpdatedAt())
                .build();
    }
}
