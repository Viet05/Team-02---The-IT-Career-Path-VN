package com.team02.backend.repository;

import com.team02.backend.entity.UserProfile;
import com.team02.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUsers(Users users);

}
