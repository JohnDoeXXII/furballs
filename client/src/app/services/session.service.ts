import { Injectable, signal } from '@angular/core';
import { LoginResponse, User } from './user.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private JWT_TOKEN_KEY = 'jwt_token_key';
  private JWT_TOKEN_BODY = 'jwt_token_body';
  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<User | null>(null);

  // Read-only signal for consumers
  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();

  constructor() {
    // Reconstitute session from localStorage if present
    const storedToken = localStorage.getItem(this.JWT_TOKEN_KEY);
    const storedUserJson = localStorage.getItem(this.JWT_TOKEN_BODY);

    if (storedToken) {
      this.tokenSignal.set(storedToken);
    }

    if (storedUserJson) {
      try {
        const user = JSON.parse(storedUserJson) as User;
        this.userSignal.set(user);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // Clear invalid data
        localStorage.removeItem(this.JWT_TOKEN_BODY);
      }
    }
  }
  
  setSession(loginResponse: LoginResponse): void {
    localStorage.setItem(this.JWT_TOKEN_KEY, loginResponse.token);
    localStorage.setItem(this.JWT_TOKEN_BODY, loginResponse.user ? JSON.stringify(loginResponse.user) : '');
    this.tokenSignal.set(loginResponse.token);
    this.userSignal.set(loginResponse.user);
  }
  
  clearSession(): void {
    localStorage.removeItem(this.JWT_TOKEN_KEY);
    localStorage.removeItem(this.JWT_TOKEN_BODY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }
}
