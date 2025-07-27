import { Component, inject, signal } from '@angular/core';
import { FlightService } from '../../../Service/flightService';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FlightDetailsCard } from "../flight-details-card/flight-details-card";
import { FlightDetails } from '../../../Models/flight-model';
import { DatePipe } from '@angular/common';
import { ReviewStats } from '../../../Models/reviews';
import { ReviewService } from '../../../Service/review-service';

@Component({
  selector: 'app-flight-details-body',
  imports: [FlightDetailsCard, RouterLink, DatePipe],
  templateUrl: './flight-details-body.html',
  styleUrl: './flight-details-body.css'
})
export class FlightDetailsBody {
  getHelpfulCount(_arg0: number) {
    // This function should return the count of helpful votes for the review
    // For now, we will return a random number for demonstration purposes
    return Math.floor(Math.random() * 100);
  }
  flight = signal<FlightDetails | null>(null); // Consider creating a Flight interface for better typing
  reviewStats = signal<ReviewStats | null>(null);
  isLoading = signal({ flight: true, reviews: true });
  error = signal<string | null>(null);


  flightid: number = 0;
  route = inject(ActivatedRoute);
  flightService = inject(FlightService);
  reviewService = inject(ReviewService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.flightid = +params['id'];
      this.loadFlightDetails();
      this.loadReviewStats();
    });
  }

  private loadFlightDetails(): void {
    if (isNaN(this.flightid)) {
      this.error.set('Invalid flight ID');
      this.isLoading.update(s => ({ ...s, flight: false }));
      return;
    }

    this.flightService.getFlightById(this.flightid).subscribe({
      next: (data) => {
        this.flight.set(data);
        this.isLoading.update(s => ({ ...s, flight: false }));
      },
      error: (err) => {
        this.error.set('Failed to load flight details');
        this.isLoading.update(s => ({ ...s, flight: false }));
        console.error('Error fetching flight details:', err);
      }
    });
  }

  private loadReviewStats(): void {
    this.reviewService.getCompanyReviewStats({
      companyType: 'flight',
      flightId: this.flightid,

    }).subscribe({
      next: (stats) => {
        this.reviewStats.set(stats);
        this.isLoading.update(s => ({ ...s, reviews: false }));
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.isLoading.update(s => ({ ...s, reviews: false }));
      }
    });
  }


}
