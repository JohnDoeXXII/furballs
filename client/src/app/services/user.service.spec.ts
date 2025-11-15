import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService, LoginResponse } from './user.service';
import { User, UserRegistration } from '../models/user.model';
import { SessionService } from './session.service';
import { TestUser } from '../../test-resources/test-user.model';

describe('UserService', () => {
  const MOCK_USER: User = { 
    id: '2', 
    username: 'user2', 
    email: 'user2@example.com', 
    firstName: 'Second', 
    lastName: 'User', 
    isAdmin: false
  };    
  let service: UserService;
  let httpMock: HttpTestingController;
  let sessionServiceSpy: jasmine.SpyObj<SessionService>;

  beforeEach(() => {
    sessionServiceSpy = jasmine.createSpyObj('SessionService', ['setSession']); 
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: SessionService, useValue: sessionServiceSpy as SessionService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', () => {
    const mockUsers: User[] = [
      TestUser.createUser(),
      MOCK_USER
    ];

    service.getAll().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get user by id', () => {
    const mockUser = TestUser.createUser();

    service.getById('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create a user', () => {
    const createdUser: UserRegistration = { ...MOCK_USER, password: '3' };

    service.create(createdUser).subscribe(user => {
      expect(user).toEqual(createdUser);
    });

    const req = httpMock.expectOne('/users/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createdUser);
    req.flush(createdUser);
  });

  it('should update a user', () => {
    const updatedUser: User = { id: '1', username: 'updateduser', email: 'updated@example.com', firstName: 'Updated', lastName: 'User' };

    service.update('1', updatedUser).subscribe(user => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne('/users/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('should login a user and store JWT token', () => {
    const loginResponse: LoginResponse = {
      token: 'fake-jwt-token-12345',
      user: MOCK_USER
    };

    spyOn(localStorage, 'setItem');

    service.login('user2', 'password123').subscribe(response => {
      expect(response).toEqual(loginResponse);
      expect(sessionServiceSpy.setSession).toHaveBeenCalledWith(loginResponse);
    });

    const req = httpMock.expectOne('/users/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'user2', password: 'password123' });
    req.flush(loginResponse);
  });
});
