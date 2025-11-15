package org.furballs.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.furballs.domain.user.User;

import java.util.Objects;
import java.util.UUID;

public class UserDto {

  private UUID id;

  private String username;

  private String email;

  private String firstName;

  private String lastName;

  @JsonProperty("isAdmin")
  private boolean isAdmin;

  public UserDto() {
  }

  public UserDto(User user) {
    this.id = user.getId();
    this.username = user.getUsername();
    this.email = user.getEmail();
    this.firstName = user.getFirstName();
    this.lastName = user.getLastName();
    this.isAdmin = user.isAdmin();
  }

  public static UserDto from(User user) {
    return new UserDto(user);
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

  public boolean isAdmin() {
    return isAdmin;
  }

  public void setAdmin(boolean admin) {
    isAdmin = admin;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    UserDto userDto = (UserDto) o;
    return Objects.equals(id, userDto.id)
        && Objects.equals(username, userDto.username)
        && Objects.equals(email, userDto.email)
        && Objects.equals(firstName, userDto.firstName)
        && Objects.equals(lastName, userDto.lastName)
        && isAdmin == userDto.isAdmin;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, username, email, firstName, lastName, isAdmin);
  }

  @Override
  public String toString() {
    return "UserDto{"
        + "id=" + id
        + ", username='" + username + '\"'
        + ", email='" + email + '\"'
        + ", firstName='" + firstName + '\"'
        + ", lastName='" + lastName + '\"'
        + ", isAdmin=" + isAdmin
        + '}';
  }
}
