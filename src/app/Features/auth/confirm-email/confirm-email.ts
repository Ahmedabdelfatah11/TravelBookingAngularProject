import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Auth } from '../../../Service/auth';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './confirm-email.html',
  styleUrls: ['./confirm-email.css'],
})
export class ConfirmEmail {
  confirmForm: FormGroup = new FormGroup({
    userId: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
  });

  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;

  constructor(private auth: Auth, private route: ActivatedRoute, private router: Router) {
    // Initialize the form with query parameters
    const queryParams = this.route.snapshot.queryParams;
    this.confirmForm.patchValue({
      userId: queryParams['userId'],
      code: queryParams['code']
    });
    // Clear query parameters from the URL after patching the form
    if (queryParams['userId'] && queryParams['code']) {
      this.router.navigate([], {
        replaceUrl: true,
        queryParams: {} // Clear query parameters from the URL
      });
      // Automatically submit confirmation if userId and code are present
      // this.submitConfirmation(); 
    }
  }


  submitConfirmation() {
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }
    this.isLoading = true; // Start loading spinner
    const { userId, code } = this.confirmForm.value;

    this.auth.confirmEmail(userId, code).subscribe({
      next: res => {
        this.message = 'Email confirmed successfully. You can now login.';
        this.isError = false;
        this.isLoading = false; // Stop loading spinner
        // Navigate after a delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: err => {
        this.isError = true;
        this.message = 'Email confirmation failed. Please try again.';
        this.isLoading = false; // Stop loading spinner
        console.error(err);
      }
    });
  }
}
