import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs'; 
import { CreateReview, ReviewFilterParams, ReviewStats, Reviews } from '../Models/reviews'; 

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'https://localhost:7277/api/review'; // Changed to lowercase
  
  constructor(private http: HttpClient) { }

  // Helper method to get authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Helper method to get headers without auth (for public endpoints)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getCompanyReviewStats(params: ReviewFilterParams): Observable<ReviewStats> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value.toString());
      }
    });

    // This is a public endpoint, no auth needed
    return this.http.get<ReviewStats>(`${this.apiUrl}/stats?${queryParams.toString()}`, {
      headers: this.getHeaders()
    });
  }

  checkUserReview(params: CreateReview): Observable<boolean> {
    console.log('🌐 POST Check User Review URL:', `${this.apiUrl}/check`);
    console.log('📋 Check review params:', params);

    return this.http.post<boolean>(`${this.apiUrl}/check`, params, {
      headers: this.getAuthHeaders() // Added authentication headers
    }).pipe(
      tap(response => {
        console.log('✅ Check user review response:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Check user review error:', error);
        console.error('📋 Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error
        });

        if (error.status === 404) {
          console.error('🔍 404 on check review - possible issues:');
          console.error('   - Endpoint /api/review/check does not exist');
          console.error('   - Controller method CheckUserReview not found');
          console.error('   - Route not properly configured');
        }

        if (error.status === 401) {
          console.error('🔒 401 Unauthorized - Authentication required');
          console.error('   - Check if user is logged in');
          console.error('   - Verify JWT token is valid');
        }
        
        throw error;
      })
    );
  }

  createReview(params: CreateReview): Observable<Reviews> {
    console.log('🌐 POST Create Review URL:', this.apiUrl);
    console.log('📋 Create review params:', params);
    console.log('🔑 Auth token present:', !!localStorage.getItem('authToken'));

    return this.http.post<Reviews>(this.apiUrl, params, {
      headers: this.getAuthHeaders() // Added authentication headers
    }).pipe(
      tap(response => {
        console.log('✅ Create review response:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Create review error:', error);
        console.error('📋 Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error
        });

        if (error.status === 404) {
          console.error('🔍 404 on create review - possible issues:');
          console.error('   - Endpoint /api/review does not exist');
          console.error('   - Controller method CreateReview not found');
          console.error('   - Route not properly configured');
        }

        if (error.status === 401) {
          console.error('🔒 401 Unauthorized - Authentication required');
          console.error('   - Check if user is logged in');
          console.error('   - Verify JWT token is valid');
          console.error('   - Token might be expired');
        }

        if (error.status === 400) {
          console.error('📝 400 Bad Request - Validation error');
          console.error('   - Check CreateReview model validation');
          console.error('   - Ensure exactly one company ID is provided');
          console.error('   - Verify companyType is valid');
        }
        
        throw error;
      })
    );
  }

  // Additional methods you might need:

  getCompanyReviews(params: ReviewFilterParams): Observable<Reviews[]> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value.toString());
      }
    });

    // This is a public endpoint
    return this.http.get<Reviews[]>(`${this.apiUrl}/company?${queryParams.toString()}`, {
      headers: this.getHeaders()
    });
  }

  getUserReviews(page: number = 1, pageSize: number = 10): Observable<Reviews[]> {
    return this.http.get<Reviews[]>(`${this.apiUrl}/user?page=${page}&pageSize=${pageSize}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateReview(id: number, reviewData: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, reviewData, {
      headers: this.getAuthHeaders()
    });
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCompanyAverageRating(params: ReviewFilterParams): Observable<number> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value.toString());
      }
    });

    return this.http.get<number>(`${this.apiUrl}/average?${queryParams.toString()}`, {
      headers: this.getHeaders()
    });
  }

  getCompanyReviewsCount(params: ReviewFilterParams): Observable<number> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, value.toString());
      }
    });

    return this.http.get<number>(`${this.apiUrl}/count?${queryParams.toString()}`, {
      headers: this.getHeaders()
    });
  }
}