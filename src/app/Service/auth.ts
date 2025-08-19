import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Iregister } from '../Interfaces/iregister';
import { Ilogin } from '../Interfaces/ilogin';
import { IResetPassword } from '../Interfaces/ireset-password';
import { AuthModel } from '../Interfaces/i-auth-model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl = 'https://localhost:7277/api/Auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  GoogleLogin() {
    window.location.href = `${this.baseUrl}/ExternalLogin?provider=Google&returnUrl=${encodeURIComponent(window.location.origin + '/google-callback')}`;
  }

  Register(model: Iregister): Observable<any> {
    return this.http.post(`${this.baseUrl}/Register`, model);
  }

  confirmEmail(userId: string, code: string): Observable<any> {
    const model = {
      userId: userId,
      code: code
    };
    return this.http.post(`${this.baseUrl}/ConfirmEmail`, model);
  }

  ResendConfirmationEmail(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ResendConfirmEmail`, { email });
  }

  ForgetPassword(model: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ForgotPassword`, model);
  }

  ResetPassword(model: IResetPassword): Observable<any> {
    return this.http.post(`${this.baseUrl}/ResetPassword`, model);
  }

  Login(model: Ilogin): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${this.baseUrl}/Login`, model).pipe(
      tap(response => {
        if (response.isAuthenticated && response.token) {
          this.setAuthData(response.token, response.email!, response.username!, response.roles || []);
        }
      })
    );
  }

  // Method to set authentication data (used by both regular login and Google callback)
  setAuthData(token: string, userId: string, username: string, roles: string[]) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('roles', JSON.stringify(roles));
    this.isAuthenticatedSubject.next(true);
  }

  Logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    // Optional: Add token expiration check here
    try {
      // Decode JWT token to check expiration (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        this.Logout(); // Token expired, logout
        return false;
      }
      
      return true;
    } catch (error) {
      // If token is malformed, consider it invalid
      console.error('Invalid token format:', error);
      this.Logout();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    try {
      return roles ? JSON.parse(roles) : [];
    } catch (error) {
      console.error('Error parsing roles:', error);
      return [];
    }
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}