import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User, UserRegistration } from '../models/user.model';

describe('UserService', () => {
  const MOCK_USER: User = { 
    id: '2', 
    username: 'user2', 
    email: 'user2@example.com', 
    firstName: 'Second', 
    lastName: 'User', 
    role: 'user' 
  };    
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
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
      { id: '1', username: 'user1', email: 'user1@example.com', firstName: 'First', lastName: 'User', role: 'admin' },
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
    const mockUser: User = { id: '1', username: 'user1', email: 'user1@example.com', firstName: 'First', lastName: 'User', role: 'admin' };

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

  it('should delete a user', () => {
    service.delete('1').subscribe(() => {
      expect(true).toBe(true);
    });

    const req = httpMock.expectOne('/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
