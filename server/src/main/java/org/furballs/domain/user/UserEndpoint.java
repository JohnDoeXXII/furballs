package org.furballs.domain.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.furballs.rest.UserDto;
import org.furballs.rest.RegisterUserDto;

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

  @GetMapping("/users")
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

  @PostMapping("/users")
  public UserDto createUser(@RequestBody UserDto userDto) {
    User user = new User();
    user.setId(UUID.randomUUID());
    user.setUsername(userDto.getUsername());
    user.setEmail(userDto.getEmail());
    user.setFirstName(userDto.getFirstName());
    user.setLastName(userDto.getLastName());
    user.setRole(userDto.getRole());
    User saved = repository.save(user);
    return UserDto.from(saved);
  }

  @PutMapping("/users/{id}")
  public UserDto updateUser(@PathVariable String id, @RequestBody UserDto userDto) {
    UUID userId = UUID.fromString(id);
    User user = repository.findById(userId).orElseThrow();
    user.setUsername(userDto.getUsername());
    user.setEmail(userDto.getEmail());
    user.setFirstName(userDto.getFirstName());
    user.setLastName(userDto.getLastName());
    user.setRole(userDto.getRole());
    User saved = repository.save(user);
    return UserDto.from(saved);
  }

  @DeleteMapping("/users/{id}")
  public void deleteUser(@PathVariable String id) {
    repository.deleteById(UUID.fromString(id));
  }

  @PostMapping("/users/register")
  public UserDto registerUser(@RequestBody RegisterUserDto registerDto) {
    User user = new User();
    LocalDateTime now = LocalDateTime.now();
    user.setId(UUID.randomUUID());
    user.setUsername(registerDto.getUsername());
    user.setEmail(registerDto.getEmail());
    user.setFirstName(registerDto.getFirstName());
    user.setLastName(registerDto.getLastName());
    user.setRole(registerDto.getRole());
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

  private String hashPassword(String password, LocalDateTime timestamp) {
    try {
      String combined = password + timestamp.toString();
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
