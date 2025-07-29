import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, Input, input, signal } from '@angular/core';
import { FlightDetails } from '../../../Models/flight-model';
export type TravelClass = 'economy' | 'firstClass' | 'business';
@Component({
  selector: 'app-flight-details-card',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './flight-details-card.html',
  styleUrl: './flight-details-card.css'
})
export class FlightDetailsCard {
  private flightSignal = signal<FlightDetails | null>(null);

  @Input() set flight(value: FlightDetails | null) {
    this.flightSignal.set(value);
  }
  get availableSeats() {
    return this.flightSignal()!.economySeats + this.flightSignal()!.businessSeats + this.flightSignal()!.firstClassSeats;
  }
  get flight() {
    return this.flightSignal();
  }
  // Signal للتحكم في الدرجة المختارة
  selectedClass = signal<TravelClass>('economy');

  // Signal لحساب السعر حسب الدرجة
  displayPrice = computed(() => {
    const flight = this.flightSignal();
    console.log(flight);
    if (!flight) return 0;
    let basePrice = flight.economyPrice;
    switch (this.selectedClass()) {
      case 'firstClass':
        basePrice = flight.firstClassPrice;
        return basePrice;
      case 'business':
        basePrice = flight.businessPrice;
        return basePrice;
      default:
        return basePrice;
    }
  });

  // دالة لتغيير الدرجة
  onClassChange(e: any) {
    this.selectedClass.set(e?.target?.value as TravelClass);
    console.log(e?.target?.value);
  }

  calculateDuration(departure: string, arrival: string): string {
    const depTime = new Date(departure);
    const arrTime = new Date(arrival);

    // Handle invalid dates
    if (isNaN(depTime.getTime()) || isNaN(arrTime.getTime())) {
      return 'N/A';
    }

    const duration = arrTime.getTime() - depTime.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }
}
