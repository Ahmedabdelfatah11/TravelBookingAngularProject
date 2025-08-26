import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TourBookingResponse, TourTickets } from '../Models/tourModel';

export interface TourBookingPayload {
  tickets: {
    type: string;
    quantity: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class TourBookingService {
  private apiUrl = 'http://pyramigo.runasp.net/api/Tour';

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }
  bookTour(serviceId: number, payload: TourTickets) {
    if (!serviceId) {
      throw new Error('Service ID is required');
    }
    return this.http.post<TourBookingResponse>(`${this.apiUrl}/${serviceId}/book`, payload, {
      headers: this.getAuthHeaders()
    });
  }


}
