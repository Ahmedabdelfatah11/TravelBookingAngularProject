import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarFilterParams, CarRental, CarResponse } from '../Models/CarRental';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarRentalService {
    private apiUrl = 'https://localhost:7277/api/CarRental';
  private apicarUrl = 'https://localhost:7277/api/Car';
  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  getCarCompanies(params:CarFilterParams) : Observable<CarRental> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value);
      }
    });
    return this.http.get<CarRental>(`${this.apiUrl}?${queryParams.toString()}`);
  }
  getCarById(id: number): Observable<CarRental> {
    return this.http.get<CarRental>(`${this.apiUrl}/${id}`);
  }
}
