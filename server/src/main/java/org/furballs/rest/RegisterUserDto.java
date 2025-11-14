package org.furballs.rest;

public class RegisterUserDto extends UserDto {

  private String password;

  public RegisterUserDto() {
    super();
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  @Override
  public String toString() {
    return "RegisterUserDto{"
        + "id=" + getId()
        + ", username='" + getUsername() + '\''
        + ", email='" + getEmail() + '\''
        + ", firstName='" + getFirstName() + '\''
        + ", lastName='" + getLastName() + '\''
        + ", role='" + getRole() + '\''
        + ", password='[REDACTED]'"
        + '}';
  }
}
