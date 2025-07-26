import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../Service/auth';
import { IResetPassword } from '../../../Interfaces/ireset-password'; 
import { strongPasswordValidator } from '../../../custom-validators';

@Component({
  selector: 'app-reset-password', 
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPassword { 
  successMessage = '';
  errorMessage = '';
  isLoading = false;

   showPassword: boolean = false;
    togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  constructor(private auth:Auth, private route: ActivatedRoute ,private router: Router){
    const queryParams = this.route.snapshot.queryParams;
    this.resetForm.patchValue({
      email:queryParams['email'],
      token:queryParams['token'] 
    });
    // Clear query parameters from the URL after patching the form
    if (queryParams['email'] && queryParams['token']) {
      this.router.navigate([], {
        replaceUrl: true,
        queryParams: {} // Clear query parameters from the URL
      });
    }

  }
  resetForm:FormGroup=new FormGroup({
    email:new FormControl('',[Validators.required, Validators.email]),
    token:new FormControl('',[Validators.required]),
    newPassword:new FormControl('',[Validators.required, strongPasswordValidator])
  })   

  submitForm() {
    if (this.resetForm.invalid){
      this.resetForm.markAllAsTouched();
      return;
    } 
    this.isLoading = true; // Start loading spinner
    const formData: IResetPassword = {
      email: this.resetForm.value.email,
      token: this.resetForm.value.token,
      newPassword: this.resetForm.get('newPassword')?.value
    };

    this.auth.ResetPassword(formData).subscribe({
      next: res => {
        this.successMessage = res.message || 'Password reset successfully'; 
        this.isLoading = false; // Stop loading spinner
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Reset password failed';
        this.isLoading = false; // Stop loading spinner
      }
    });
  }
}
