import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contact {
  id?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  // For now use a placeholder base URL; replace with real API endpoint.
  private baseUrl = '/contacts';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }
  
  createContact(a: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, a);
  }
  
  updateContact(a: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}?id=${a.id}`, a);
  }

  getContactById(contactId: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}?id=${contactId}`);
  }
}
