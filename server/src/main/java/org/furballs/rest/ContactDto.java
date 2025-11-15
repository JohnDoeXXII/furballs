package org.furballs.rest;

import java.util.Objects;
import org.furballs.domain.contact.Contact;

public class ContactDto {

  public String firstName;
  public String lastName;
  public String phone;
  public String email;
  public String id;
  public String userId;

  public static ContactDto from(Contact contact) {
    ContactDto out = new ContactDto();
    out.id = contact.getId().toString();
    out.firstName = contact.getFirstName();
    out.lastName = contact.getLastName();
    out.phone = contact.getPhone();
    out.email = contact.getEmail();
    out.userId = contact.getUserId() != null ? contact.getUserId().toString() : null;
    return out;
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

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ContactDto that = (ContactDto) o;
    return Objects.equals(firstName, that.firstName)
        && Objects.equals(lastName, that.lastName)
        && Objects.equals(phone, that.phone)
        && Objects.equals(email, that.email)
        && Objects.equals(id, that.id)
        && Objects.equals(userId, that.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, firstName, lastName, phone, email, userId);
  }

  @Override
  public String toString() {
    return "ContactDto{" +
        "firstName='" + firstName + '\'' +
        ", lastName='" + lastName + '\'' +
        ", phone='" + phone + '\'' +
        ", email='" + email + '\'' +
        ", id=" + id +
        ", userId=" + userId +
        '}';
  }
}
