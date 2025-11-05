package org.furballs.domain;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
interface AnimalRepository extends CrudRepository<Animal, UUID> {
  List<Animal> findByShelterIdContaining(String id);
}
