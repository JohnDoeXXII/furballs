package org.furballs.domain.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.furballs.rest.EventDto;

import java.util.*;
import java.util.stream.StreamSupport;
import java.util.logging.Logger;

@Controller
@RestController
public class EventEndpoint {

  Logger logger = Logger.getLogger("EventController");

  @Autowired
  private EventRepository repository;

  @GetMapping("/events")
  public List<EventDto> getEvents() {
    Iterable<Event> events = repository.findAll();
    if (events instanceof List) {
      return ((List<Event>) events).stream().map(EventDto::from).toList();
    } else {
      return StreamSupport.stream(events.spliterator(), false)
          .map(EventDto::from)
          .toList();
    }
  }

  @GetMapping(path = "/events", params = "id")
  public EventDto getEventById(@RequestParam String id) {
    return repository.findById(UUID.fromString(id))
        .map(EventDto::from)
        .orElseThrow();
  }

  @PostMapping("/events")
  public EventDto createEvent(@RequestBody EventDto eventDto) {
    Event event = new Event();
    event.setId(UUID.randomUUID());
    event.setName(eventDto.getName());
    event.setDescription(eventDto.getDescription());
    event.setStartDatetime(eventDto.getStartDatetime());
    event.setEndDatetime(eventDto.getEndDatetime());
    Event saved = repository.save(event);
    return EventDto.from(saved);
  }

  @PutMapping("/events/{id}")
  public EventDto updateEvent(@PathVariable String id, @RequestBody EventDto eventDto) {
    UUID eventId = UUID.fromString(id);
    Event event = repository.findById(eventId).orElseThrow();
    event.setName(eventDto.getName());
    event.setDescription(eventDto.getDescription());
    event.setStartDatetime(eventDto.getStartDatetime());
    event.setEndDatetime(eventDto.getEndDatetime());
    Event saved = repository.save(event);
    return EventDto.from(saved);
  }

  @DeleteMapping("/events/{id}")
  public void deleteEvent(@PathVariable String id) {
    repository.deleteById(UUID.fromString(id));
  }
}
