import { Component } from '@angular/core';

@Component({
  selector: 'app-body',
  imports: [],
  templateUrl: './body.html',
  styleUrl: './body.css'
})
export class Body {
  trips = [
    { title: 'Hotels', description: 'Book hotels in minutes', image: 'assets/hotels-thumb.jpg' },
    { title: 'Flights', description: 'Find affordable flights', image: 'assets/flights-thumb.jpg' },
    { title: 'Tours', description: 'Explore new cities', image: 'assets/tours-thumb.jpg' },
  ];
}
