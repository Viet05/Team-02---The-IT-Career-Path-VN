package com.team02.backend.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.team02.backend.entity.Users;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtUtils {

  @Value("${jwt.secret}")
  private String SECRET_KEY;

  private static final String ISSUES = "The It Career Path VN Web backend";

  public String generateToken(Users user) {

    JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

    JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
        .subject(user.getUsername())
        .issuer(ISSUES)
        .issueTime(new Date())
        .expirationTime(Date.from(Instant.now().plus(5, ChronoUnit.DAYS)))
        .claim("role", user.getRole())
        .claim("usersId", user.getUserId())
        .build();

    JWSObject jwsObject = new JWSObject(header, new Payload(claimsSet.toJSONObject()));

    try {
      jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
      return jwsObject.serialize();
    } catch (Exception e) {
      log.error("Error generating token", e);
      throw new RuntimeException("Error generating token", e);
    }
  }

  public boolean validateToken(String token) {

    try {
      JWSObject jwsObject = JWSObject.parse(token);
      JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

      if (!jwsObject.verify(verifier)) {
        log.error("Invalid token");
        return false;
      }

      JWTClaimsSet claimsSet = JWTClaimsSet.parse(jwsObject.getPayload().toJSONObject());

      if (claimsSet.getExpirationTime().before(new Date())) {
        log.error("Expired token");
        return false;
      }

      return true;
    } catch (Exception e) {
      log.error("Error validating token", e);
      return false;
    }
  }

  public String getUsernameFromToken(String token) {

    try {
      JWSObject jwsObject = JWSObject.parse(token);
      JWTClaimsSet claimsSet = JWTClaimsSet.parse(jwsObject.getPayload().toJSONObject());
      return claimsSet.getSubject();
    } catch (Exception e) {
      log.error("Can't get username from token", e);
      throw new RuntimeException("Can't get username from token", e);
    }
  }
}
