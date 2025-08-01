import { Component, Input, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hotel } from '../../../Models/hotel';
@Component({
  selector: 'app-hotel-card',
  imports: [RouterLink],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.css'
})


export class HotelCard {
  @Input() hotel: Hotel | undefined;

  getStars(rating: string): number[] {
    const numericRating = Number(rating);
    return Array(Math.floor(numericRating)).fill(0);
  }

  getEmptyStars(rating: string): number[] {
    const numericRating = Number(rating);
    return Array(5 - Math.floor(numericRating)).fill(0);
  }
  saveForLater(hotelId: number) {
    console.log('Hotel saved:', hotelId);

  }
}
