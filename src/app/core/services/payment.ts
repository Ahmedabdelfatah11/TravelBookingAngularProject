import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
export class PaymentService {
  private baseUrl = 'https://localhost:7277/api/Payment';   
  constructor(private http: HttpClient) {}
  
   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  createPaymentIntent(bookingId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-intent/${bookingId}`, {}, { headers: this.getAuthHeaders() });
  }
   confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm-payment`, {
      paymentIntentId: paymentIntentId
    });
  }
}
