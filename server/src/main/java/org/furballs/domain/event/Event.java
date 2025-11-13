package org.furballs.domain.event;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.Objects;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "events")
public class Event {

  @Id
  private UUID id;

  private String name;

  private String description;

  private LocalDateTime startDatetime;

  private LocalDateTime endDatetime;

  // exposed for hibernate
  Event() {

  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public LocalDateTime getStartDatetime() {
    return startDatetime;
  }

  public void setStartDatetime(LocalDateTime startDatetime) {
    this.startDatetime = startDatetime;
  }

  public LocalDateTime getEndDatetime() {
    return endDatetime;
  }

  public void setEndDatetime(LocalDateTime endDatetime) {
    this.endDatetime = endDatetime;
  }

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Event event = (Event) o;
    return Objects.equals(id, event.id)
        && Objects.equals(name, event.name)
        && Objects.equals(description, event.description)
        && Objects.equals(startDatetime, event.startDatetime)
        && Objects.equals(endDatetime, event.endDatetime);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, description, startDatetime, endDatetime);
  }

  @Override
  public String toString() {
    return "Event{"
        + "id=" + id
        + ", name='" + name + '\''
        + ", description='" + description + '\''
        + ", startDatetime=" + startDatetime
        + ", endDatetime=" + endDatetime
        + '}';
  }
}
