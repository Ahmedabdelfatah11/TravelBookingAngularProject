import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../Service/auth';
import { Bookings } from "../bookings/bookings";

@Component({
  selector: 'app-profile-body',
  imports: [Bookings],
  templateUrl: './profile-body.html',
  styleUrl: './profile-body.css'
})
export class ProfileBody {
   activeTab = signal<string>('account');
  user = signal({
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    phoneNumber: '+1 000-000-0000',
    address: 'St 32 main downtown, Los Angeles, California, USA',
    dateOfBirth: '01-01-1992'
  });

  authService = inject(Auth);
  constructor() {}

  openModal(field: string): void {
    console.log(`Open modal for ${field}`);
    // Add logic to open a modal for editing the field
  }
}
