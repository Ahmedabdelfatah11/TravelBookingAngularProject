// profile-body.component.ts

import { Component, inject, signal, afterNextRender } from '@angular/core';
import { Auth } from '../../../Service/auth';
import { Profile, ProfileParams } from '../../../Models/profile';
import { ProfileService } from '../../../Service/profile-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingBodyDetails } from '../../bookings/booking-body-details/booking-body-details';
import { ProfileStateService } from '../../../Service/profile-state-service';
import { ToastrService } from 'ngx-toastr'; // ✅ Import

@Component({
  selector: 'app-profile-body',
  imports: [DatePipe, FormsModule, BookingBodyDetails],
  templateUrl: './profile-body.html',
  styleUrls: ['./profile-body.css']
})
export class ProfileBody {
  activeTab = signal<string>('account');
  profileImagePreview = signal<string | null>(null);
  tempImageFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);

  editFirstName = signal<boolean>(false);
  editLastName = signal<boolean>(false);
  editAddress = signal<boolean>(false);
  editPhone = signal<boolean>(false);
  editDateOfBirth = signal<boolean>(false);

  editableProfile: Partial<Profile> = {};

  private profileState = inject(ProfileStateService);
  private authService = inject(Auth);
  private profileService = inject(ProfileService);
  private toastr = inject(ToastrService); // ✅ Inject

  userProfile = this.profileState.profile;

  constructor() {
    afterNextRender(() => {
      this.loadUserProfile();
    });
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.updateImagePreview(profile);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.toastr.error('Failed to load profile.', 'Error');
      }
    });
  }

  private updateImagePreview(profile: Profile): void {
    if (profile.profilePictureUrl) {
      const fullUrl = `http://pyramigo.runasp.net${profile.profilePictureUrl.replace(/^\/+/, '/')}`;
      this.profileImagePreview.set(fullUrl);
    } else {
      this.profileImagePreview.set(null);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      this.toastr.error('Please select a valid image (JPEG, PNG, WebP)', 'Invalid File');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImagePreview.set(reader.result as string);
      this.tempImageFile.set(file);
    };
    reader.readAsDataURL(file);
  }

  saveProfileImage(): void {
    const file = this.tempImageFile();
    if (!file) return;

    this.isUploading.set(true);

    this.profileService.uploadProfileImage(file).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.tempImageFile.set(null);
        this.loadUserProfile();
        this.toastr.success('Profile picture saved successfully!', 'Success');
      },
      error: (err) => {
        this.isUploading.set(false);
        console.error('Upload failed:', err);
        this.toastr.error('Failed to save image. Please try again.', 'Error');
      }
    });
  }

  cancelImageEdit(): void {
    this.tempImageFile.set(null);
    const currentProfile = this.userProfile();
    if (currentProfile?.profilePictureUrl) {
      const fullUrl = `http://pyramigo.runasp.net${currentProfile.profilePictureUrl.replace(/^\/+/, '/')}`;
      this.profileImagePreview.set(fullUrl);
    } else {
      this.profileImagePreview.set(null);
    }
  }

  toggleEdit(field: string): void {
    const editFun = (
      param: keyof Profile,
      editSignal: () => boolean,
      setter: (value: boolean) => void
    ) => {
      if (editSignal()) {
        const updated: ProfileParams = {
          ...this.userProfile()!,
          [param]: this.editableProfile[param]!
        };

        this.profileService.updateProfile(updated).subscribe({
          next: (response) => {
            const updatedUser = response.user;
            setter(false);
            this.toastr.success('Profile updated successfully!', 'Success');
          },
          error: (err) => {
            console.error('Update failed:', err);
            this.toastr.error('Failed to update profile.', 'Error');
          }
        });
      } else {
        this.editableProfile[param] = this.userProfile()?.[param] as any;
        setter(true);
      }
    };

    switch (field) {
      case 'fname': editFun('firstName', this.editFirstName, (v) => this.editFirstName.set(v)); break;
      case 'lname': editFun('lastName', this.editLastName, (v) => this.editLastName.set(v)); break;
      case 'address': editFun('address', this.editAddress, (v) => this.editAddress.set(v)); break;
      case 'phone': editFun('phone', this.editPhone, (v) => this.editPhone.set(v)); break;
      case 'dateOfBirth': editFun('dateOfBirth', this.editDateOfBirth, (v) => this.editDateOfBirth.set(v)); break;
    }
  }
}