import { Component } from '@angular/core';
import { NavBar } from "../../shared/nav-bar/nav-bar";
import { HotelDetailsBody } from "./hotel-details-body/hotel-details-body";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: 'app-hotel-details',
  imports: [NavBar, HotelDetailsBody, Footer],
  templateUrl: './hotel-details.html',
  styleUrl: './hotel-details.css'
})
export class HotelDetails {
  ngOnInit() {
    document.body.classList.add('home-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-body');
  }
}
