import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Auth } from '../../../Service/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true
})
export class Login implements OnInit {
  auth = inject(Auth);
  router = inject(Router);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);

  errMessage = '';
  successMessage = '';
  showPassword = false;
  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit() {
    // Check if user is already logged in
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }

    // Check for Google auth error
    const error = this.route.snapshot.queryParamMap.get('error');
    if (error === 'google_auth_failed') {
      this.errMessage = 'Google authentication failed. Please try again.';
    }
  }

  loginWithGoogle() {
    this.errMessage = ''; // Clear any previous errors
    this.auth.GoogleLogin();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submitForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errMessage = '';
    this.successMessage = '';

    const email = this.loginForm.get('email')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';
    
    this.auth.Login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errMessage = error.error?.message || 'Login failed';
        this.loginForm.get('password')?.reset();
      }
    });
  }
}