package com.team02.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginRequest {

  @NotBlank(message = "Not empty")
  private String username;

  @NotBlank(message = "Not empty")
  private String password;
}
