package com.team02.backend.service;

import com.team02.backend.dto.request.LoginRequest;
import com.team02.backend.dto.request.RegisterRequest;
import com.team02.backend.dto.response.AuthenticationResponse;
import com.team02.backend.exception.DuplicateResourceException;
import com.team02.backend.exception.ResourceNotFoundException;
import com.team02.backend.exception.UnauthorizedException;
import com.team02.backend.exception.ValidationException;
import com.team02.backend.entity.PasswordResetToken;
import com.team02.backend.entity.UserProfile;
import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import com.team02.backend.mapper.UserMapper;
import com.team02.backend.repository.PasswordResetTokenRepository;
import com.team02.backend.repository.UserProfileRepository;
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
  UserProfileRepository userProfileRepository;

  @Transactional
  public String register(RegisterRequest request) {

    if (userRepository.existsByUsername(request.getUsername())) {
      throw new DuplicateResourceException("User", "username", request.getUsername());
    }
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new DuplicateResourceException("User", "email", request.getEmail());
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

    UserProfile userProfile = new UserProfile();
    userProfile.setUsers(users);
    userProfileRepository.save(userProfile);
    emailService.sendEmail(users.getEmail(), verificationToken);

    return users.getEmail();
  }

  public String emailVerification(String verificationToken) {

    Users user = userRepository.findByVerificationToken(verificationToken);

    if (user == null) {
      throw new UnauthorizedException("Invalid verification token");
    }

    if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
      throw new UnauthorizedException("Verification token has expired. Please request a new verification email");
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
      throw new ValidationException("Invalid email or password");
    }
    boolean matches = passwordEncoder.matches(request.getPassword(), users.getPassword());

    if (!matches) {
      throw new ValidationException("Invalid email or password");
    }

    if (!users.getStatus().equals(UserStatus.ACTIVE)) {
      throw new UnauthorizedException("Please verify your email before logging in");
    }

    String token = utils.generateToken(users);

    return new AuthenticationResponse(
        token,
        "Bearer",
        users.getUserId(),
        users.getUsername(),
        users.getRole().toString());
  }

  public String requestResetPassword(String email) {

    Users user = userRepository.findByEmail(email);

    if (user == null) {
      throw new ResourceNotFoundException("User", "email", email);
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
        .orElseThrow(() -> new UnauthorizedException("Invalid password reset token"));

    if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new UnauthorizedException("Password reset token has expired. Please request a new one");
    }

    Users user = resetToken.getUser();
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    passwordResetTokenRepository.delete(resetToken);

    return "Password reset successfully";
  }
}
