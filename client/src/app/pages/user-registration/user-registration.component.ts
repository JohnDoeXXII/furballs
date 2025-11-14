import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserRegistration } from '../../models/user.model';

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
    role: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private userService: UserService,
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
      role: formValue.role || undefined,
      password: formValue.password
    };

    this.loading = true;
    this.error = null;

    this.userService.create(userRegistration).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/userz']);
        }, 2000);
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
