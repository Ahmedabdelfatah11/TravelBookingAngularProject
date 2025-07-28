import { HttpClient } from '@angular/common/http';
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
}

