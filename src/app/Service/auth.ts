import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Iregister } from '../Interfaces/iregister';
import { Ilogin } from '../Interfaces/ilogin';
import { IResetPassword } from '../Interfaces/ireset-password';
import { AuthModel } from '../Interfaces/i-auth-model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  
   private baseUrl = 'https://localhost:7277/api/Auth';   
  constructor(private http: HttpClient) {}
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

  ForgetPassword(model:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/ForgetPassword`,model)
  }

  ResetPassword(model: IResetPassword): Observable<any> {
    return this.http.post(`${this.baseUrl}/ResetPassword`, model);
  }

  Login(model: Ilogin): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${this.baseUrl}/Login`, model).pipe(
      tap(response => {
        if (response.isAuthenticated && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.email!);  
          localStorage.setItem('username', response.username!);
          localStorage.setItem('roles', JSON.stringify(response.roles));
        }
      })
    );
  }

  Logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
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
    return roles ? JSON.parse(roles) : [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

}
