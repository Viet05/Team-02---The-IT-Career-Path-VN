package com.team02.backend.config.app;

import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import com.team02.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;


  @Override
  public void run(String... args) throws Exception {
    if (userRepository.findByRole(UserRole.ADMIN).isEmpty()) {
      Users admin = Users.builder()
          .username("admin")
          .email("admin@admin.com")
          .password(passwordEncoder.encode("admin"))
          .role(UserRole.ADMIN)
          .emailVerified(true)
          .status(UserStatus.ACTIVE)
          .build();
      userRepository.save(admin);
      System.out.println("Default admin created");
    }
  }
}
