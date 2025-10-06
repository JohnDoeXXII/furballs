package org.furballs.domain;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
interface AnimalRepository extends CrudRepository<Animal, UUID> {
}
