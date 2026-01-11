package com.team02.backend.repository;

import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

  Users findByUsername(String username);
  boolean existsByUsername(String username);
  boolean existsByEmail(String email);
  Users findByVerificationToken(String token);
  List<Users> findByRole(UserRole role);
}
