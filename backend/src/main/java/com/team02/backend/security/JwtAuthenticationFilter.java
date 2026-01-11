package com.team02.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  JwtUtils jwtUtils;
  CustomUserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    try {
      String token = getTokenFromRequest(request);

      if (token != null && jwtUtils.validateToken(token)) {

        String username = jwtUtils.getUsernameFromToken(token);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

          UserDetails userDetails = userDetailsService.loadUserByUsername(username);
          UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
             userDetails, null, userDetails.getAuthorities()
          );
          authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

          SecurityContextHolder.getContext().setAuthentication(authentication);
        }
      }
    } catch (Exception e) {
      throw new ServletException(e);
    }
    filterChain.doFilter(request, response);
  }

  public String getTokenFromRequest(HttpServletRequest request) {

    String bearerToken = request.getHeader("Authorization");

    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }
}
