package com.team02.backend.repository;

import com.team02.backend.entity.UserRoleProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleProgressRepository extends JpaRepository<UserRoleProgress, Long> {

}
