package org.furballs.domain.contact;

import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
interface ContactRepository extends CrudRepository<Contact, UUID> { }
