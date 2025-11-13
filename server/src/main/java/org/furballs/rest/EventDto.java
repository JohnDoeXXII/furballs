package org.furballs.rest;

import org.furballs.domain.event.Event;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public class EventDto {

  private UUID id;

  private String name;

  private String description;

  private LocalDateTime startDatetime;

  private LocalDateTime endDatetime;

  public EventDto() {
  }

  public EventDto(Event event) {
    this.id = event.getId();
    this.name = event.getName();
    this.description = event.getDescription();
    this.startDatetime = event.getStartDatetime();
    this.endDatetime = event.getEndDatetime();
  }

  public static EventDto from(Event event) {
    return new EventDto(event);
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
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    EventDto eventDto = (EventDto) o;
    return Objects.equals(id, eventDto.id)
        && Objects.equals(name, eventDto.name)
        && Objects.equals(description, eventDto.description)
        && Objects.equals(startDatetime, eventDto.startDatetime)
        && Objects.equals(endDatetime, eventDto.endDatetime);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, description, startDatetime, endDatetime);
  }

  @Override
  public String toString() {
    return "EventDto{" +
        "id=" + id +
        ", name='" + name + '\'' +
        ", description='" + description + '\'' +
        ", startDatetime=" + startDatetime +
        ", endDatetime=" + endDatetime +
        '}';
  }
}
