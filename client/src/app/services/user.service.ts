import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserRegistration } from '../models/user.model';
import { SessionService } from './session.service';

export type { User };

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = '/users';
  private readonly JWT_TOKEN_KEY = 'jwt_token';

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  create(user: UserRegistration): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/register', user);
  }

  update(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { username, password };
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.token) {
            this.sessionService.setSession(response);
          }
        })
      );
  }
}
