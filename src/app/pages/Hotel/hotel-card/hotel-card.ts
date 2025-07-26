import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
interface Hotel {
  id: number;
  name: string;
  image: string;
  location: string;
  price: number;
  rating: string;
  ratingValue: number; // من 5
  description: string;
  reviewCount: number;
}
@Component({
  selector: 'app-hotel-card',
  imports: [RouterLink],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.css'
})


export class HotelCard {
  hotel: Hotel = {
    id: 1,
    name: "Hilton, Cairo",
    image: "https://i.pinimg.com/736x/a5/72/28/a572284f9f91a79cd6a6fc4686b94a7b.jpg",
    location: "Giza, Cairo, Egypt",
    price: 280,
    rating: "Excellent",
    ratingValue: 4.8,   // من 5
    reviewCount: 1247,
    description: "Luxury hotel with direct views of the Pyramids of Giza. Offers world-class dining, spa, and swimming pool facilities."
  };
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
