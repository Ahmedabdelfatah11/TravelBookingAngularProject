import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../Service/auth';

@Component({
  selector: 'app-google-callback',
  template: `
    <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh;">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Signing you in with Google...</p>
      </div>
    </div>
  `
})
export class GoogleCallback implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);

  ngOnInit() {
    this.handleGoogleCallback();
  }

  private handleGoogleCallback() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const username = this.route.snapshot.queryParamMap.get('username');
    const roles = this.route.snapshot.queryParamMap.get('roles');

    if (token && username) {
      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', username); // Using username as userId for Google login
      
      // Parse and store roles properly
      if (roles) {
        try {
          // Roles come as comma-separated string, convert to array
          const roleArray = roles.split(',').map(role => role.trim());
          localStorage.setItem('roles', JSON.stringify(roleArray));
        } catch (error) {
          console.error('Error parsing roles:', error);
          localStorage.setItem('roles', JSON.stringify([]));
        }
      } else {
        localStorage.setItem('roles', JSON.stringify(['User'])); // Default role
      }

      // Small delay to ensure localStorage is set before navigation
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 100);
    } else {
      console.error('Missing token or username in Google callback');
      this.router.navigate(['/login'], { 
        queryParams: { error: 'google_auth_failed' } 
      });
    }
  }
}