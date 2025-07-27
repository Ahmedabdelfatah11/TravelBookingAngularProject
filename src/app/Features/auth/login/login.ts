import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../Service/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true
})
export class Login {
  auth = inject(Auth);
  router = inject(Router);
  fb = inject(FormBuilder);

  errMessage = '';
  successMessage = '';
  showPassword = false;
  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
//  submitForm() {
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       return;
//     } 
//     this.isLoading = true; // Start loading spinner

//     const { email, password } = this.loginForm.value;

//     this.errMessage = '';
//     this.successMessage = '';

//     this.auth.Login({ email, password }).subscribe({
//       next: (response) => {
//         if (response.message === 'Login successful') {
//           this.successMessage = response.message || 'Login successful!';
//           this.isLoading = false; // Stop loading spinner
//           setTimeout(() => {
//             this.router.navigate(['/home']);
//           }, 2000);
//         } else {
//           this.errMessage = response.message || 'Login failed. Please try again.';
//           this.isLoading = false; // Stop loading spinner
//           this.loginForm.get('password')?.reset();
//         }
//       },
//       error: (error) => {
//         console.log("Error Response:", error);
//         this.errMessage = error.error?.message || 'Login failed. Please try again.';
//         this.isLoading = false; // Stop loading spinner
//         this.loginForm.get('password')?.reset();
//       }
//     });
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
        this.successMessage = response.message;
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (error) => {
        this.errMessage = error.error?.message || 'Login failed';
        this.isLoading = false;
        this.loginForm.get('password')?.reset();
      }
    });
  }
}





// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, RouterLink, RouterModule } from '@angular/router';
// import { Auth } from '../../../Service/auth'; 

// @Component({
//   selector: 'app-login', 
//   imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class Login {

//   errMessage: string = '';
//   successMessage: string = '';
//   showPassword: boolean = false;
  
//   isLoading: boolean = false;

//   constructor(private auth: Auth, private router: Router) {}

//   loginForm: FormGroup = new FormGroup({
//     email: new FormControl('', [Validators.required, Validators.email]),
//     password: new FormControl('', [Validators.required]), 
//   }); 

//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   submitForm() {
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       return;
//     } 
//     this.isLoading = true; // Start loading spinner

//     const { email, password } = this.loginForm.value;

//     this.errMessage = '';
//     this.successMessage = '';

//     this.auth.Login({ email, password }).subscribe({
//       next: (response) => {
//         if (response.message === 'Login successful') {
//           this.successMessage = response.message || 'Login successful!';
//           this.isLoading = false; // Stop loading spinner
//           setTimeout(() => {
//             this.router.navigate(['/home']);
//           }, 2000);
//         } else {
//           this.errMessage = response.message || 'Login failed. Please try again.';
//           this.isLoading = false; // Stop loading spinner
//           this.loginForm.get('password')?.reset();
//         }
//       },
//       error: (error) => {
//         console.log("Error Response:", error);
//         this.errMessage = error.error?.message || 'Login failed. Please try again.';
//         this.isLoading = false; // Stop loading spinner
//         this.loginForm.get('password')?.reset();
//       }
//     });
//   }
// }
