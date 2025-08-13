import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone,
  signal,
  inject
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Car } from '../../Models/car';
import { CarService } from '../../Service/carService';
import { ReviewService } from '../../Service/review-service';
import { Auth } from '../../Service/auth';
import { CreateReview, ReviewStats } from '../../Models/reviews';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './car-details.html',
  styleUrls: ['./car-details.css']
})
export class CarDetails implements OnInit {
  car: Car | null = null;
  carId: string | null = null;
  carCompanyId: number | null = null;

  startDate: string = '';
  endDate: string = '';

  errorMessage = '';
  carSignal = signal<any>([]);
  isLoading = signal({ car: true });

  reviewStats = signal<ReviewStats | null>(null);
  showReviewForm = signal<boolean>(false);
  hasReviewed = signal<boolean>(false);
  rating = signal<number>(0);
  comment: string = '';
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  route = inject(ActivatedRoute);
  router = inject(Router);
  carService = inject(CarService);
  reviewService = inject(ReviewService);
  authService = inject(Auth);

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.ngZone.run(() => {
      this.carId = this.route.snapshot.paramMap.get('id');
      if (this.carId) {
        this.loadCarDetails(+this.carId);
      } else {
        this.router.navigate(['/cars']);
      }
    });
  }

  loadCarDetails(id: number): void {
    this.isLoading.update(s => ({ ...s, car: true }));
    this.errorMessage = '';

    this.carService.getCarById(id).subscribe({
      next: (car) => {
        console.log('Car Details:', car);
        this.car = car;
        this.carCompanyId = car.rentalCompanyId;
        
        this.isLoading.update(s => ({ ...s, car: false }));
        this.cdr.detectChanges();

        this.loadReviewStats();
        this.checkUserReview();
      },
      error: (error) => {
        console.error('Error loading car details:', error);
        this.errorMessage = 'Failed to load car details';
        this.isLoading.update(s => ({ ...s, car: false }));
        this.cdr.detectChanges();
      }
    });
  }

  // ==================== Reviews ====================
 private loadReviewStats(): void {
    if (!this.carCompanyId) {
      console.error('Car Company ID not available for reviews');
      return;
    }

    console.log('Loading reviews for Car Company ID:', this.carCompanyId);

    this.reviewService.getCompanyReviewStats({
      companyType: 'carrental',
      carRentalId: this.carCompanyId
    }).subscribe({
      next: (stats) => {
        this.reviewStats.set(stats);
        this.isLoading.update(s => ({ ...s, reviews: false }));
        console.log('Review stats loaded:', stats);
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.isLoading.update(s => ({ ...s, reviews: false }));
        // Don't show error to user, just log it
      }
    });
  }

  checkUserReview(): void {
    if (!this.authService.isLoggedIn() || !this.carCompanyId) {
      return;
    }

    const checkData: CreateReview = {
      companyType: 'carrental',
      carRentalCompanyId: this.carCompanyId,
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
      alert('Please login to submit a review');
      return;
    }

    if (!this.carCompanyId) {
      alert('Car information not available');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const reviewData: CreateReview = {
      companyType: 'carrental',
      carRentalCompanyId: this.carCompanyId,
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

        alert('Review submitted successfully!');
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
        alert(errorMessage);
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
  // ====================================================

  goBack(): void {
    this.router.navigate(['/cars']);
  }

  BookCar(): void {
    if (!this.startDate || !this.endDate) return;

    this.carService.bookcar(Number(this.carId), this.startDate, this.endDate).subscribe({
      next: (response) => {
        console.log('Booking Response:', response);
        this.carSignal.set(response);
        this.router.navigate([`/payment/${response.id}`], { state: { booking: response } });
      },
      error: (error) => console.error('Error booking car:', error)
    });
  }
}
