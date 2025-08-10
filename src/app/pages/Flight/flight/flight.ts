import { Component } from '@angular/core';
import { Header } from "../../home/header/header";
import { SearchBarComponent } from "../../home/search-bar/search-bar";
import { FlightBody } from "../flight-body/flight-body";
import { NavBar } from "../../../shared/nav-bar/nav-bar";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-flight',
  imports: [Header, FlightBody, Footer],
  templateUrl: './flight.html',
  styleUrl: './flight.css'
})
export class Flight {

}
