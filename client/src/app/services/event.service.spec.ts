import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventService, Event } from './event.service';
import { provideHttpClient } from '@angular/common/http';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should GET /events', () => {
    const mock: Event[] = [{ id: '1', name: 'e', description: 'd', startDatetime: '2025-01-01T00:00:00Z' } as Event];

    service.getAll().subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne('/events');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getById() should GET /events/:id', () => {
    const mock: Event = { id: '123', name: 'e', description: 'd', startDatetime: '2025-01-01T00:00:00Z' } as Event;

    service.getById('123').subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne('/events/123');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create() should POST to /events', () => {
    const payload: Event = { id: '', name: 'new', description: 'd', startDatetime: '2025-01-01T00:00:00Z' } as Event;

    service.create(payload).subscribe(res => expect(res).toEqual(payload));

    const req = httpMock.expectOne('/events');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('update() should PUT to /events/:id', () => {
    const payload: Event = { id: '321', name: 'up', description: 'd', startDatetime: '2025-01-01T00:00:00Z' } as Event;

    service.update('321', payload).subscribe(res => expect(res).toEqual(payload));

    const req = httpMock.expectOne('/events/321');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('delete() should DELETE /events/:id', () => {
    service.delete('999').subscribe(res => expect(res).toBeNull());

    const req = httpMock.expectOne('/events/999');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
