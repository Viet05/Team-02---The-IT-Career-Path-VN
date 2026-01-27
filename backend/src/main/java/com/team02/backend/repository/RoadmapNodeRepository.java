package com.team02.backend.repository;

import com.team02.backend.entity.RoadmapNode;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadmapNodeRepository extends JpaRepository<RoadmapNode, Long> {

  @Query(value = """
        SELECT 
            n.roadmap_node_id as id,
            n.title as title,
            n.description as description,
            n.node_type as nodeType,
            n.order_index as orderIndex,
            n.parent_node_id as parentId,
            COALESCE(p.status, 'NOT_STARTED') as status
        FROM roadmap_node n
        LEFT JOIN user_role_progress p 
            ON p.roadmap_node_id = n.roadmap_node_id 
            AND p.user_id = :userId
        WHERE n.roadmap_id = :roadmapId
        ORDER BY n.parent_node_id ASC, n.order_index ASC
    """, nativeQuery = true)
  List<RoadmapNodeProjection> findNodeWithProgress(@Param("roadmapId") Long roadmapId, @Param("userId") Long userId);
}
