import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iregister } from '../Interfaces/iregister';
import { Ilogin } from '../Interfaces/ilogin';
import { IResetPassword } from '../Interfaces/ireset-password';

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
  Login(model: Ilogin): Observable<any> {
    return this.http.post(`${this.baseUrl}/Login`, model);
  }

  ForgetPassword(model:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/ForgetPassword`,model)
  }

  ResetPassword(model: IResetPassword): Observable<any> {
    return this.http.post(`${this.baseUrl}/ResetPassword`, model);
  }
}
