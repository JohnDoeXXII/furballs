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

  getAnimalById(id: string): Observable<Animal> {
    return this.http.get<Animal>(`${this.baseUrl}/${id}`);
  }

  createAnimal(a: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.baseUrl, a);
  }

  updateAnimal(a: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.baseUrl}/${a.id}`, a);
  }
}
