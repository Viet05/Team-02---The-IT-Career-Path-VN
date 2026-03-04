package com.team02.backend.repository;

import com.team02.backend.entity.CareerRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerRoleRepository extends JpaRepository<CareerRole, Long> {

  Optional<CareerRole> findByName(String name);
}
