package org.furballs.domain.user;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
public interface UserRepository extends CrudRepository<User, UUID> {
  Optional<User> findByUsername(String username);
}
