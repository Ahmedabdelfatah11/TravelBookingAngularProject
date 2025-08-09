import { Component, inject, signal } from '@angular/core';
import { DateRange, Hotel, Room } from '../../../Models/hotel';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService } from '../../../Service/hotel-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CreateReview, ReviewStats } from '../../../Models/reviews';
import { ReviewService } from '../../../Service/review-service';
import { Auth } from '../../../Service/auth';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// Import Bootstrap types if available
declare var bootstrap: any;



@Component({
  selector: 'app-hotel-details-body',
  imports: [DatePipe, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './hotel-details-body.html',
  styleUrl: './hotel-details-body.css'
})
export class HotelDetailsBody {
  hotel = signal<Hotel | null>(null);
  isLoading = signal({ hotel: true, reviews: true });
  error = signal<string | null>(null);
  // Reviews
  reviewStats = signal<ReviewStats | null>(null);
  showReviewForm = signal<boolean>(false);
  hasReviewed = signal<boolean>(false);
  rating = signal<number>(0);
  comment: string = '';
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  bookingId = signal<number | null>(null);
  totalPrice = signal<number>(0);
  // Booking Signals
  showBookingForm = signal<boolean>(false);
  bookingStartDate = signal<Date | null>(null);
  bookingEndDate = signal<Date | null>(null);
  isBooking = signal<boolean>(false);
  bookingSuccess = signal<boolean>(false);
  bookingError = signal<string | null>(null);


  availableGaps = signal<Map<number, DateRange[]>>(new Map());
  isLoadingAvailability = signal<boolean>(false);
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  // Room selection
  // selectedRoomId is a signal that holds the ID of the currently selected room
  // It can be null if no room is selected


  selectedRoomId = signal<number | null>(null);
  hotelId: number = 0;
  hotelCompanyId: number = 0;

  route = inject(ActivatedRoute);
  hotelService = inject(HotelService);
  reviewService = inject(ReviewService);
  authService = inject(Auth);
  router = inject(Router);



  constructor(private toastr: ToastrService) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hotelId = +params['id']; // This is the flight ID from route
      this.loadHotelDetails();

    });
  }


  private loadHotelDetails(): void {
    if (isNaN(this.hotelId)) {
      this.error.set('Invalid hotel ID');
      this.isLoading.update(s => ({ ...s, hotel: false }));
      return;
    }
    this.hotelService.getHotelById(this.hotelId).subscribe({
      next: (response) => {
        this.hotel.set(response);
        this.isLoading.update(s => ({ ...s, hotel: false }));

        if (response && response.id) {
          this.hotelCompanyId = response.id;
          this.loadReviewStats();
          this.checkUserReview();
        }
        for (const room of response.rooms) {
          room.from = new Date(room.from).toISOString();
          room.to = new Date(room.to).toISOString();
          this.loadAvailableDates(room.id, new Date(room.from), new Date(room.to));
        }
      },
      error: (err) => {
        this.error.set('Failed to load hotel details');
        this.isLoading.update(s => ({ ...s, hotel: false }));
      }
    });
  }

  loadAvailableDates(roomId: number, startDate?: Date, endDate?: Date): void {
    const start = startDate ?? this.startDate();
    const end = endDate ?? this.endDate();

    if (!start || !end) {
      this.availableGaps.update(gaps => {
        gaps.set(roomId, []);
        return new Map(gaps);
      });
      return;
    }

    this.hotelService.getAvailableDates(roomId, start, end).subscribe({
      next: (ranges: DateRange[]) => {
        // ✅ حول الـ Start و End من string إلى Date
        const parsedRanges = ranges.map(r => ({
          start: new Date(r.start).toISOString(),
          end: new Date(r.end).toISOString()
        }));

        // ✅ احفظ الفراغات بناءً على roomId
        this.availableGaps.update(gaps => {
          const newMap = new Map(gaps);
          newMap.set(roomId, parsedRanges);
          return newMap;
        });
      },
      error: (err) => {
        console.error(`Failed to load availability for room ${roomId}`, err);
        this.availableGaps.update(gaps => {
          const newMap = new Map(gaps);
          newMap.set(roomId, []);
          return newMap;
        });
      }
    });
  }



  selectedImage: string = '';

  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  private loadReviewStats(): void {
    if (!this.hotelId) {
      console.error('Flight Company ID not available for reviews');
      return;
    }

    console.log('Loading reviews for Flight Company ID:', this.hotelId);

    this.reviewService.getCompanyReviewStats({
      companyType: 'hotel',
      hotelId: this.hotelId // Use flight company ID for reviews
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
    if (!this.authService.isLoggedIn() || !this.hotelId) {
      return;
    }

    const checkData: CreateReview = {
      companyType: 'hotel',
      hotelCompanyId: this.hotelId,
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

    if (!this.hotelCompanyId) {
      alert('hotel information not available');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const reviewData: CreateReview = {
      companyType: 'hotel',
      hotelCompanyId: this.hotelCompanyId,
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
  calculateDurationInDays(departure: string, arrival: string): string {
    const depDate = new Date(departure);
    const arrDate = new Date(arrival);

    // تأكد من صحة التاريخين
    if (isNaN(depDate.getTime()) || isNaN(arrDate.getTime())) {
      return 'N/A';
    }

    // نحسب الفرق بالأيام (نحذف التوقيت ونقارن التواريخ فقط)
    const start = new Date(depDate.getFullYear(), depDate.getMonth(), depDate.getDate());
    const end = new Date(arrDate.getFullYear(), arrDate.getMonth(), arrDate.getDate());

    const durationMs = end.getTime() - start.getTime();
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24)) + 1;

    return `${days} day${days > 1 ? 's' : ''}`;
  }

  // Booking Methods
  openBookingForm(roomId: number) {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please login to book a room');
      return;
    }
    this.selectedRoomId.set(roomId);
    this.showBookingForm.set(true);
    this.bookingSuccess.set(false);
    this.bookingError.set(null);
    this.loadAvailableDates(roomId);
  }

  closeBookingForm() {
    this.showBookingForm.set(false);
    this.bookingStartDate.set(null);
    this.bookingEndDate.set(null);
    this.bookingError.set(null);
    this.bookingSuccess.set(false);
  }

  confirmBooking() {
    if (this.isBooking()) return;
    this.isBooking.set(true);
    this.bookingError.set(null);

    const startDate = this.bookingStartDate();
    const endDate = this.bookingEndDate();

    if (!startDate || !endDate) {
      this.bookingError.set("Please select valid dates.");
      this.isBooking.set(false);
      return;
    }
    console.log('Booking room with ID:', this.selectedRoomId(), 'from', startDate, 'to', endDate);
    this.hotelService.bookRoom(this.selectedRoomId()!, startDate, endDate).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        this.bookingId.set(response.bookingId);
        this.bookingStartDate.set(startDate);
        this.bookingEndDate.set(endDate);
        this.bookingSuccess.set(true);

        this.router.navigate(['/payment', response.bookingId]);
      },
      error: (err) => {
        console.error('Booking error:', err);
        this.isBooking.set(false);
        let errorMessage = 'Failed to book room';
        if (err.error?.message) errorMessage = err.error.message;
        this.bookingError.set(errorMessage);
        alert(errorMessage);
      }
    });
  }
  availableRoomDays(): Date[] {
    const selectedId = this.selectedRoomId();
    if (!selectedId) return [];

    const room = this.hotel()?.rooms?.find(r => r.id === selectedId);
    if (!room) return [];

    const from = new Date(room.from);
    const to = new Date(room.to);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return [];

    const days: Date[] = [];
    let current = new Date(from);
    while (current <= to) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }

  // Minimum Date for Check-in
  minDate(): string {
    const room = this.getCurrentRoom();
    if (!room) return '';
    const min = new Date(Math.max(
      Date.now(),
      new Date(room.from).getTime()
    ));
    return min.toISOString().split('T')[0];
  }

  // Minimum Date for Check-out
  minCheckoutDate(): string {
    const start = this.bookingStartDate();
    if (!start) return this.minDate();
    const nextDay = new Date(start);
    nextDay.setDate(nextDay.getDate());
    return nextDay.toISOString().split('T')[0];
  }

  // Maximum Date for Check-in Check-out
  maxDate(): string {
    const room = this.getCurrentRoom();
    if (!room) return '';
    return new Date(room.to).toISOString().split('T')[0];
  }

  // حدّث StartDate
  onStartDateChange(event: any) {
    const value = event.target.value;
    if (value) {
      this.bookingStartDate.set(new Date(value));
      // امسح end date لو أصغر من الجديد
      const end = this.bookingEndDate();
      if (end && end <= this.bookingStartDate()!) {
        this.bookingEndDate.set(null);
      }
    }
  }

  // حدّث EndDate
  onEndDateChange(event: any) {
    const value = event.target.value;
    if (value) {
      this.bookingEndDate.set(new Date(value));
    }
  }

  // عدد الليالي
  getNumberOfNights(): number {
    const start = this.bookingStartDate();
    const end = this.bookingEndDate();
    if (!start || !end) return 0;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 لأننا نحسب اليوم الأول
    return diffDays > 0 ? diffDays : 1;
  }

  // السعر الكلي
  calculateTotalPrice(): number {
    const room = this.getCurrentRoom();
    const pricePerNight = room?.price ?? 0;
    return pricePerNight * this.getNumberOfNights();
  }

  // جِب الغرفة الحالية
  getCurrentRoom() {
    return this.hotel()?.rooms?.find(r => r.id === this.selectedRoomId());
  }
}


