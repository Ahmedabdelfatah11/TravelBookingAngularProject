import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  constructor(private http: HttpClient) { }
  getFlights(): Observable<any> {
    return this.http.get('https://localhost:7277/Flight'); // Replace with your actual API endpoint
  }
}
