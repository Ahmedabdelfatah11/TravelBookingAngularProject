import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { ITourCompany, Tours, TourTickets } from '../../../Models/tourModel';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShareButtons } from 'ngx-sharebuttons/buttons';
import { TourCompanyService } from '../../../Service/tour-company-service';
import { ReviewService } from '../../../Service/review-service';
import { Auth } from '../../../Service/auth';
import { CreateReview, Reviews, ReviewStats } from '../../../Models/reviews';
import { CommonModule} from '@angular/common';
import { ToastrService } from 'ngx-toastr'; 
import { Favorites } from '../../../Service/favorites';
import { TourBookingComponent } from '../tour-booking/tour-booking';
import { TourBookingService } from '../../../Service/tour-booking-service';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../../Service/tour-service';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-tour-details-body',
  standalone: true,
  imports: [RouterLink, ShareButtons, CommonModule,FormsModule, CommonModule, TourBookingComponent],
  templateUrl: './tour-details-body.html',
  styleUrls: ['./tour-details-body.css']
})
export class TourDetailsBody implements OnInit {
  @Input() id!: number;
  @Input() tour!: Tours;
    private tourCompanyService = inject(TourCompanyService);
    private route = inject(ActivatedRoute);
    //favourite
private favouriteService = inject(Favorites);
private toastr = inject(ToastrService);

// Reviews Signals
  reviewStats = signal<ReviewStats | null>(null);
  showReviewForm = signal<boolean>(false);
  hasReviewed = signal<boolean>(false);
  rating = signal<number>(0);
  comment: string = '';
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  bookingId = signal<number | null>(null);
  totalPrice = signal<number>(0);
  isLoading = signal({ tourCompany: true, reviews: true });
  error = signal<string | null>(null);

  tourCompanyId: number = 0;

  reviewService = inject(ReviewService);
  authService = inject(Auth);
  router = inject(Router);

  bookingService = inject(TourBookingService);
  
  


  // tourCompany = signal<ITourCompany | null>(null);
tourCompany = signal<ITourCompany | null>(null);


  currentUrl: string = '';

 tourId!: number;
 constructor() {
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
  }


loading = true;

ngOnInit(): void {
  this.currentUrl = window.location.href;
 this.route.params.subscribe(params => {
      this.tourCompanyId = +params['id']; // This is the flight ID from route
      this.loadTourDetails();
    });
  if (!this.tour) {
    console.warn('Tour input not provided');
    return;
  }

  
}
addToWishlist(): void {
  if (!this.tour?.id) {
    this.toastr.error('Invalid tour ID.');
    return;
  }

  this.favouriteService.addTourToFavorites(this.tour.id).subscribe({
    next: () => {
      this.toastr.success('Tour added to your wishlist!');
    },
    error: (err: any) => {
      if (err.status === 409) {
        this.toastr.warning('This tour is already in your wishlist.');
      } else {
        this.toastr.error('Something went wrong. Please try again.');
      }
    }
  });
}
  getDurationInDays(start?: string | Date, end?: string | Date): number {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }


  // ✅ Load Review Stats
  private loadReviewStats(): void {
    if (!this.tourCompanyId) return;
    console.log('Loading reviews for tour Company ID:', this.tourCompanyId);

    this.reviewService.getCompanyReviewStats({
      companyType: 'tour',
      tourCompanyId: this.tourCompanyId
    }).subscribe({
      next: (stats) => {
        this.reviewStats.set(stats);
        this.isLoading.update(s => ({ ...s, reviews: false }));
        console.log('📊 Review stats loaded:', stats);
      },
      error: (err) => {
        console.error('❌ Error loading review stats:', err);
        this.isLoading.update(s => ({ ...s, reviews: false }));
      }
    });
  }

  // ✅ Check if user already reviewed
private checkUserReview(): void {
  if (!this.authService.isLoggedIn() || !this.tourCompanyId) return;

  const checkData: CreateReview = {
    companyType: 'tour',
    tourCompanyId: this.tourCompanyId,
    rating: 1 // Still dummy, but now valid
  };

  this.reviewService.checkUserReview(checkData).subscribe({
    next: (hasReviewed) => {
      this.hasReviewed.set(hasReviewed);
      console.log('👤 User has reviewed:', hasReviewed);
    },
    error: (err) => {
      console.error('❌ Error checking user review:', err);
    }
  });
}




  // ✅ Submit Review
  submitReview(rating: number, comment: string): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please login to submit a review');
      return;
    }

    if (!this.tourCompanyId) {
      this.toastr.warning('Tour company information not available');
      return;
    }

    if (rating === 0) {
      this.toastr.warning('Please select a rating');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const reviewData: CreateReview = {
      companyType: 'tour',
      tourCompanyId: this.tourCompanyId,
      rating,
      comment: comment.trim() || undefined
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: (newReview) => {
        console.log('✅ Review submitted:', newReview);
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

        this.toastr.success('Review submitted successfully!');
      },
      error: (err) => {
        console.error('❌ Review submit error:', err);
        this.isSubmitting.set(false);

        let errorMessage = 'Failed to submit review';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.errors) {
            const errors = Object.values(err.error.errors).flat();
            errorMessage = errors.join(', ');
          }
        }

        this.submitError.set(errorMessage);
        this.toastr.error(errorMessage);
      }
    });
  }
  

  // ✅ Reset Review Form
  resetReviewForm(): void {
    this.rating.set(0);
    this.comment = '';
    this.showReviewForm.set(false);
    this.submitError.set(null);
  }

  private loadTourDetails(): void {
  if (isNaN(this.tourCompanyId)) {
    this.error.set('Invalid tour ID');
    this.isLoading.update(s => ({ ...s, hotel: false }));
    return;
  }

  this.tourCompanyService.getTourCompanyById(this.tourCompanyId).subscribe({
    next: (response) => {
      this.tourCompany.set(response);
      this.isLoading.update(s => ({ ...s, tourCompany: false }));

      if (response && response.id) {
        this.tourCompanyId = response.id;

        this.loadReviewStats();
        this.loadCompanyReviews(); // ✅ Load reviews from DB
        this.checkUserReview();
      }
    },
    error: (err) => {
      this.error.set('Failed to load tour details');
      this.isLoading.update(s => ({ ...s, hotel: false }));
    }
  });
}


  reviews: Reviews[] = [];
  loadCompanyReviews(): void {
  if (!this.tourCompanyId) return;

  const params = {
    companyType: 'tour',
    tourCompanyId: this.tourCompanyId
  };

  this.reviewService.getCompanyReviews(params).subscribe({
    next: (reviews) => {
      this.reviews = reviews;
      console.log('📋 Loaded reviews from DB:', reviews);
    },
    error: (err) => {
      console.error('❌ Error loading reviews:', err);
    }
  });
}

private baseUrl = environment.baseUrl || 'https://localhost:7277';

  /**
   * Returns a deduplicated array of all image URLs with full base URL applied
   */
  protected getAllImageUrls(): string[] {
    if (!this.tour) return [];

    const urls: string[] = [];
    const seen = new Set<string>();

    // Helper to add unique URLs
    const addUrl = (url: string | null | undefined) => {
      if (!url || seen.has(url)) return;
      seen.add(url);
      // Prepend base URL if it's a relative path
      if (url.startsWith('/')) {
        urls.push(`${this.baseUrl}${url}`);
      } else if (url.startsWith('http://') || url.startsWith('https://')) {
        urls.push(url);
      } else {
        urls.push(`${this.baseUrl}/${url}`);
      }
    };

    // Add main image
    addUrl(this.tour.imageUrl);

    // Add gallery images
    if (this.tour.imageUrls?.length) {
      this.tour.imageUrls.forEach(addUrl);
    }

    // Fallback
    if (urls.length === 0) {
      return ['https://via.placeholder.com/400x300?text=No+Images+Available'];
    }

    return urls;
  }

}
