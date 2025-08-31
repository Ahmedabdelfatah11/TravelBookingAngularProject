// src/Service/profile-state.service.ts

import { Injectable, signal } from '@angular/core';
import { Profile } from '../Models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileStateService {
  private profileSignal = signal<Profile | null>(null);

  profile = this.profileSignal.asReadonly();
  setProfile(profile: Profile | null) {
    this.profileSignal.set(profile);
  }

  clearProfile() {
    this.profileSignal.set(null);
  }
}