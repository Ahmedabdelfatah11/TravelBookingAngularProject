import { Component, Input } from '@angular/core';
import { Flight } from '../flight-model';

@Component({
  selector: 'app-flight-card',
  imports: [],
  templateUrl: './flight-card.html',
  styleUrl: './flight-card.css'
})
export class FlightCard {
  @Input() flight: Flight | undefined;
}
