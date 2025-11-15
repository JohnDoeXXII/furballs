import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ContactService } from '../../services/contact.service';
import { Router } from '@angular/router';
import { UserRegistration } from '../../models/user.model';
import { Contact } from '../../models/contact.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-registration.component.html'
})
export class UserRegistrationComponent {

  registrationForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private userService: UserService,
    private contactService: ContactService,
    private router: Router
  ) {}

  registerUser() {
    if (this.registrationForm.invalid) {
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    const formValue = this.registrationForm.value;

    // Check if passwords match
    if (formValue.password !== formValue.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const userRegistration: UserRegistration = {
      id: '',
      username: formValue.username,
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      isAdmin: formValue.isAdmin || undefined,
      password: formValue.password
    };

    this.loading = true;
    this.error = null;

    this.userService.create(userRegistration).pipe(
      switchMap((createdUser) => {
        // Create corresponding contact information linked to the user
        const contact: Contact = {
          firstName: userRegistration.firstName,
          lastName: userRegistration.lastName,
          email: userRegistration.email,
          phone: userRegistration.phone,
          userId: createdUser.id
        };
        return this.contactService.createContact(contact);
      })
    ).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.router.navigate(['/userz']);
      },
      error: (err) => {
        this.error = 'Failed to register user. Please try again.';
        this.loading = false;
        console.error('Registration error:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/userz']);
  }
}
