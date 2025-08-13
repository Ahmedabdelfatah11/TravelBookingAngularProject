import { Component } from '@angular/core';
import { NavBar } from "../../shared/nav-bar/nav-bar";
import { Footer } from "../../shared/footer/footer";
import { BookingBody } from "./booking-body/booking-body";

@Component({
  selector: 'app-bookings',
  imports: [NavBar, Footer, BookingBody],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css'
})
export class Bookings {
  ngOnInit() {
    document.body.classList.add('home-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-body');
  }
}
