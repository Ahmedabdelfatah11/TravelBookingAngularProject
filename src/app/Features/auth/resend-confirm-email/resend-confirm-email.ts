import { Auth } from './../../../Service/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resend-confirmation-email',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './resend-confirm-email.html',
  styleUrls: ['./resend-confirm-email.css'],
})
export class ResendConfirmationEmail {
  errMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private auth: Auth) {}

  resendForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  submitForm() {
    if (this.resendForm.invalid) {
      this.resendForm.markAllAsTouched();
      return;
    }
    this.isLoading = true; // Start loading spinner

    const emailValue = this.resendForm.value.email;

    this.auth.ResendConfirmationEmail(emailValue).subscribe({
      next: (response) => {
        console.log('Resend confirmation email response: ', response);
        this.successMessage = 'Confirmation email sent successfully!';
        this.isLoading = false; // Stop loading spinner
        this.errMessage = '';
      },
      error: (error) => {
        console.error("Resend Confirmation Email Error", error);
        this.errMessage = error.error?.message || 'Failed to resend confirmation email.';
        this.isLoading = false; // Stop loading spinner
        this.successMessage = '';
      }
    });
  }
}
