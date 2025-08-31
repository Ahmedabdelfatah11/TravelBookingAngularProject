// src/app/services/book.service.ts

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { CarBookingResultDto } from "../Models/CarBookingResultDto";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private latestBookingResult: CarBookingResultDto | null = null;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  bookCar(id: number, booking: any): Observable<CarBookingResultDto> {
    return this.http.post<CarBookingResultDto>(
      `http://pyramigo.runasp.net/api/Car/${id}/book`,
      booking,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(result => {
        this.latestBookingResult = result;
      })
    );
  } 

  
}
