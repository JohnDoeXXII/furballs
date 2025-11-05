package org.furballs.domain;

import java.time.Year;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.furballs.rest.AnimalDto;

import java.util.*;
import java.util.logging.Logger;

@Controller
@RestController
public class AnimalEndpoint {

  Logger logger = Logger.getLogger("AnimalController");

  @Autowired
  private AnimalRepository repository;

  @GetMapping("/animals")
  public List<AnimalDto> getAnimals() {
    Iterable<Animal> animals = repository.findAll();
    if(animals instanceof List) {
      return ((List<Animal>) animals).stream().map(AnimalDto::from).toList();
    } else {
      // TODO: Clean this
      throw new RuntimeException("oops");
    }
  }

  @GetMapping(path = "/animals", params = "id")
  public AnimalDto getMaxIdFromYear(@RequestParam String id) {
    return repository.findById(UUID.fromString(id))
        .map(AnimalDto::from)
        .orElseThrow();
  }

  // Hard coding to current shelters generator -- will redo this
  @GetMapping(path = "/animals/maxId")
  public @ResponseBody String getMaxId() {
    return repository.findByShelterIdContaining(Year.now().getValue() - 2000 + "-")
        .stream()
        .map(Animal::getShelterId)
        .map(str -> str.split("-")[1])
        .map(Integer::valueOf)
        .max(Integer::compareTo)
        .map(max -> (Year.now().getValue() - 2000) + "-" + String.format("%03d", max))
        .orElseThrow();
  }

  @PostMapping("/animals")
  public AnimalDto saveAnimal(@RequestBody AnimalDto dto) {
    Animal newAnimal = Animal.from(dto);
    newAnimal.setId(UUID.randomUUID());
    repository.save(newAnimal);
    logger.warning(newAnimal.toString());

    return repository.findById(newAnimal.getId())
        .map(AnimalDto::from)
        .orElseThrow();
  }

  @PutMapping(path="/animals", params = "id")
  public AnimalDto updateAnimal(@RequestParam("id") String id, @RequestBody AnimalDto dto) {
    Animal updatedAnimal = Animal.from(dto);
    repository.save(updatedAnimal);
    return repository.findById(UUID.fromString(id))
        .map(AnimalDto::from)
        .orElseThrow();
  }
}
