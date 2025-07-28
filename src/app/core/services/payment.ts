import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'https://localhost:7277/api/Payment';   
  constructor(private http: HttpClient) {}

  createPaymentIntent(bookingId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-intent/${bookingId}`, {});
  }
}
