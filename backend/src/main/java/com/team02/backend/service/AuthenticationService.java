package com.team02.backend.service;

import com.team02.backend.dto.request.LoginRequest;
import com.team02.backend.dto.request.RegisterRequest;
import com.team02.backend.dto.response.AuthenticationResponse;
import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import com.team02.backend.mapper.UserMapper;
import com.team02.backend.repository.UserRepository;
import com.team02.backend.security.JwtUtils;
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

  public AuthenticationResponse register(RegisterRequest request) {

    if (!(userRepository.existsByUsername(request.getUsername())) || !(userRepository.existsByEmail(request.getEmail()))) {
      throw  new IllegalArgumentException("Invalid username or email");
    }

    Users users = userMapper.registerMapper(request);
    users.setRole(UserRole.STUDENT);
    users.setPassword(passwordEncoder.encode(users.getPassword()));
    users.setStatus(UserStatus.ACTIVE);

    userRepository.save(users);

    String token = utils.generateToken(users);

    return new AuthenticationResponse(
        token,
        "Bearer",
        users.getUserId(),
        users.getUsername(),
        users.getRole().toString());
  }

  public AuthenticationResponse login(LoginRequest request) {

    Users users = userRepository.findByUsername(request.getUsername());
    boolean matches = passwordEncoder.matches(request.getPassword(), users.getPassword());

    if (!matches) {
      throw  new IllegalArgumentException("Invalid username or password");
    }

    String token = utils.generateToken(users);

    return new AuthenticationResponse(
        token,
        "Bearer",
        users.getUserId(),
        users.getUsername(),
        users.getRole().toString());
  }
}
