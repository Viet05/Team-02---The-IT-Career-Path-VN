package com.team02.backend.repository;

import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

  Users findByUsername(String username);
  boolean existsByUsername(String username);
  boolean existsByEmail(String email);
  Users findByVerificationToken(String token);
  Users findByEmail(String email);
  List<Users> findByRole(UserRole role);
  Long countByRole(UserRole role);
  @Query(value = "SELECT DATE(created_at) as date, COUNT(*) as count FROM users WHERE created_at >= :startDate GROUP BY DATE(created_at)", nativeQuery = true)
  List<Object[]> countUsersByCreatedDate(@Param("startDate") LocalDateTime startDate);
}
