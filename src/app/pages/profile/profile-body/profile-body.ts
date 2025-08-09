import { Component, inject, Input, signal } from '@angular/core';
import { Auth } from '../../../Service/auth';
import { Bookings } from "../bookings/bookings";
import { Profile, ProfileParams } from '../../../Models/profile';
import { ProfileService } from '../../../Service/profile-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { last } from 'rxjs';

@Component({
  selector: 'app-profile-body',
  imports: [Bookings,DatePipe,FormsModule],
  templateUrl: './profile-body.html',
  styleUrl: './profile-body.css'
})
export class ProfileBody {
   activeTab = signal<string>('account');
  userProfile = signal<Profile| null>(null);

  editFirstName =signal<boolean>(false);
  editLastName = signal<boolean>(false);
  editAddress = signal<boolean>(false)
  editPhone = signal<boolean>(false);
  editDateOfBirth = signal<boolean>(false);
  editableProfile: Partial<Profile> = {};

  authService = inject(Auth);
  profileService = inject(ProfileService);
  constructor() {}
  ngOnInit() {
    this.loadUserProfile();
  }
  loadUserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        console.log('User profile loaded:', profile);
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
      }
    });
  }
  toggleEdit(field: string): void {
    const editFun = (param: string, editSignal: { (): boolean; set: (value: boolean) => void }) => {
      if (editSignal()) {
        // Save changes
        const updated: ProfileParams = {
          ...this.userProfile()!,
          [param]: this.editableProfile[param as keyof Profile]!,
        };
        this.profileService.updateProfile(updated).subscribe({
          next: (updatedProfile) => {
            this.userProfile.set(updatedProfile.user);
            editSignal.set(false);
            console.log('Profile updated:', updatedProfile);
            this.loadUserProfile();
          },
          error: (err) => {
            console.error('Failed to update profile:', err);
          }
        });
      } else {
        editSignal.set(true);
      }
    };

    if (field === 'fname') {
      editFun('firstName', this.editFirstName);
    }
    if (field === 'lname') {
      editFun('lastName', this.editLastName);
    }
    if (field === 'address') {
      editFun('address', this.editAddress);
    }
    if (field === 'phone') {
      editFun('phone', this.editPhone);
    }
    if (field === 'dateOfBirth') {
      editFun('dateOfBirth', this.editDateOfBirth);
    }
  }
  openModal(field: string): void {
    console.log(`Open modal for ${field}`);
    // Add logic to open a modal for editing the field
  }
}
