import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TourBookingPayload, TourBookingService } from '../../../Service/tour-booking-service';
import { Tours, TourTicket } from '../../../Models/tourModel';

@Component({
  selector: 'app-tour-booking',
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tour-booking.html',
  styleUrls: ['./tour-booking.css']
})
export class TourBookingComponent {
  bookingForm: FormGroup;
  loading = false;
@Input() serviceId!: number;

@Input() tour!: Tours;

get activeTickets(): TourTicket[] {
  return this.tour?.tourTickets?.filter(t => t.isActive) ?? [];
}
  constructor(private fb: FormBuilder, private http: HttpClient,
  private bookingService: TourBookingService) {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
      notes: ['']
    });
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
submitBooking(): void {
  if (this.bookingForm.invalid || !this.serviceId) return;

  this.loading = true;

  const selectedTickets = this.tour.tourTickets
  .filter(t => t.quantity > 0)
  .map(t => ({
    type: t.type,
    quantity: t.quantity
  }));

  const payload: TourBookingPayload = {
    tickets: selectedTickets
  };



  this.bookingService.bookTour(this.serviceId, payload).subscribe({
    next: () => {
      this.loading = false;
      document.getElementById('openModalBtn')?.click();
      this.bookingForm.reset();
    },
    error: (err) => {
      this.loading = false;
      console.error('Booking failed:', err);
    }
  });
}


}