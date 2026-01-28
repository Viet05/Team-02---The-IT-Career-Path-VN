package com.team02.backend.service;

import com.team02.backend.dto.request.LoginRequest;
import com.team02.backend.dto.request.RegisterRequest;
import com.team02.backend.dto.response.AuthenticationResponse;
import com.team02.backend.entity.PasswordResetToken;
import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import com.team02.backend.mapper.UserMapper;
import com.team02.backend.repository.PasswordResetTokenRepository;
import com.team02.backend.repository.UserRepository;
import com.team02.backend.security.JwtUtils;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {

  JwtUtils utils;
  UserRepository userRepository;
  PasswordEncoder passwordEncoder;
  UserMapper userMapper;
  EmailService emailService;
  PasswordResetTokenRepository passwordResetTokenRepository;

  @Transactional
  public String register(RegisterRequest request) {

    if (userRepository.existsByUsername(request.getUsername())) {
      throw new IllegalArgumentException("Username already exists");
    }
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new IllegalArgumentException("Email already exists");
    }

    Users users = userMapper.registerMapper(request);
    users.setRole(UserRole.STUDENT);
    users.setPassword(passwordEncoder.encode(users.getPassword()));
    users.setStatus(UserStatus.INACTIVE);
    users.setEmailVerified(false);

    String verificationToken = UUID.randomUUID().toString();
    users.setVerificationToken(verificationToken);
    users.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));

    userRepository.save(users);

    emailService.sendEmail(users.getEmail(), verificationToken);

    return users.getEmail();
  }

  public String emailVerification(String verificationToken) {

    Users user = userRepository.findByVerificationToken(verificationToken);

    if (user == null) {
      throw new IllegalArgumentException("Invalid verification token");
    }

    if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("Expired verification token");
    }

    user.setStatus(UserStatus.ACTIVE);
    user.setEmailVerified(true);
    user.setVerificationToken(null);
    user.setVerificationTokenExpiry(null);

    userRepository.save(user);
    return user.getEmail();
  }

  public AuthenticationResponse login(LoginRequest request) {


    Users users = userRepository.findByEmail(request.getEmail());
    if (users == null) {
      throw  new IllegalArgumentException("Invalid email");
    }
    boolean matches = passwordEncoder.matches(request.getPassword(), users.getPassword());

    if (!matches) {
      throw  new IllegalArgumentException("Invalid username or password");
    }

    if (!users.getStatus().equals(UserStatus.ACTIVE)) {
      throw  new IllegalArgumentException("Verify email before login");
    }

    String token = utils.generateToken(users);

    return new AuthenticationResponse(
        token,
        "Bearer",
        users.getUserId(),
        users.getUsername(),
        users.getRole().toString());
  }

  public String requestResetPassword(String email){

    Users user = userRepository.findByEmail(email);

    if(user == null){
      throw new IllegalArgumentException("Invalid email");
    }

    String token = UUID.randomUUID().toString();

    PasswordResetToken resetToken = PasswordResetToken.builder()
        .token(token)
        .user(user)
        .expiresAt(LocalDateTime.now().plusMinutes(15))
        .build();

    passwordResetTokenRepository.save(resetToken);
    return "Reset password email sent";
  }

  @Transactional
  public String resetPassword(String token, String newPassword) {

    PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
        .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

    if(resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("Expired token");
    }

    Users user = resetToken.getUser();
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    passwordResetTokenRepository.delete(resetToken);

    return "Password reset successfully";
  }
}
