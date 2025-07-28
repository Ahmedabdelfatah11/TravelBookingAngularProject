import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlightFilterParams, FlightResponse } from '../Models/flight-model';

@Injectable({
  providedIn: 'root'
})

export class FlightService {
  private apiUrl = 'https://localhost:7277/Flight';
  private flightCompanyUrl = 'https://localhost:7277/FlightCompany';
  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  getFlightCompany(): Observable<any> {
    return this.http.get<any>(`${this.flightCompanyUrl}`);
  }
  getFlights(params: FlightFilterParams): Observable<FlightResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value);
      }
    });

    return this.http.get<FlightResponse>(`${this.apiUrl}?${queryParams.toString()}`);
  }
  getFlightById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  bookFlight(flightId: number, seatClass :string): Observable<any> {
    const body = { seatClass };
    return this.http.post<any>(`${this.apiUrl}/${flightId}/book`, body, {
      headers: this.getAuthHeaders()
    });
  }
}

