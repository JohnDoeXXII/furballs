package org.furballs.domain;

import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/animals/{id}")
    public AnimalDto getAnimal(@PathVariable("id") String id) {
      return repository.findById(UUID.fromString(id))
          .map(AnimalDto::from)
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

    @PutMapping("/animals/{id}")
    public AnimalDto updateAnimal(@PathVariable("id") String id, @RequestBody AnimalDto dto) {
      Animal updatedAnimal = Animal.from(dto);
      repository.save(updatedAnimal);
      return repository.findById(UUID.fromString(id))
          .map(AnimalDto::from)
          .orElseThrow();
    }
}
