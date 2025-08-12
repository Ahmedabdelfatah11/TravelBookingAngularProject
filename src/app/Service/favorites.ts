import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from '../Models/favorite';
import { Hotel } from '../pages/Hotel/hotel/hotel';

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
  addToFavorites(Id: number, type: string): Observable<Favorite> {
    if (type === 'hotel') {
      return this.http.post<Favorite>(`${this.apiUrl}`, {
        hotelCompanyId: Id,
        companyType: type
      }, {
        headers: this.getAuthHeaders()
      });
    }
    if (type === 'flight') {
      return this.http.post<Favorite>(`${this.apiUrl}`, {
        flightCompanyId: Id,
        companyType: type
      }, {
        headers: this.getAuthHeaders()
      });
    }
    if (type === 'carrental') {
      return this.http.post<Favorite>(`${this.apiUrl}`, {
        carRentalCompanyId: Id,
        companyType: type
      }, {
        headers: this.getAuthHeaders()
      });
    }
    if (type === 'tour') {
      return this.http.post<Favorite>(`${this.apiUrl}`, {
        tourCompanyId: Id,
        companyType: type
      }, {
        headers: this.getAuthHeaders()
      });
    }
    // Return an observable that errors if type is invalid
    throw new Error('Invalid company type');
  }

  removeFromFavorites(Id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${Id}`, {
      headers: this.getAuthHeaders()
    });
  }
  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    });
  }
  getFavoritebytype(type: string, pageIndex?: number, pageSize?: number): Observable<Favorite[]> {
    if (pageIndex !== undefined && pageSize !== undefined) {
      return this.http.get<Favorite[]>(`${this.apiUrl}/type/${type}?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        headers: this.getAuthHeaders()
      });
    }
    return this.http.get<Favorite[]>(`${this.apiUrl}/type/${type}`, {
      headers: this.getAuthHeaders()
    });
  }
  isFavorite(Id: number, type: string): Observable<boolean> {
    if (type === 'hotel') {
      return this.http.post<boolean>(`${this.apiUrl}/check`, {
        hotelCompanyId: Id,
        companyType: type
      }, {
        headers: this.getAuthHeaders()
      });
    }
    if (type === 'flight') {
      return this.http.post<boolean>(`${this.apiUrl}/check`, {
        flightCompanyId: Id,
        companyType: type
      }, {
        headers: this.getAuthHeaders()
      });
    }
    if (type === 'carrental') {
      return this.http.post<boolean>(`${this.apiUrl}/check`, {
        carRentalCompanyId: Id,
        companyType: type
      }, {
        headers: this.getAuthHeaders()
      });
    }
    if (type === 'tour') {
      return this.http.post<boolean>(`${this.apiUrl}/check`, {
        tourCompanyId: Id,
        companyType: type
      }, {
        headers: this.getAuthHeaders()
      });
    }
    throw new Error('Invalid company type');
  }
}
