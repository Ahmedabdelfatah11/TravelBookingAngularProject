import { Component, inject, signal } from '@angular/core';
import { Booking } from '../../../Models/booking';
import { BookingService } from '../../../Service/booking-service';
import { CommonModule, DatePipe } from '@angular/common';
import { MaskStringPipe } from '../../../Pipes/mask-string-pipe';
import { RouterLink } from '@angular/router';
import { BookingBodyDetails } from "../booking-body-details/booking-body-details";


@Component({
  selector: 'app-booking-body',
  imports: [CommonModule, BookingBodyDetails],
  templateUrl: './booking-body.html',
  styleUrl: './booking-body.css'
})
export class BookingBody {

  

}
