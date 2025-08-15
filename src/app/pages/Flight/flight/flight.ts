import { Component } from '@angular/core';
import { Header } from "../../../shared/header/header";
import { FlightBody } from "../flight-body/flight-body";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-flight',
  imports: [Header, FlightBody, Footer],
  templateUrl: './flight.html',
  styleUrl: './flight.css'
})
export class Flight {
  Image: string = 'img/13.jpg';
}
