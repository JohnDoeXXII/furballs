import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { UserRegistration } from '../../models/user.model';
import { catchError, map, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {

  @Input("readMode")
  readMode: boolean = false;

  @Input("userId")
  public userId: string | null = null;

  userForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    role: new FormControl('')
  });

  user$: Observable<User> | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      if (this.userId) {
        this.loadUser();
      }
    });
  }

  private loadUser() {
    if (!this.userId) return;

    this.loading = true;
    this.user$ = this.userService.getById(this.userId).pipe(
      map(user => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin || ''
        });
        this.loading = false;
        return user;
      }),
      catchError(err => {
        this.error = 'Failed to load user';
        this.loading = false;
        throw err;
      })
    );
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (!this.userId) {
      this.error = 'Cannot save without a user ID';
      return;
    }

    const formValue = this.userForm.value;
    const user: UserRegistration = {
      id: this.userId,
      username: formValue.username,
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      isAdmin: formValue.isAdmin || '',
      password: formValue.password || ''
    };

    this.userService.update(this.userId, user)
        .pipe(
            catchError(err => {
              this.error = 'Failed to update user';
              throw err;
            })
        )
        .subscribe(() => {
            this.router.navigate(['/userz']);
        });
  }

  cancel() {
    this.router.navigate(['/userz']);
  }
}
