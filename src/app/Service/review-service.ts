import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewFilterParams, ReviewStats } from '../Models/reviews';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
   private apiUrl = 'https://localhost:7277/api/Review';
   constructor(private http: HttpClient) { }
   getCompanyReviewStats(params: ReviewFilterParams): Observable<ReviewStats> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value.toString());
      }
    });

    return this.http.get<ReviewStats>(`${this.apiUrl}/stats?${queryParams.toString()}`);
  }
}
