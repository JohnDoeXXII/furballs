package org.furballs.security;

import static org.junit.jupiter.api.Assertions.*;

import io.jsonwebtoken.Claims;

import org.checkerframework.checker.units.qual.t;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.UUID;

class JwtServiceTest {

  private JwtService jwtService;
  private UUID testUserId;
  private String testUsername;
  private boolean isAdmin;

  @BeforeEach
  void setUp() {
    jwtService = new JwtService();
    testUserId = UUID.randomUUID();
    testUsername = "testuser";
    isAdmin = true;
  }

  @Test
  void testGenerateToken() {
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    
    assertNotNull(token);
    assertFalse(token.isEmpty());
    assertTrue(token.split("\\.").length == 3); // JWT has 3 parts separated by dots
  }

  @Test
  void testExtractUsername() {
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    String extractedUsername = jwtService.extractUsername(token);
    
    assertEquals(testUsername, extractedUsername);
  }

  @Test
  void testExtractUserId() {
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    UUID extractedUserId = jwtService.extractUserId(token);
    
    assertEquals(testUserId, extractedUserId);
  }

  @Test
  void testExtractIsAdmin() {
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    Boolean extractedIsAdmin = jwtService.extractIsAdmin(token);
    
    assertEquals(isAdmin, extractedIsAdmin);
  }

  @Test
  void testExtractExpiration() {
    Date beforeGeneration = new Date();
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    Date afterGeneration = new Date();
    
    Date expiration = jwtService.extractExpiration(token);
    
    assertNotNull(expiration);
    assertTrue(expiration.after(beforeGeneration));
    // Token should expire in approximately 24 hours
    long expectedExpiry = afterGeneration.getTime() + (24 * 60 * 60 * 1000);
    long actualExpiry = expiration.getTime();
    assertTrue(Math.abs(expectedExpiry - actualExpiry) < 5000); // Within 5 seconds
  }

  @Test
  void testValidateToken_ValidToken() {
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    
    Boolean isValid = jwtService.validateToken(token, testUsername);
    
    assertTrue(isValid);
  }

  @Test
  void testValidateToken_WrongUsername() {
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    
    Boolean isValid = jwtService.validateToken(token, "wronguser");
    
    assertFalse(isValid);
  }

  @Test
  void testTokenContainsAllClaims() {
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    
    String extractedUsername = jwtService.extractUsername(token);
    UUID extractedUserId = jwtService.extractUserId(token);
    Boolean extractedIsAdmin = jwtService.extractIsAdmin(token);
    
    assertEquals(testUsername, extractedUsername);
    assertEquals(testUserId, extractedUserId);
    assertEquals(isAdmin, extractedIsAdmin);
  }

  @Test
  void testExtractClaim_CustomClaim() {
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    
    String userId = jwtService.extractClaim(token, claims -> claims.get("userId", String.class));
    
    assertEquals(testUserId.toString(), userId);
  }

  @Test
  void testTokenIssuedAtIsBeforeExpiration() {
    String token = jwtService.generateToken(testUserId, testUsername, isAdmin);
    
    Date issuedAt = jwtService.extractClaim(token, Claims::getIssuedAt);
    Date expiration = jwtService.extractExpiration(token);
    
    assertTrue(issuedAt.before(expiration));
  }

  @Test
  void testTokenWithDifferentUsers() {
    UUID userId1 = UUID.randomUUID();
    UUID userId2 = UUID.randomUUID();
    String username1 = "user1";
    String username2 = "user2";
    
    String token1 = jwtService.generateToken(userId1, username1, false);
    String token2 = jwtService.generateToken(userId2, username2, true);
    
    assertEquals(username1, jwtService.extractUsername(token1));
    assertEquals(username2, jwtService.extractUsername(token2));
    assertEquals(userId1, jwtService.extractUserId(token1));
    assertEquals(userId2, jwtService.extractUserId(token2));
    assertEquals(false, jwtService.extractIsAdmin(token1));
    assertEquals(true, jwtService.extractIsAdmin(token2));
  }
}
