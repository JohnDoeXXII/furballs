package org.furballs.domain.user;

import java.time.temporal.ChronoUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.furballs.rest.UserDto;
import org.furballs.rest.RegisterUserDto;
import org.furballs.rest.LoginRequestDto;
import org.furballs.rest.LoginResponseDto;
import org.furballs.security.JwtService;
import org.furballs.security.AuthenticationContext;
import org.furballs.security.AdminOnly;

import java.util.*;
import java.util.stream.StreamSupport;
import java.util.logging.Logger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Controller
@RestController
public class UserEndpoint {

  Logger logger = Logger.getLogger("UserController");

  @Autowired
  private UserRepository repository;

  @Autowired
  private JwtService jwtService;

  @Autowired
  private AuthenticationContext authenticationContext;

  @GetMapping("/users")
  @AdminOnly
  public List<UserDto> getUsers() {
    Iterable<User> users = repository.findAll();
    if (users instanceof List) {
      return ((List<User>) users).stream().map(UserDto::from).toList();
    } else {
      return StreamSupport.stream(users.spliterator(), false)
          .map(UserDto::from)
          .toList();
    }
  }

  @GetMapping(path = "/users/{id}")
  public UserDto getUserById(@PathVariable String id) {
    return repository.findById(UUID.fromString(id))
        .map(UserDto::from)
        .orElseThrow();
  }

  @PutMapping("/users/{id}")
  @AdminOnly
  public UserDto updateUser(@PathVariable String id, @RequestBody UserDto userDto) {
    UUID userId = UUID.fromString(id);
    User user = repository.findById(userId).orElseThrow();
    user.setUsername(userDto.getUsername());
    user.setEmail(userDto.getEmail());
    user.setFirstName(userDto.getFirstName());
    user.setLastName(userDto.getLastName());
    user.setAdmin(userDto.isAdmin());
    User saved = repository.save(user);
    return UserDto.from(saved);
  }

  @DeleteMapping("/users/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable String id) {
    // Get authenticated user from context
    User authenticatedUser = authenticationContext.getCurrentUser();
    
    if (authenticatedUser == null) {
      logger.warning("Delete user attempt failed: No authenticated user");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body("Authentication required");
    }

    UUID requestedUserId = UUID.fromString(id);
    
    // Verify that the authenticated user is deleting their own account
    if (!authenticatedUser.getId().equals(requestedUserId)) {
      logger.warning("Delete user attempt failed: User " + authenticatedUser.getId() + 
          " attempted to delete user " + requestedUserId);
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body("You can only delete your own account");
    }
    
    // Verify user exists before deleting
    if (!repository.existsById(requestedUserId)) {
      logger.warning("Delete user attempt failed: User " + requestedUserId + " not found");
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body("User not found");
    }
    
    // Perform deletion
    repository.deleteById(requestedUserId);
    logger.info("User deleted successfully: " + requestedUserId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/users/register")
  @AdminOnly
  public UserDto registerUser(@RequestBody RegisterUserDto registerDto) {
    User user = new User();
    LocalDateTime now = LocalDateTime.now();
    user.setId(UUID.randomUUID());
    user.setUsername(registerDto.getUsername());
    user.setEmail(registerDto.getEmail());
    user.setFirstName(registerDto.getFirstName());
    user.setLastName(registerDto.getLastName());
    user.setAdmin(registerDto.isAdmin());
    user.setPasswordUpdateTimestamp(now);

    // Hash the password before storing
    if (registerDto.getPassword() != null && !registerDto.getPassword().isEmpty()) {
      user.setPasswordHash(hashPassword(registerDto.getPassword(), now));
    } else {
      throw new IllegalArgumentException("Password cannot be null or empty");
    }

    User saved = repository.save(user);
    return UserDto.from(saved);
  }

  @PostMapping("/users/login")
  public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
    return repository.findByUsername(loginRequest.getUsername())
            .map(user -> {
              String hashedPassword = hashPassword(loginRequest.getPassword(), user.getPasswordUpdateTimestamp());

              if (!hashedPassword.equals(user.getPasswordHash())) {
                logger.warning("Login attempt failed: Invalid password for user - " + loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
              }
              // Generate JWT token
              String token = jwtService.generateToken(user.getId(), user.getUsername(), user.isAdmin());

              // Create response with token and user details
              UserDto userDto = UserDto.from(user);
              LoginResponseDto response = new LoginResponseDto(token, userDto);

              logger.info("User logged in successfully: " + user.getUsername());
              return ResponseEntity.ok(response);
            })
        .orElseGet(() -> {
          logger.warning("Login attempt failed: User not found - " + loginRequest.getUsername());
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        });

  }

  private String hashPassword(String password, LocalDateTime timestamp) {
    try {
      String combined = password + timestamp.truncatedTo(ChronoUnit.MILLIS).toString();
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(combined.getBytes(StandardCharsets.UTF_8));
      StringBuilder hexString = new StringBuilder();
      for (byte b : hash) {
        String hex = Integer.toHexString(0xff & b);
        if (hex.length() == 1) hexString.append('0');
        hexString.append(hex);
      }
      return hexString.toString();
    } catch (NoSuchAlgorithmException e) {
      logger.severe("Error hashing password: " + e.getMessage());
      throw new RuntimeException("Error hashing password", e);
    }
  }
}
