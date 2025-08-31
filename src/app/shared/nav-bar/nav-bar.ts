import { Component, inject, Input, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../Service/auth';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../Service/profile-service';
import { Profile } from '../../Models/profile';
import { ProfileStateService } from '../../Service/profile-state-service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.html',
  standalone: true,
  styleUrl: './nav-bar.css'
})

export class NavBar {
  @Input() isSpecialPage = false;
  auth = inject(Auth);
  router = inject(Router);
  profileService = inject(ProfileService);
  profileState = inject(ProfileStateService);

  profileImageUrl = signal<string | null>(null);

  // ✅ Use effect to react to signal changes
  private autoUpdateImage = effect(() => {
    const profile = this.profileState.profile(); 
    if (profile?.profilePictureUrl) {
      this.profileImageUrl.set(
        profile.profilePictureUrl.startsWith('http')
          ? profile.profilePictureUrl
          : `http://pyramigo.runasp.net${profile.profilePictureUrl.replace(/^\/+/, '/')}`
      );
    } else {
      this.profileImageUrl.set(null);
    }
  });

  constructor() {
    // Load profile if not already loaded
    if (this.auth.isLoggedIn() && !this.profileState.profile()) {
      this.profileService.getProfile().subscribe();
    }
  }

  logout() {
    this.profileState.clearProfile();
    this.auth.Logout();
    this.router.navigate(['/login']);
  }
}