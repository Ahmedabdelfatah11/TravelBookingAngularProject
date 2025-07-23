import { Component } from '@angular/core';
import { Flight } from '../flight-model';
import { Filters } from "../filters/filters";
import { SortOptions } from "../sort-options/sort-options";
import { FlightCard } from "../flight-card/flight-card";
import { FlightService } from '../flightService';

@Component({
  selector: 'app-flight-body',
  imports: [Filters, SortOptions, FlightCard],
  templateUrl: './flight-body.html',
  styleUrl: './flight-body.css'
})
export class FlightBody {
  flights: Flight[] = [];

  constructor(private flightser: FlightService) { }
  ngOnInit() {
    this.getFlights();
  }
  getFlights() {
    this.flightser.getFlights().subscribe({
      next: (data) => {
        this.flights = data.data as Flight[];
        console.log('Flights fetched successfully:', this.flights);
      },
      error: (error) => {
        console.error('Error fetching flights:', error);
      }
    })
  }
}