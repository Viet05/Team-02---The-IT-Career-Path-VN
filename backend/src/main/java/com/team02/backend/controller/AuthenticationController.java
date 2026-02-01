package com.team02.backend.controller;

import com.team02.backend.dto.request.LoginRequest;
import com.team02.backend.dto.request.RegisterRequest;
import com.team02.backend.dto.request.ResetPasswordRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.AuthenticationResponse;
import com.team02.backend.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.io.IOException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/it-path/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "API quản lý xác thực và đăng ký người dùng")
public class AuthenticationController {

  AuthenticationService authenticationService;

  @PostMapping("/register")
  @Operation(
    summary = "Đăng ký tài khoản mới",
    description = "Tạo tài khoản người dùng mới. Email xác thực sẽ được gửi sau khi đăng ký thành công."
  )
  public ApiResponse<String> register(@RequestBody @Valid RegisterRequest request) {

    return ApiResponse.<String>builder()
        .code(200)
        .message("Registered Successfully")
        .data(authenticationService.register(request))
        .build();
  }

  @GetMapping("/verify-email")
  @Operation(
    summary = "Xác thực email",
    description = "Xác thực địa chỉ email thông qua token được gửi qua email"
  )
  public ApiResponse<String> verifyEmail(
      @Parameter(description = "Token xác thực từ email") 
      @RequestParam("token") String token) {
    return ApiResponse.<String>builder()
        .code(200)
        .message("Verify Email Successfully")
        .data(authenticationService.emailVerification(token))
        .build();
  }

  @PostMapping("/login")
  @Operation(
    summary = "Đăng nhập",
    description = "Đăng nhập vào hệ thống bằng email và mật khẩu. Trả về JWT token để xác thực các request tiếp theo."
  )
  public ApiResponse<AuthenticationResponse> login(@RequestBody @Valid LoginRequest request) {

    return ApiResponse.<AuthenticationResponse>builder()
        .code(200)
        .message("Login Successfully")
        .data(authenticationService.login(request))
        .build();
  }

  @PostMapping("/reset-password/request")
  @Operation(
    summary = "Yêu cầu reset mật khẩu",
    description = "Gửi email chứa link reset mật khẩu đến địa chỉ email đã đăng ký"
  )
  public ApiResponse<String> requestReset(@RequestBody @Valid ResetPasswordRequest request) {
      return ApiResponse.<String>builder()
              .code(200)
              .message("Request Reset Successfully")
              .data(authenticationService.requestResetPassword(request.getEmail()))
              .build();
  }

  @PostMapping("/reset-password/confirm")
  @Operation(
    summary = "Xác nhận reset mật khẩu",
    description = "Đặt mật khẩu mới bằng token nhận được từ email"
  )
  public ApiResponse<String> ResetPassword(@RequestBody ResetPasswordRequest request){
      return ApiResponse.<String>builder()
              .code(200)
              .message("Reset Password Successfully")
              .data(authenticationService.resetPassword(request.getToken(), request.getNewPassword()))
              .build();
  }

  @GetMapping("/verify-email/redirect")
  public void verifyEmailRedirect(@RequestParam("token") String token,
 HttpServletResponse response) throws IOException {
  authenticationService.emailVerification(token);
  response.sendRedirect("http://localhost:5173/auth/login?verified=1");
}
}
