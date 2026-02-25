package com.team02.backend.repository;

import com.team02.backend.entity.UserRoleProgress;
import com.team02.backend.entity.Users;
import com.team02.backend.entity.RoadmapNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleProgressRepository extends JpaRepository<UserRoleProgress, Long> {

    List<UserRoleProgress> findByUsersId_UserId(Long userId);

    List<UserRoleProgress> findByUsersId_UserIdAndRoadmapNode_RoadmapNodeIdIn(Long userId, List<Long> roadmapNodeIds);

    Optional<UserRoleProgress> findByUsersIdAndRoadmapNode(Users user, RoadmapNode roadmapNode);

    @Query("SELECT urp FROM UserRoleProgress urp WHERE urp.usersId.userId = :userId AND urp.roadmapNode.roadmapNodeId = :nodeId")
    Optional<UserRoleProgress> findByUserIdAndNodeId(@Param("userId") Long userId, @Param("nodeId") Long nodeId);

    @Query("SELECT COUNT(urp) FROM UserRoleProgress urp WHERE urp.usersId.userId = :userId AND urp.status = 'COMPLETED'")
    long countCompletedByUserId(@Param("userId") Long userId);

    @Query("SELECT urp FROM UserRoleProgress urp JOIN FETCH urp.roadmapNode WHERE urp.usersId.userId = :userId")
    List<UserRoleProgress> findByUserIdWithRoadmapNode(@Param("userId") Long userId);
}
