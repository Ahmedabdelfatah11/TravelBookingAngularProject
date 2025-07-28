import { Component, inject, signal } from '@angular/core';
import { FlightService } from '../../../services/flightService';
import { ActivatedRoute } from '@angular/router';
import { FlightDetailsCard } from "../flight-details-card/flight-details-card";
import { FlightDetails } from '../../../Models/flight-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-flight-details-body',
  imports: [FlightDetailsCard],
  templateUrl: './flight-details-body.html',
  styleUrl: './flight-details-body.css'
})
export class FlightDetailsBody {
  flight = signal<FlightDetails | null>(null); // Consider creating a Flight interface for better typing
  isLoading = true;
  error: string | null = null;
  flightid: number = 0;
  route = inject(ActivatedRoute);
  flightService = inject(FlightService);
  constructor(
  ) {
    this.route.params.subscribe((pram) => {
      console.log(pram);
      this.flightid = pram['id'];
    })
  }

  ngOnInit(): void {
    this.loadFlightDetails();
  }

  private loadFlightDetails(): void {
    // Convert the string parameter to number


    // Validate it's a proper number
    if (isNaN(this.flightid)) {
      this.error = 'Invalid flight ID';
      this.isLoading = false;
      return;
    }

    this.flightService.getFlightById(this.flightid).subscribe({
      next: (data) => {
        console.log(data);
        this.flight.set(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load flight details';
        this.isLoading = false;
        console.error('Error fetching flight details:', err);
      }
    });
  }


}
