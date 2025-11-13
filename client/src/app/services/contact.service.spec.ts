import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactService, Contact } from './contact.service';
import { provideHttpClient } from '@angular/common/http';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getContacts() should GET /contacts', () => {
    const mock: Contact[] = [{ firstName: 'A', lastName: 'B' } as Contact];
    service.getContacts().subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne('/contacts');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('createContact() should POST /contacts', () => {
    const payload: Contact = { firstName: 'X', lastName: 'Y' } as Contact;
    service.createContact(payload).subscribe(res => expect(res).toEqual(payload));

    const req = httpMock.expectOne('/contacts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('updateContact() should PUT with id query param', () => {
    const payload: Contact = { id: '5', firstName: 'X', lastName: 'Y' } as Contact;
    service.updateContact(payload).subscribe(res => expect(res).toEqual(payload));

    const req = httpMock.expectOne('/contacts?id=5');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(payload);
  });

  it('getContactById() should GET with id query param', () => {
    const mock: Contact = { id: '9', firstName: 'F', lastName: 'L' } as Contact;
    service.getContactById('9').subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne('/contacts?id=9');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
