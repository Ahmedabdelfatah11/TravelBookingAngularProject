import { routes } from './../../../app.routes';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../Service/auth';
import { HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './forget-password.html',
  styleUrls: ['./forget-password.css']
})
export class ForgetPassword {
  errMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private auth: Auth, private router: Router) { }

  forgetForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  submitForm() {
    if (this.forgetForm.invalid) {
      this.forgetForm.markAllAsTouched();
      return;
    }
    this.isLoading = true; // Start loading spinner
    const email = this.forgetForm.value;
    this.errMessage = '';
    this.successMessage = '';

    this.auth.ForgetPassword(this.forgetForm.value).pipe(
      finalize(() => {
        // سيتم تنفيذ هذا دائماً، سواء نجحت العملية أم فشلت
        this.isLoading = false;
      })
    ).subscribe({
      next: (response) => {
        if (response.message === "Password reset link has been sent to your email.") {
          this.successMessage = "reset link has been sent to your email.Please check your email to reset Password."
          //   setTimeout(() => {
          //   this.router.navigate(['/reset']);
          // }, 2000);
          this.isLoading = false; // Stop loading spinner
        }
        else {
          this.errMessage = response.message || 'Please try again.';
          this.isLoading = false; // Stop loading spinner
        }
      },
      error: (error) => {
        this.errMessage = error.error.message || 'Reset failed. Please try again.';
        this.isLoading = false; // Stop loading spinner
      }
    });
  }

}