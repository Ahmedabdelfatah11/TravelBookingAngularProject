import { Component } from '@angular/core';
import { Header } from "../../../components/header/header";
import { SearchBarComponent } from "../../../components/search-bar/search-bar";
import { FlightBody } from "../flight-body/flight-body";

@Component({
  selector: 'app-flight',
  imports: [Header, SearchBarComponent, FlightBody],
  templateUrl: './flight.html',
  styleUrl: './flight.css'
})
export class Flight {

}
