import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TourService } from '../../Service/tour-service';
import { Tours } from '../../Models/tourModel';


@Injectable({ providedIn: 'root' })
export class TourResolver implements Resolve<Tours> {
  constructor(private tourService: TourService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Tours> {
    const id = Number(route.paramMap.get('id'));
    return this.tourService.getTourById(id);
  }
}