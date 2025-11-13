package org.furballs.domain.contact;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.Objects;
import java.util.UUID;
import org.hibernate.annotations.Parent;

@Entity(name = "contact_information")
public class ContactInformation {

  @Id
  private UUID id;

  private String type;
  private String value;

  // exposed for hibernate
  ContactInformation() {

  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getType() {
    return type;
  }

  public String getValue() {
    return value;
  }

  public void setType(String type) {
    this.type = type;
  }

  public void setValue(String value) {
    this.value = value;
  }

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ContactInformation that = (ContactInformation) o;
    return Objects.equals(type, that.type)
        && Objects.equals(id, that.id)
        && Objects.equals(value, that.value);
  }

  @Override
  public int hashCode() {
    return Objects.hash(type, value);
  }

  @Override
  public String toString() {
    return "ContactInformation{" +
        ", id='" + id + '\'' +
        ", type='" + type + '\'' +
        ", value='" + value + '\'' +
        '}';
  }
}

