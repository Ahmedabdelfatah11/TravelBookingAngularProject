import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavBar } from "../../shared/nav-bar/nav-bar"; 
import { ContactService } from '../../core/services/contact-service';
import { CommonModule } from '@angular/common';
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [NavBar, CommonModule,ReactiveFormsModule, Footer],
  templateUrl: './contactus.html',
  styleUrls: ['./contactus.css']
})

export class Contactus  {
  contactForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false; 

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      subject: [''],
      message: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: () => {
        this.successMessage = 'Message sent successfully!';
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to send message. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
