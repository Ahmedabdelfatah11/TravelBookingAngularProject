import { Component } from '@angular/core';



@Component({
  selector: 'app-body',
  imports: [],
  templateUrl: './body.html',
  styleUrl: './body.css',

})
export class Body {
  trips = [
    { title: 'Hotels', description: 'Book hotels in minutes', image: 'img/Hotels.jpg', sub: "Explore hotels", subimg: "img/Hotel.jpg" },
    { title: 'Flights', description: 'Find affordable flights', image: 'img/Flights.jpg', sub: "Explore Flights", subimg: "img/Flight.jpg" },
    { title: 'Tours', description: 'Explore new cities', image: 'img/Tours.jpg', sub: "Explore Tours", subimg: "img/Tour.jpg" },
    { title: 'Cars', description: 'Explore new places easier ', image: 'img/Cars.jpg', sub: "Book Cars", subimg: "img/Car.jpg" },
  ];
}
