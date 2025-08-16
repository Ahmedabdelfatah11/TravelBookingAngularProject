import { Component, inject, signal } from '@angular/core';
import { FlightService } from '../../../Service/flightService';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightDetailsCard } from "../flight-details-card/flight-details-card";
import { FlightDetails } from '../../../Models/flight-model';
import { DatePipe } from '@angular/common';
import { CreateReview, ReviewStats } from '../../../Models/reviews';
import { ReviewService } from '../../../Service/review-service';
import { Auth } from '../../../Service/auth';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-flight-details-body',
  imports: [FlightDetailsCard, RouterLink, DatePipe, FormsModule],
  templateUrl: './flight-details-body.html',
  styleUrls: ['./flight-details-body.css']
})
export class FlightDetailsBody {
  // Signals for state management
  flight = signal<FlightDetails | null>(null);
  reviewStats = signal<ReviewStats | null>(null);
  isLoading = signal({ flight: true, reviews: true });
  error = signal<string | null>(null);
  showReviewForm = signal<boolean>(false);
  hasReviewed = signal<boolean>(false);
  rating = signal<number>(0);
  comment: string = '';
  bookingId = signal<number | null>(null);

  // Booking Signals
  showBookingForm = signal<boolean>(false);
  bookingSeatClass = signal<string>('Economy');
  isBooking = signal<boolean>(false);
  bookingSuccess = signal<boolean>(false);
  bookingError = signal<string | null>(null);
  // Keep original flight ID and flight company ID separate
  flightId: number = 0;
  flightCompanyId: number = 0;

  route = inject(ActivatedRoute);
  flightService = inject(FlightService);
  authService = inject(Auth);
  reviewService = inject(ReviewService);
  router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  constructor(private Toastr: ToastrService) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.flightId = +params['id']; // This is the flight ID from route
      this.loadFlightDetails();
    });
  }

  private loadFlightDetails(): void {
    if (isNaN(this.flightId)) {
      this.Toastr.error('Invalid flight ID');
      this.isLoading.update(s => ({ ...s, flight: false }));
      return;
    }

    this.flightService.getFlightById(this.flightId).subscribe({
      next: (data) => {
        this.flight.set(data);
        this.isLoading.update(s => ({ ...s, flight: false }));

        // Set the flight company ID for reviews (this is what we need for the review API)
        if (data.flightCompany && data.flightCompany.id) {
          this.flightCompanyId = data.flightCompany.id;
          console.log('Flight Company ID for reviews:', this.flightCompanyId);

          // Load reviews and check user review only after we have the company ID
          this.loadReviewStats();
          this.checkUserReview();
        } else {
          console.error('Flight company information not available');
          this.Toastr.error('Flight company information not available');
        }
      },
      error: (err) => {
        this.error.set('Failed to load flight details');
        this.isLoading.update(s => ({ ...s, flight: false }));
        console.error('Error fetching flight details:', err);
      }
    });
  }

  private loadReviewStats(): void {
    if (!this.flightCompanyId) {
      this.Toastr.error('Flight Company ID not available for reviews');
      return;
    }

    console.log('Loading reviews for Flight Company ID:', this.flightCompanyId);

    this.reviewService.getCompanyReviewStats({
      companyType: 'flight',
      flightId: this.flightCompanyId // Use flight company ID for reviews
    }).subscribe({
      next: (stats) => {
        this.reviewStats.set(stats);
        this.isLoading.update(s => ({ ...s, reviews: false }));
        console.log('Review stats loaded:', stats);
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.Toastr.error('Error loading reviews:', err)
        this.isLoading.update(s => ({ ...s, reviews: false }));
        // Don't show error to user, just log it
      }
    });
  }

  checkUserReview(): void {
    if (!this.authService.isLoggedIn() || !this.flightCompanyId) {
      return;
    }

    const checkData: CreateReview = {
      companyType: 'flight',
      flightCompanyId: this.flightCompanyId,
      rating: 1 // Required field, but value doesn't matter for check
    };

    this.reviewService.checkUserReview(checkData).subscribe({
      next: (hasReviewed) => {
        this.hasReviewed.set(hasReviewed);
        console.log('User has reviewed:', hasReviewed);
      },
      error: (err) => {
        console.error('Error checking user review:', err);
      }
    });
  }

  submitReview(rating: number, comment: string): void {
    if (!this.authService.isLoggedIn()) {
      this.Toastr.warning('Please login to submit a review');
      return;
    }

    if (!this.flightCompanyId) {
      this.Toastr.error('Flight company information not available');
      return;
    }

    if (rating === 0) {
      this.Toastr.warning('Please select a rating');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const reviewData: CreateReview = {
      companyType: 'flight',
      flightCompanyId: this.flightCompanyId,
      rating,
      comment: comment.trim() || undefined
    };

    console.log('Submitting review:', reviewData);

    this.reviewService.createReview(reviewData).subscribe({
      next: (newReview) => {
        console.log('Review submitted successfully:', newReview);

        // Update review stats after successful submission
        this.reviewStats.update(stats => {
          if (!stats) {
            return {
              totalReviews: 1,
              averageRating: rating,
              ratingDistribution: { [rating]: 1 },
              recentReviews: [newReview]
            };
          }

          const newTotal = stats.totalReviews + 1;
          const newAverage = parseFloat(
            ((stats.averageRating * stats.totalReviews + rating) / newTotal).toFixed(1)
          );

          return {
            ...stats,
            totalReviews: newTotal,
            averageRating: newAverage,
            recentReviews: [newReview, ...stats.recentReviews].slice(0, 5)
          };
        });

        this.hasReviewed.set(true);
        this.showReviewForm.set(false);
        this.rating.set(0);
        this.comment = '';
        this.isSubmitting.set(false);

        this.Toastr.success('Review submitted successfully!');
      },
      error: (err) => {
        console.error('Review submit error:', err);
        this.isSubmitting.set(false);

        let errorMessage = 'Failed to submit review';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.errors) {
            // Handle validation errors
            const errors = Object.values(err.error.errors).flat();
            errorMessage = errors.join(', ');
          }
        }

        this.submitError.set(errorMessage);
        this.Toastr.error(errorMessage);
      }
    });
  }

  // Helper method to reset form
  resetReviewForm(): void {
    this.rating.set(0);
    this.comment = '';
    this.showReviewForm.set(false);
    this.submitError.set(null);
  }
  // Booking Methods
  openBookingForm() {
    if (!this.authService.isLoggedIn()) {
      this.Toastr.warning('Please login to book a flight');
      return;
    }
    this.showBookingForm.set(true);
    this.bookingSuccess.set(false);
    this.bookingError.set(null);
  }

  closeBookingForm() {
    this.showBookingForm.set(false);
    this.bookingSeatClass.set('Economy');
    this.bookingError.set(null);
    this.bookingSuccess.set(false);
  }

  confirmBooking() {
    if (this.isBooking()) return;

    this.isBooking.set(true);
    this.bookingError.set(null);

    const flight = this.flight();
    if (!flight) {
      this.bookingError.set("Flight details are not available.");
      this.isBooking.set(false);
      return;
    }

    this.flightService.bookFlight(this.flightId, this.bookingSeatClass()).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        this.bookingId.set(response.bookingId);
        this.bookingSuccess.set(true);
        this.isBooking.set(false);

        // ✅ انتقل لصفحة الدفع بعد نجاح الحجز
        this.router.navigate(['/payment', response.bookingId]);
      },
      error: (err) => {
        console.error('Booking error:', err);
        this.isBooking.set(false);
        let errorMessage = 'Failed to book flight';
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        this.bookingError.set(errorMessage);
        this.Toastr.error(errorMessage);
      }
    });
  }

}