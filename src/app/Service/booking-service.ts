import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../Models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
    private apiUrl = 'http://pyramigo.runasp.net/api/Booking';
    constructor(private http: HttpClient) { }
    GetAllBookings() : Observable<Booking[]>{
     return this.http.get<Booking[]>(`${this.apiUrl}`);
    }
    DeleteBooking(bookingId: number): Observable<void> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        
        return this.http.delete<void>(`${this.apiUrl}/${bookingId}`, { headers });
    }
    GetBookById(id:number): Observable<Booking>{
        return this.http.get<Booking>(`${this.apiUrl}/${id}`);
    }

}
