package com.team02.backend.security;

import com.team02.backend.entity.Users;
import java.util.Collection;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@RequiredArgsConstructor
public class CustomUserDetail implements UserDetails {

  private final Users user;
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singletonList(
        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
    );
  }

  public Long getId() {
    return user.getUserId();
  }

  // @Override
  // public String getPassword() {
  //   return "";
  // }

  // @Override
  // public String getUsername() {
  //   return "";
  // }
  @Override
  public String getPassword() {
    return user.getPassword(); 
  }

  @Override
  public String getUsername() {
    return user.getUsername();
  }

  @Override
  public boolean isAccountNonExpired() { return true; }

  @Override
  public boolean isAccountNonLocked() { return true; }

  @Override
  public boolean isCredentialsNonExpired() { return true; }

  @Override
  public boolean isEnabled() { return true; }
}
