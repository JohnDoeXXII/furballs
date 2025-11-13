import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Animal {
  name: string;
  id: string;
  shelterId: string;
  type: 'Cat' | 'Dog';
  dateOfIntake: string; // YYYY-MM-DD
  dateOfBirth?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class AnimalService {
  // For now use a placeholder base URL; replace with real API endpoint.
  private baseUrl = '/animals';

  constructor(private http: HttpClient) {}

  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.baseUrl);
  }

  /**
   * Get a single animal by id. Uses RESTful `/animals/{id}` path.
   */
  getAnimalById(id: string): Observable<Animal> {
    return this.http.get<Animal>(`${this.baseUrl}/${id}`);
  }

  /**
   * Alias for `getAnimals()` to match other services naming.
   */
  getAll(): Observable<Animal[]> {
    return this.getAnimals();
  }

  getMaxShelterId(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/maxId`, { responseType: 'text' as 'json' });
  }

  createAnimal(a: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.baseUrl, a);
  }

  /**
   * Alias for `createAnimal`.
   */
  create(a: Animal): Observable<Animal> {
    return this.createAnimal(a);
  }

  /**
   * Update an animal by id. Accepts either an id+body or an Animal with an `id`.
   */
  update(id: string, a: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.baseUrl}/${id}`, a);
  }

  updateAnimal(a: Animal): Observable<Animal> {
    return this.update(a.id, a);
  }

  /**
   * Delete an animal by id.
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
