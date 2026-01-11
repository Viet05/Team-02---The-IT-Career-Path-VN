package com.team02.backend.controller;

import com.team02.backend.dto.request.LoginRequest;
import com.team02.backend.dto.request.RegisterRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.AuthenticationResponse;
import com.team02.backend.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roadmap")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

  AuthenticationService authenticationService;

  @PostMapping("/register")
  public ApiResponse<AuthenticationResponse> register(@RequestBody @Valid RegisterRequest request) {

    return ApiResponse.<AuthenticationResponse>builder()
        .code(200)
        .message("Registered Successfully")
        .data(authenticationService.register(request))
        .build();
  }

  @PostMapping("/login")
  public ApiResponse<AuthenticationResponse> login(@RequestBody @Valid LoginRequest request) {

    return ApiResponse.<AuthenticationResponse>builder()
        .code(200)
        .message("Login Successfully")
        .data(authenticationService.login(request))
        .build();
  }
}
