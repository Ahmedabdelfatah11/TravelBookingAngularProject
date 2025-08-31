// src/Service/profile-service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile, ProfileParams } from '../Models/profile';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // ✅ Add this import
import { ProfileStateService } from './profile-state-service'; // ✅ Import service

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://pyramigo.runasp.net/api/userProfile';

  // ✅ Inject ProfileStateService
  constructor(
    private http: HttpClient,
    private profileState: ProfileStateService
  ) {}

  private getAuthHeaders(includeContentType = true): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers: { [key: string]: string } = {
      'Authorization': token ? `Bearer ${token}` : ''
    };
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return new HttpHeaders(headers);
  }

  // ✅ Get profile and update shared state
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/GetCurrentUser`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((profile: Profile) => { // ✅ Typed `profile`
        this.profileState.setProfile(profile); // ✅ Update shared state
      })
    );
  }

  updateProfile(profile: ProfileParams): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateUserProfile`, profile, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Upload image using same endpoint
  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('ProfilePicture', file); // ← Must match C# DTO

    return this.http.put<any>(`${this.apiUrl}/UpdateUserProfile`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        // ❌ No Content-Type — let browser set it
      })
    }).pipe(
      tap((response: any) => {
        if (response.user?.ProfilePictureUrl) {
          const current = this.profileState.profile();
          if (current) {
            const updated: Profile = {
              ...current,
              profilePictureUrl: response.user.ProfilePictureUrl
            };
            this.profileState.setProfile(updated);
          }
        }
      })
    );
  }
}