package org.furballs.domain.contact;

import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;
import org.furballs.rest.ContactDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
public class ContactEndpoint {

  Logger logger = Logger.getLogger("ContactEndpoint");

  @Autowired
  private ContactRepository repository;

  @GetMapping("/contacts")
  public List<ContactDto> getContacts() {
    Iterable<Contact> contacts = repository.findAll();
    if(contacts instanceof List) {
      return ((List<Contact>) contacts).stream().map(ContactDto::from).toList();
    } else {
      // TODO: Clean this
      throw new RuntimeException("oops");
    }
  }

  @PostMapping("/contacts")
  public ContactDto saveContact(@RequestBody ContactDto dto) {
    Contact newContact = Contact.from(dto);
    newContact.setId(UUID.randomUUID());
    repository.save(newContact);
    logger.warning(newContact.toString());

    return repository.findById(newContact.getId())
        .map(ContactDto::from)
        .orElseThrow();
  }

  @PutMapping(path="/contacts/{id}")
  public ContactDto updateContactById(@PathVariable("id") String id, @RequestBody ContactDto dto) {
    Contact updatedContact = Contact.from(dto);
    repository.save(updatedContact);
    return repository.findById(UUID.fromString(id))
        .map(ContactDto::from)
        .orElseThrow();
  }

  @GetMapping(path = "/contacts/{id}")
  public ContactDto getContactById(@PathVariable("id") String id) {
    return repository.findById(UUID.fromString(id))
        .map(ContactDto::from)
        .orElseThrow();
  }
}
