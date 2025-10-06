package org.furballs.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    public List<AnimalDto> test() {
        Iterable<Animal> animals = repository.findAll();
        if(animals instanceof List) {
            return ((List<Animal>) animals).stream().map(AnimalDto::from).toList();
        } else {
            // TODO: Clean this
            throw new RuntimeException("oops");
        }
    }

    @PostMapping("/animals")
    public String testSave(@RequestBody AnimalDto dto) {
        Animal newAnimal = Animal.from(dto);
        newAnimal.setId(UUID.randomUUID());
        repository.save(newAnimal);
        logger.warning(newAnimal.toString());
        return "Saved " + newAnimal.getName() + "; total = " + repository.count();
    }
}
