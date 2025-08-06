import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TourFilterParams, TourImages, TourResponse, Tours, ITourCompany } from '../Models/tourModel';

@Injectable({ providedIn: 'root' })
export class TourService {
  private apiUrl = 'https://localhost:7277/api/Tour';
  private tourCompanyUrl = 'https://localhost:7277/api/TourCompany';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  private buildQueryParams(filter: TourFilterParams): HttpParams {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }

  getTourCompany(): Observable<ITourCompany[]> {
    return this.http.get<ITourCompany[]>(this.tourCompanyUrl);
  }

  getTours(filter: TourFilterParams): Observable<TourResponse> {
    const params = this.buildQueryParams(filter);
    return this.http.get<TourResponse>(this.apiUrl, { params });
  }

  getTourById(id: number): Observable<Tours> {
    return this.http.get<Tours>(`${this.apiUrl}/${id}`);
  }

  bookTour(tourId: number, seatClass: string): Observable<any> {
    const body = { seatClass };
    return this.http.post<any>(`${this.apiUrl}/${tourId}/book`, body, {
      headers: this.getAuthHeaders()
    });
  }
  getPriceBounds(): Observable<{ min: number; max: number }> {
  return this.http.get<Tours[]>(this.apiUrl).pipe(
    map(tours => {
      const prices = tours.map(t => t.price);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    })
  );
}
}