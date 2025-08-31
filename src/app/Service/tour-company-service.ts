import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITourCompany } from '../Models/tourModel';

@Injectable({ providedIn: 'root' })
export class TourCompanyService {
  private apiUrl = 'http://pyramigo.runasp.net/api/tourCompany';

  constructor(private http: HttpClient) {}

  getTourCompanyById(id: number): Observable<ITourCompany> {
    return this.http.get<ITourCompany>(`${this.apiUrl}/${id}`);
  }
}