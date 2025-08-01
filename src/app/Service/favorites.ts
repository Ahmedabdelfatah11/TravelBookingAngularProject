import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from '../Models/favorite';

@Injectable({
  providedIn: 'root'
})
export class Favorites {
    private apiUrl = 'https://localhost:7277/api/favoritet';
constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  addToFavorites(Id: number,type:string): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.apiUrl}`, {
      flightCompanyId: Id,
      companyType: type
    }, {
      headers: this.getAuthHeaders()
    });
  }
  removeFromFlightFavorites(Id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${Id}`, {
      headers: this.getAuthHeaders()
    });
  }
  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    });
  }
}
