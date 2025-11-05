package org.furballs.rest;

import org.furballs.domain.Animal;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

public class AnimalDto {

  private UUID id;

  private String shelterId;

  private String name;

  private LocalDate dateOfBirth;

  private String type;

  private String notes;


  public UUID getId() {
    return id;
  }

  public String getShelterId() {
    return shelterId;
  }

  public String getName() {
    return name;
  }

  public LocalDate getDateOfBirth() {
    return dateOfBirth;
  }

  public String getType() {
    return type;
  }

  public String getNotes() {
    return notes;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public void setShelterId(String shelterId) {
    this.shelterId = shelterId;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setDateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public void setType(String type) {
    this.type = type;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AnimalDto animalDto = (AnimalDto) o;
    return Objects.equals(id, animalDto.id)
        && Objects.equals(shelterId, animalDto.shelterId)
        && Objects.equals(name, animalDto.name)
        && Objects.equals(dateOfBirth, animalDto.dateOfBirth)
        && Objects.equals(type, animalDto.type)
        && Objects.equals(notes, animalDto.notes);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, shelterId, name, dateOfBirth, type, notes);
  }

  @Override
  public String toString() {
    return "AnimalDto{" +
        "id=" + id +
        ", shelterId='" + shelterId + '\'' +
        ", name='" + name + '\'' +
        ", dateOfBirth=" + dateOfBirth +
        ", type='" + type + '\'' +
        ", notes=" + notes +
        '}';
  }

  public static AnimalDto from(Animal animal) {
    AnimalDto dto = new AnimalDto();
    dto.setId(animal.getId());
    dto.setShelterId(animal.getShelterId());
    dto.setType(animal.getType());
    dto.setName(animal.getName());
    dto.setNotes(animal.getNotes());
    dto.setDateOfBirth(animal.getDob());
    return dto;
  }
}
