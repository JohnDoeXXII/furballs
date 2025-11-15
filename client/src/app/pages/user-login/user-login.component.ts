import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-login.component.html'
})
export class UserLoginComponent {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  loading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  login() {
    if (this.loginForm.invalid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    const formValue = this.loginForm.value;
    this.loading = true;
    this.error = null;

    this.userService.login(formValue.username, formValue.password).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful:', response.user.username);
        this.router.navigate(['/animalz']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.error = 'Invalid username or password';
        } else {
          this.error = 'Login failed. Please try again.';
        }
        console.error('Login error:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/animalz']);
  }
}
