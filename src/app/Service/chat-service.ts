import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://localhost:7277/api/Chat'; // عدل الرابط حسب الـ API الفعلي
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  constructor(private http: HttpClient) { }

   sendMessage(message: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/send`, 
      { Message: message }, // لاحظ أن الـ DTO يتطلب Message وليس userInput
      { headers }
    );
  }
  getChatHistory(count: number = 10): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(
      `${this.apiUrl}/history?count=${count}`,
      { headers }
    );
  }
  clearHistory(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(
      `${this.apiUrl}/clear`,
      { headers }
    );
  }
  getRandomTravelTip(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tips`);
  }
   
}
