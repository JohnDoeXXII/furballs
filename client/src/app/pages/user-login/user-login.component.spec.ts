import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { UserLoginComponent } from './user-login.component';
import { UserService, LoginResponse } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { TestUser } from '../../../test-resources/test-user.model';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login form with username and password fields', () => {
    expect(component.loginForm.get('username')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should mark form as invalid when fields are empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid when fields are filled', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call userService.login on form submit', () => {
    const mockResponse: LoginResponse = {
      token: 'fake-jwt-token',
      user: TestUser.createUser({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      })
    };

    spyOn(userService, 'login').and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });

    component.login();

    expect(userService.login).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('should show error message on login failure', () => {
    spyOn(userService, 'login').and.returnValue(
      throwError(() => ({ status: 401, message: 'Unauthorized' }))
    );

    component.loginForm.patchValue({
      username: 'testuser',
      password: 'wrongpassword'
    });

    component.login();

    expect(component.error).toBe('Invalid username or password');
    expect(component.loading).toBeFalsy();
  });

  it('should set loading to true during login', () => {
    const mockResponse: LoginResponse = {
      token: 'fake-jwt-token',
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }
    };

    spyOn(userService, 'login').and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });

    component.login();
    
    expect(component.loading).toBeFalsy(); // After successful login
  });
});
