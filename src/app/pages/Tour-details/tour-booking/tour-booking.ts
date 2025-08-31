import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourBookingService } from '../../../Service/tour-booking-service';
import { Tours, TourTicket } from '../../../Models/tourModel';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tour-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tour-booking.html',
  styleUrls: ['./tour-booking.css']
})
export class TourBookingComponent {
  @Input() tour!: Tours;
  @Input() serviceId!: number;
  loading = false;
  router = inject(Router);
  private bookingService = inject(TourBookingService);
  private toastr = inject(ToastrService);
  today = new Date();

  get activeTickets(): TourTicket[] {
    return this.tour?.tourTickets?.filter(t => t.isActive) ?? [];
  }
  isPast(startDate: string): boolean {
    return new Date(startDate).getDay <= this.today.getDay ;
  }
  ngOnInit() {
    if (this.tour?.tickets) {
      this.tour.tourTickets = this.tour.tickets.map(t => ({
        ...t,
        quantity: 0
      }));
    }

    if (this.tour?.startDate) {
      const rawDate = new Date(this.tour.startDate);
      this.tour.startDate = rawDate.toISOString().substring(0, 10);
    }
  }

  getTicketTotal(ticket: TourTicket): number {
    return ticket.quantity * ticket.price;
  }

  getTotalPrice(): number {
    return this.activeTickets
      .map(ticket => ticket.price * ticket.quantity)
      .reduce((sum, current) => sum + current, 0);
  }

  onBookClick() {
    console.log('Service ID:', this.serviceId); // Debug log

    if (!this.serviceId) {
      this.toastr.error('Invalid tour ID');
      return;
    }

    if (!this.tour?.tourTickets) {
      this.toastr.error('Tour tickets not available');
      return;
    }

    const selectedTickets = this.tour.tourTickets
      .filter(t => t.quantity > 0)
      .map(t => ({
        type: t.type,
        quantity: t.quantity
      }));

    if (selectedTickets.length === 0) {
      this.toastr.warning('Please select at least one ticket');
      return;
    }

    this.loading = true;

    this.bookingService.bookTour(this.serviceId, { Tickets: selectedTickets }).subscribe({
      next: (response) => {
        console.log('Booking response:', response);
        this.loading = false;
        if (!response || !response.bookingId) {
          throw new Error('Invalid booking response - missing bookingId');
        }

        console.log('Booking successful, navigating to payment with ID:', response.bookingId);

        this.router.navigate(['/payment', response.bookingId]);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Booking failed. Please try again.');
        console.error('Booking error:', err);
      }
    });
  }

}