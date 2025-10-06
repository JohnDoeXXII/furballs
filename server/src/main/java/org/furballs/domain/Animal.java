package org.furballs.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.furballs.rest.AnimalDto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity(name = "animals")
public class Animal {

    @Id
    private UUID id;

    private String shelterId;

    private String name;

    private LocalDate dob;

    private String type;

    private List<String> notes;

    // exposed for hibernate
    Animal() {

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getShelterId() {
        return shelterId;
    }

    public void setShelterId(String shelterId) {
        this.shelterId = shelterId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<String> getNotes() {
        return notes;
    }

    public void setNotes(List<String> notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "Animal{" +
                "id=" + id +
                ", shelterId='" + shelterId + '\'' +
                ", name='" + name + '\'' +
                ", dob=" + dob +
                ", type='" + type + '\'' +
                ", notes=" + notes +
                '}';
    }

    static Animal from(AnimalDto dto) {
        Animal animal = new Animal();
        animal.id = dto.getId();
        animal.shelterId = dto.getShelterId();
        animal.name = dto.getName();
        animal.dob = dto.getDob();
        animal.notes = dto.getNotes();
        return animal;
    }
}
