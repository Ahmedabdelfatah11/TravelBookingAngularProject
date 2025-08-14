import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private baseUrl = '/api/Tour';

  constructor(private http: HttpClient) {}

  bookTour(serviceId: number, payload: TourBookingPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/${serviceId}/book`, payload);
  }

}
