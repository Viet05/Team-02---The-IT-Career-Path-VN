package com.team02.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationResponse {

  private String accessToken;
  private String tokenType = "Bearer";
  private Long userId;
  private String userName;
  private String role;
}
