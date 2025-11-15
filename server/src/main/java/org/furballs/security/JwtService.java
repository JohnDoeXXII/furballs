package org.furballs.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {

  // In production, this should be stored in environment variables or configuration
  // For JWT 2.0 (assuming you mean JJWT 0.12.x), we need a strong secret key
  private static final String SECRET_KEY = "furballs-super-secret-key-that-is-at-least-256-bits-long-for-hs256-algorithm";
  
  // Token validity: 24 hours
  private static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60 * 1000;

  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
  }

  public String generateToken(UUID userId, String username, boolean isAdmin) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("userId", userId.toString());
    claims.put("username", username);
    claims.put("isAdmin", isAdmin);
    
    return createToken(claims, username);
  }

  private String createToken(Map<String, Object> claims, String subject) {
    Date now = new Date();
    Date expirationDate = new Date(now.getTime() + JWT_TOKEN_VALIDITY);

    return Jwts.builder()
        .claims(claims)
        .subject(subject)
        .issuedAt(now)
        .expiration(expirationDate)
        .signWith(getSigningKey())
        .compact();
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public UUID extractUserId(String token) {
    String userIdStr = extractClaim(token, claims -> claims.get("userId", String.class));
    return UUID.fromString(userIdStr);
  }

  public boolean extractIsAdmin(String token) {
    return extractClaim(token, claims -> claims.get("isAdmin", Boolean.class));
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  public Boolean validateToken(String token, String username) {
    final String extractedUsername = extractUsername(token);
    return (extractedUsername.equals(username) && !isTokenExpired(token));
  }
}
