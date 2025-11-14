package org.furballs.domain.user;

import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
interface UserRepository extends CrudRepository<User, UUID> {
}
