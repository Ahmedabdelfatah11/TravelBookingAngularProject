import { Component, inject, signal } from '@angular/core';
import { Booking } from '../../../Models/booking';
import { BookingService } from '../../../Service/booking-service';
import { CommonModule, DatePipe } from '@angular/common';
import { MaskStringPipe } from '../../../Pipes/mask-string-pipe';
import { RouterLink } from '@angular/router';
import * as AOS from 'aos';


@Component({
  selector: 'app-booking-body',
  imports: [DatePipe,MaskStringPipe,RouterLink,CommonModule ],
  templateUrl: './booking-body.html',
  styleUrl: './booking-body.css'
})
export class BookingBody {

  Bookings = signal<Booking[]>([]);
  BookingService = inject(BookingService);
  loading = signal(false);
  error = signal<string | null>(null);
  constructor() {
    this.loadBookings();
  }
  ngOninit() {
     AOS.init({
          duration: 1000, // مدة التأثير بالمللي ثانية
          once: false      // يشغّل الأنيميشن مرة واحدة فقط
        });
  }
  loadBookings() {
    this.loading.set(true);
    const userEmail = localStorage.getItem('userId');
    this.BookingService.GetAllBookings().subscribe({
      next: (bookings) => {
        for (let booking of bookings) {
          if (booking.customerEmail === userEmail) {
            this.Bookings.update((currentBookings) => [...currentBookings, booking]);
          }
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.error.set('failed to load bookings. Please try again later.');
        this.loading.set(false);
      }
    });
  }
  deleteBooking(bookingId: number) {
    this.BookingService.DeleteBooking(bookingId).subscribe({
      next: () => {
        this.Bookings.update((currentBookings) => currentBookings.filter(b => b.id !== bookingId));
      },
      error: (error) => {
        console.error('Error deleting booking:', error);
        this.error.set('Failed to delete booking. Please try again later.');
      }
    });
  }
calculateNights(startDate: string,endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // +1 to include the start date
    return daysDiff;
  }


}
