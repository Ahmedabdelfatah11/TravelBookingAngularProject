import { Component, effect, inject, Input, signal } from '@angular/core';
import { Flight } from '../../../Models/flight-model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-flight-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './flight-card.html',
  styleUrl: './flight-card.css'
})
export class FlightCard {

  @Input() flight: Flight | undefined;

  constructor() {
  }


}
