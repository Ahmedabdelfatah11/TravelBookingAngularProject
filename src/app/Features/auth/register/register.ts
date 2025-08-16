import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../Service/auth';
import { Router, RouterModule } from '@angular/router';
import { strongPasswordValidator } from '../../../custom-validators';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, HttpClientModule],
})
export class Register {

  showPassword: boolean = false;
  isLoading: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Define the error message variable
  errMessage: string = '';
  successMessage: string = '';
  // Inject the Auth service in the constructor
  constructor(private auth: Auth, private router: Router, private cdRef: ChangeDetectorRef) { }
  //create Form Group
  registerForm: FormGroup = new FormGroup({
    FirstName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    UserName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]),
    PhoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    Address: new FormControl('', [Validators.required]),
    DateOfBirth: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required, strongPasswordValidator])

  },);

  //submit form
  submitForm() {
    console.log("Form Submitted", this.registerForm.value);
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errMessage = ''; // Clear previous error message
    this.successMessage = ''; // Clear previous success message
    this.auth.Register(this.registerForm.value).pipe(
      finalize(() => {
        // سيتم تنفيذ هذا دائماً، سواء نجحت العملية أم فشلت
        this.isLoading = false;
      })
    ).subscribe({
      next: (response) => {
        console.log('Full response: ', response);
        if (response.message === 'User registered successfully. Please confirm your email.') {
          this.isLoading = false;
          this.successMessage = "Registration successful! Please check your email to confirm.";
        }
        else {
          this.isLoading = false; // Stop loading spinner
          this.errMessage = response.message || 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        console.error("Register Error", error);
        this.errMessage = error.error.message || 'Registration failed. Please try again.';
        this.isLoading = false; // Stop loading spinner
      },


    });
  }

}
