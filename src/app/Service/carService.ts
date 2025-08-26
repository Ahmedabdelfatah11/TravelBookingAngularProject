import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Car } from '../Models/car';
import { start } from '@popperjs/core';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = 'http://pyramigo.runasp.net/api/Car';
  

  constructor(private http: HttpClient) {}
   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  
  getCars(pageIndex: number, pageSize: number): Observable<{ data: Car[]; count: number }> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    return this.http.get<{ data: Car[]; count: number }>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getFilteredCars(
    model: string = '',
    minPrice: number = 0,
    maxPrice: number = 10000000,
    location: string = '',
    Sort: string = '',  
    pageIndex: number = 1,
    pageSize: number = 10
  ): Observable<{ data: Car[]; count: number }> {
    let params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());

    if (model) {
      params = params.set('Model', model);
    }

    if (minPrice > 0) {
      params = params.set('MinPrice', minPrice.toString());
    }

    if (maxPrice < 10000000) {
      params = params.set('MaxPrice', maxPrice.toString());
    }

    if (location) {
      params = params.set('Location', location);
    }
    if (Sort) {
      params = params.set('Sort', Sort);
    }

    return this.http.get<{ data: Car[]; count: number }>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('Service Error:', errorMessage);
    return throwError(() => errorMessage);
  }
  ///// post booking
  bookcar(CarId:number, startDate: string, endDate: string): Observable<any> {
    const body =  {
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString()
  }; // Adjust the body as needed
    return this.http.post<any>(`${this.apiUrl}/${CarId}/book`, body, {
      headers: this.getAuthHeaders()
    });
  }
}
