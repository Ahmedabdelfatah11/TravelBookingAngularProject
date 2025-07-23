import { Component, Input } from '@angular/core';
import { Flight } from '../../../services/flight-model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-flight-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './flight-card.html',
  styleUrl: './flight-card.css'
})
export class FlightCard {
  saveForLater(arg0: number | undefined) {
    console.log(`Flight ${arg0} saved for later.`);
  }
  @Input() flight: Flight | undefined;
}
