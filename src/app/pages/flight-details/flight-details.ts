import { Component } from '@angular/core';
import { NavBar } from "../../shared/nav-bar/nav-bar";
import { FlightDetailsBody } from "./flight-details-body/flight-details-body";
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-flight-details',
  imports: [FlightDetailsBody, NavBar, Footer],
  templateUrl: './flight-details.html',
  styleUrl: './flight-details.css'
})
export class FlightDetails {
  ngOnInit() {
    document.body.classList.add('home-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-body');
  }
}
