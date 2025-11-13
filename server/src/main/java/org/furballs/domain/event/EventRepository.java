package org.furballs.domain.event;

import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
interface EventRepository extends CrudRepository<Event, UUID> {
}
