import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile, ProfileParams } from '../Models/profile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://localhost:7277/api/userProfile';

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/GetCurrentUser`, {
      headers: this.getAuthHeaders()
    });
  }
  updateProfile(profile: ProfileParams): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateUserProfile`, profile, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }
}
