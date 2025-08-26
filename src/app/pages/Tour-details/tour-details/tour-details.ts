import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Tours } from '../../../Models/tourModel';
import { NavBar } from "../../../shared/nav-bar/nav-bar";
import { TourDetailsBody } from "../tour-details-body/tour-details-body";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [NavBar, TourDetailsBody, Footer],
  templateUrl: './tour-details.html',
  styleUrl: './tour-details.css'
})
export class TourDetails implements OnInit {
  
  tourData?: Tours;

  private route = inject(ActivatedRoute);

  
  ngOnInit() {
    const data: Data = this.route.snapshot.data;
    this.tourData = data['tour'];
    document.body.classList.add('home-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-body');
  }

  getDurationInDays(start?: string | Date, end?: string | Date): number {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

}
