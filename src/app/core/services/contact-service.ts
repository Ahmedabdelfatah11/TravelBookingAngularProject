import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactDto {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = 'https://localhost:7277/api/Contact';  

  constructor(private http: HttpClient) {}

  sendMessage(dto: ContactDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }
}
