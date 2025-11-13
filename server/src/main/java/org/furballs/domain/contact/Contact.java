package org.furballs.domain.contact;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.UUID;
import org.furballs.rest.ContactDto;

@Entity(name = "contacts")
public class Contact {

  @Id
  private UUID id;

  private String firstName;
  private String lastName;
  private String phone;
  private String email;

  // exposed for hibernate
  Contact() {

  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
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

  static Contact from(ContactDto contact) {
    Contact out = new Contact();
    out.id = contact.getId() != null ? UUID.fromString(contact.getId()) : null;
    out.firstName = contact.getFirstName();
    out.lastName = contact.getLastName();
    out.phone = contact.getPhone();
    out.email = contact.getEmail();
    return out;
  }
}
