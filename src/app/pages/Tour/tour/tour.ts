import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBar } from '../../../shared/nav-bar/nav-bar';
import { TourBody } from "../tour-body/tour-body";


@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [CommonModule, NavBar, TourBody],
  templateUrl: './tour.html',
  styleUrls: ['./tour.css']
})
export class Tour { 

   getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }
  saveForLater(hotelId: number) {
    console.log('Hotel saved:', hotelId);

  }
}
