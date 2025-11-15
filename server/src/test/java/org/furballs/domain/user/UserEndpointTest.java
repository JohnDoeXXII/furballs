package org.furballs.domain.user;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.furballs.rest.LoginRequestDto;
import org.furballs.rest.LoginResponseDto;
import org.furballs.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@ExtendWith(MockitoExtension.class)
class UserEndpointTest {

  @Mock
  private UserRepository repository;

  @Mock
  private JwtService jwtService;

  @InjectMocks
  private UserEndpoint userEndpoint;

  private User testUser;
  private UUID testUserId;
  private String testUsername;
  private String testPassword;
  private String testPasswordHash;
  private LocalDateTime passwordTimestamp;

  @BeforeEach
  void setUp() {
    testUserId = UUID.randomUUID();
    testUsername = "testuser";
    testPassword = "password123";
    passwordTimestamp = LocalDateTime.of(2025, 11, 14, 12, 0, 0);
    testPasswordHash = hashPassword(testPassword, passwordTimestamp);

    testUser = new User();
    testUser.setId(testUserId);
    testUser.setUsername(testUsername);
    testUser.setEmail("test@example.com");
    testUser.setFirstName("Test");
    testUser.setLastName("User");
    testUser.setAdmin(false);
    testUser.setPasswordHash(testPasswordHash);
    testUser.setPasswordUpdateTimestamp(passwordTimestamp);
  }

  @Test
  void testLogin_Success() {
    // Arrange
    LoginRequestDto loginRequest = new LoginRequestDto();
    loginRequest.setUsername(testUsername);
    loginRequest.setPassword(testPassword);

    String expectedToken = "fake-jwt-token-12345";

    when(repository.findByUsername(testUsername)).thenReturn(Optional.of(testUser));
    when(jwtService.generateToken(testUserId, testUsername, false)).thenReturn(expectedToken);

    // Act
    ResponseEntity<?> response = userEndpoint.login(loginRequest);

    // Assert
    assertNotNull(response);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
    LoginResponseDto body = (LoginResponseDto) response.getBody();
    assertEquals(expectedToken, body.getToken());
    assertEquals(testUsername, body.getUser().getUsername());
    assertEquals(testUserId, body.getUser().getId());

    verify(repository).findByUsername(testUsername);
    verify(jwtService).generateToken(testUserId, testUsername, false);
  }

  @Test
  void testLogin_UserNotFound() {
    // Arrange
    LoginRequestDto loginRequest = new LoginRequestDto();
    loginRequest.setUsername("nonexistentuser");
    loginRequest.setPassword(testPassword);

    when(repository.findByUsername("nonexistentuser")).thenReturn(Optional.empty());

    // Act
    ResponseEntity<?> response = userEndpoint.login(loginRequest);

    // Assert
    assertNotNull(response);
    assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    assertNull(response.getBody());

    verify(repository).findByUsername("nonexistentuser");
    verify(jwtService, never()).generateToken(any(), any(), anyBoolean());
  }

  @Test
  void testLogin_InvalidPassword() {
    // Arrange
    LoginRequestDto loginRequest = new LoginRequestDto();
    loginRequest.setUsername(testUsername);
    loginRequest.setPassword("wrongpassword");

    when(repository.findByUsername(testUsername)).thenReturn(Optional.of(testUser));

    // Act
    ResponseEntity<?> response = userEndpoint.login(loginRequest);

    // Assert
    assertNotNull(response);
    assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    assertNull(response.getBody());

    verify(repository).findByUsername(testUsername);
    verify(jwtService, never()).generateToken(any(), any(), anyBoolean());
  }

  @Test
  void testLogin_NullUsername() {
    // Arrange
    LoginRequestDto loginRequest = new LoginRequestDto();
    loginRequest.setUsername(null);
    loginRequest.setPassword(testPassword);

    when(repository.findByUsername(null)).thenReturn(Optional.empty());

    // Act
    ResponseEntity<?> response = userEndpoint.login(loginRequest);

    // Assert
    assertNotNull(response);
    assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    assertNull(response.getBody());
  }

  @Test
  void testLogin_NullPassword() {
    // Arrange
    LoginRequestDto loginRequest = new LoginRequestDto();
    loginRequest.setUsername(testUsername);
    loginRequest.setPassword(null);

    when(repository.findByUsername(testUsername)).thenReturn(Optional.of(testUser));

    // Act
    ResponseEntity<?> response = userEndpoint.login(loginRequest);

    // Assert - Null password results in hash mismatch, so 401 UNAUTHORIZED
    assertNotNull(response);
    assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    assertNull(response.getBody());
  }

  @Test
  void testLogin_UserAsNonAdmin() {
    // Arrange
    testUser.setAdmin(false);
    LoginRequestDto loginRequest = new LoginRequestDto();
    loginRequest.setUsername(testUsername);
    loginRequest.setPassword(testPassword);

    String expectedToken = "fake-jwt-token-12345";

    when(repository.findByUsername(testUsername)).thenReturn(Optional.of(testUser));
    when(jwtService.generateToken(testUserId, testUsername, false)).thenReturn(expectedToken);

    // Act
    ResponseEntity<?> response = userEndpoint.login(loginRequest);

    // Assert
    assertNotNull(response);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
    LoginResponseDto body = (LoginResponseDto) response.getBody();
    assertEquals(expectedToken, body.getToken());

    verify(jwtService).generateToken(testUserId, testUsername, false);
  }

  @Test
  void testLogin_VerifyPasswordHashingConsistency() {
    // Arrange
    LoginRequestDto loginRequest = new LoginRequestDto();
    loginRequest.setUsername(testUsername);
    loginRequest.setPassword(testPassword);

    when(repository.findByUsername(testUsername)).thenReturn(Optional.of(testUser));
    when(jwtService.generateToken(any(), any(), anyBoolean())).thenReturn("token");

    // Act
    ResponseEntity<?> response = userEndpoint.login(loginRequest);

    // Assert - Login should succeed because password hash matches
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  @Test
  void testLogin_PasswordHashChangesWithDifferentTimestamp() {
    // Arrange
    LocalDateTime differentTimestamp = LocalDateTime.of(2025, 11, 15, 12, 0, 0);
    String differentHash = hashPassword(testPassword, differentTimestamp);
    
    // Password hash should be different with different timestamp
    assertNotEquals(testPasswordHash, differentHash);
  }

  // Helper method to replicate the password hashing logic from UserEndpoint
  private String hashPassword(String password, LocalDateTime timestamp) {
    try {
      String combined = password + timestamp.toString();
      java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(combined.getBytes(java.nio.charset.StandardCharsets.UTF_8));
      StringBuilder hexString = new StringBuilder();
      for (byte b : hash) {
        String hex = Integer.toHexString(0xff & b);
        if (hex.length() == 1) hexString.append('0');
        hexString.append(hex);
      }
      return hexString.toString();
    } catch (java.security.NoSuchAlgorithmException e) {
      throw new RuntimeException("Error hashing password", e);
    }
  }
}
