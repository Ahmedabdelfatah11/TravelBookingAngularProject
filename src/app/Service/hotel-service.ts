import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelFilterParams, HotelResponse } from '../Models/hotel';
interface BookingResponse {
  id: number;
  totalPrice: number;        // ✅
  clientSecret?: string;     // لو عندك
}
@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'https://localhost:7277/api/HotelCompany';
  private apiRoomUrl = 'https://localhost:7277/api/room';
  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  getHotelCompanies(params:HotelFilterParams) : Observable<HotelResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value);
      }
    });
    return this.http.get<HotelResponse>(`${this.apiUrl}?${queryParams.toString()}`);
  }
  getHotelById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  bookRoom(roomId: number,StartDate:Date,EndDate:Date): Observable<any> {
    const body = {
      startDate: StartDate,
      endDate: EndDate
    };
    return this.http.post<BookingResponse>(`${this.apiRoomUrl}/${roomId}/book`, body, {
      headers: this.getAuthHeaders()
    });
  }
}
