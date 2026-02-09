package com.team02.backend.repository;

import com.team02.backend.entity.Roadmap;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {

  Optional<Roadmap> findByTitle(String title);
}
