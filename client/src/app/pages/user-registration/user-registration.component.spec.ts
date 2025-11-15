import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserRegistrationComponent } from './user-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ContactService } from '../../services/contact.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('UserRegistrationComponent', () => {
  let fixture: any;
  let component: UserRegistrationComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let contactServiceSpy: jasmine.SpyObj<ContactService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['create']);
    contactServiceSpy = jasmine.createSpyObj('ContactService', ['createContact']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserRegistrationComponent, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: UserService, useValue: userServiceSpy },
        { provide: ContactService, useValue: contactServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form field tests', () => {
    it('should have all required fields', () => {
      expect(component.registrationForm.get('username')).toBeTruthy();
      expect(component.registrationForm.get('email')).toBeTruthy();
      expect(component.registrationForm.get('firstName')).toBeTruthy();
      expect(component.registrationForm.get('lastName')).toBeTruthy();
      expect(component.registrationForm.get('password')).toBeTruthy();
      expect(component.registrationForm.get('confirmPassword')).toBeTruthy();
    });

    it('should validate required fields', () => {
      const form = component.registrationForm;
      expect(form.valid).toBeFalse();

      form.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        confirmPassword: 'password123'
      });

      expect(form.valid).toBeTrue();
    });

    it('should validate email format', () => {
      const emailControl = component.registrationForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTrue();

      emailControl?.setValue('valid@example.com');
      expect(emailControl?.hasError('email')).toBeFalse();
    });

    it('should validate password minimum length', () => {
      const passwordControl = component.registrationForm.get('password');
      passwordControl?.setValue('short');
      expect(passwordControl?.hasError('minlength')).toBeTrue();

      passwordControl?.setValue('longenough');
      expect(passwordControl?.hasError('minlength')).toBeFalse();
    });
  });

  describe('registration tests', () => {
    it('should register user successfully', () => {
      const createdUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      };
      const createdContact = {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      };

      userServiceSpy.create.and.returnValue(of(createdUser));
      contactServiceSpy.createContact.and.returnValue(of(createdContact));

      component.registrationForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        confirmPassword: 'password123'
      });

      component.registerUser();

      expect(userServiceSpy.create).toHaveBeenCalled();
      expect(contactServiceSpy.createContact).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '',
        userId: '1'
      });
      expect(component.success).toBeTrue();
      expect(component.error).toBeNull();
    });

    it('should show error when passwords do not match', () => {
      component.registrationForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        confirmPassword: 'differentpassword'
      });

      component.registerUser();

      expect(component.error).toBe('Passwords do not match');
      expect(userServiceSpy.create).not.toHaveBeenCalled();
    });

    it('should show error when form is invalid', () => {
      component.registrationForm.patchValue({
        username: '',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        confirmPassword: 'password123'
      });

      component.registerUser();

      expect(component.error).toBe('Please fill in all required fields correctly');
      expect(userServiceSpy.create).not.toHaveBeenCalled();
    });

    it('should handle registration error', () => {
      userServiceSpy.create.and.returnValue(throwError(() => new Error('Registration failed')));

      component.registrationForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        confirmPassword: 'password123'
      });

      component.registerUser();

      expect(component.error).toBe('Failed to register user. Please try again.');
      expect(component.loading).toBeFalse();
    });

    it('should handle contact creation error', () => {
      const createdUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      };

      userServiceSpy.create.and.returnValue(of(createdUser));
      contactServiceSpy.createContact.and.returnValue(throwError(() => new Error('Contact creation failed')));

      component.registrationForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
        confirmPassword: 'password123'
      });

      component.registerUser();

      expect(userServiceSpy.create).toHaveBeenCalled();
      expect(contactServiceSpy.createContact).toHaveBeenCalled();
      expect(component.error).toBe('Failed to register user. Please try again.');
      expect(component.loading).toBeFalse();
    });

    it('should create contact with correct information from user registration', () => {
      const createdUser = {
        id: '2',
        username: 'anotheruser',
        email: 'another@example.com',
        firstName: 'Another',
        lastName: 'Person'
      };
      const createdContact = {
        id: '2',
        firstName: 'Another',
        lastName: 'Person',
        email: 'another@example.com'
      };

      userServiceSpy.create.and.returnValue(of(createdUser));
      contactServiceSpy.createContact.and.returnValue(of(createdContact));

      component.registrationForm.patchValue({
        username: 'anotheruser',
        email: 'another@example.com',
        firstName: 'Another',
        lastName: 'Person',
        password: 'securepass123',
        confirmPassword: 'securepass123'
      });

      component.registerUser();

      expect(contactServiceSpy.createContact).toHaveBeenCalledWith({
        firstName: 'Another',
        lastName: 'Person',
        email: 'another@example.com',
        phone: '',
        userId: '2'
      });
      expect(component.success).toBeTrue();
    });
  });

  describe('navigation tests', () => {
    it('should navigate to user list on cancel', () => {
      component.cancel();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/userz']);
    });
  });
});
