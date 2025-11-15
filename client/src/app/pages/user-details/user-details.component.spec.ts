import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserDetailsComponent } from './user-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, from } from 'rxjs';

describe('UserDetailsComponent', () => {
  let fixture: any;
  let component: UserDetailsComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['create', 'getById', 'update']);
    userServiceSpy.getById.and.returnValue(from(Promise.resolve({
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'admin'
    })));

    await TestBed.configureTestingModule({
      imports: [UserDetailsComponent, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: (_: any) => '1' }), snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('username field tests', () => {
    it('should exist', () => {
      expect(component.userForm.get('username')).toBeTruthy();
    });

    it('should be required and invalid when empty', () => {
      const usernameControl = component.userForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.hasError('required')).toBeTrue();
    });

    it('should be valid when set with a value', () => {
      const usernameControl = component.userForm.get('username');
      usernameControl?.setValue('jdoe');
      expect(usernameControl?.valid).toBeTrue();
    });
  });

  describe('email field tests', () => {
    it('should exist', () => {
      expect(component.userForm.get('email')).toBeTruthy();
    });

    it('should be required and invalid when empty', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBeTrue();
    });

    it('should be invalid when not a valid email', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('notanemail');
      expect(emailControl?.hasError('email')).toBeTrue();
    });

    it('should be valid when set with a valid email', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('john.doe@example.com');
      expect(emailControl?.valid).toBeTrue();
    });
  });

  describe('firstName field tests', () => {
    it('should exist', () => {
      expect(component.userForm.get('firstName')).toBeTruthy();
    });

    it('should be required and invalid when empty', () => {
      const firstNameControl = component.userForm.get('firstName');
      firstNameControl?.setValue('');
      expect(firstNameControl?.hasError('required')).toBeTrue();
    });

    it('should be valid when set with a value', () => {
      const firstNameControl = component.userForm.get('firstName');
      firstNameControl?.setValue('John');
      expect(firstNameControl?.valid).toBeTrue();
    });
  });

  describe('lastName field tests', () => {
    it('should exist', () => {
      expect(component.userForm.get('lastName')).toBeTruthy();
    });

    it('should be required and invalid when empty', () => {
      const lastNameControl = component.userForm.get('lastName');
      lastNameControl?.setValue('');
      expect(lastNameControl?.hasError('required')).toBeTrue();
    });

    it('should be valid when set with a value', () => {
      const lastNameControl = component.userForm.get('lastName');
      lastNameControl?.setValue('Doe');
      expect(lastNameControl?.valid).toBeTrue();
    });
  });
});
