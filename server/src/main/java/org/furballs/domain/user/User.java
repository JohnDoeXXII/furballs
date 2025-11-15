package org.furballs.domain.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.Objects;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity(name = "users")
public class User {

  @Id
  private UUID id;

  private String username;

  private String email;

  private String firstName;

  private String lastName;

  private String role;

  private String passwordHash;

  private LocalDateTime passwordUpdateTimestamp;

  // exposed for hibernate and testing
  public User() {

  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public LocalDateTime getPasswordUpdateTimestamp() {
    return passwordUpdateTimestamp;
  }

  public void setPasswordUpdateTimestamp(LocalDateTime passwordUpdateTimestamp) {
    this.passwordUpdateTimestamp = passwordUpdateTimestamp;
  }

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    User user = (User) o;
    return Objects.equals(id, user.id)
        && Objects.equals(username, user.username)
        && Objects.equals(email, user.email)
        && Objects.equals(firstName, user.firstName)
        && Objects.equals(lastName, user.lastName)
        && Objects.equals(role, user.role)
        && Objects.equals(passwordHash, user.passwordHash)
        && Objects.equals(passwordUpdateTimestamp, user.passwordUpdateTimestamp);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, username, email, firstName, lastName, role, passwordHash, passwordUpdateTimestamp);
  }

  @Override
  public String toString() {
    return "User{"
        + "id=" + id
        + ", username='" + username + '\''
        + ", email='" + email + '\''
        + ", firstName='" + firstName + '\''
        + ", lastName='" + lastName + '\''
        + ", role='" + role + '\''
        + ", passwordHash='" + passwordHash + '\''
        + ", passwordUpdateTimestamp=" + passwordUpdateTimestamp
        + '}';
  }
}
