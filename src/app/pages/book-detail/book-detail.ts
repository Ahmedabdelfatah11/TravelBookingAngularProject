import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarBookingResultDto } from '../../Models/CarBookingResultDto';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css'
})
export class BookDetail implements OnInit {
  booking!: CarBookingResultDto;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const state = history.state;

  if (state && state.booking) {
    this.booking = state.booking;1
    console.log('Loaded from history.state:', this.booking);
  } else {
    const bookingId = +this.route.snapshot.paramMap.get('id')!;
    if (bookingId) {
    } else {
      this.router.navigate(['/cars']);
    }
  }
  }
}
