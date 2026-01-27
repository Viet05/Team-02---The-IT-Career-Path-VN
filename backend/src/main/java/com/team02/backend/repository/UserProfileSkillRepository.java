package com.team02.backend.repository;

import com.team02.backend.entity.UserProfile;
import com.team02.backend.entity.UserProfileSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProfileSkillRepository extends JpaRepository<UserProfileSkill, Long> {
    boolean existsByUserProfileAndSkill(UserProfile userProfile, Skill skill);
}
