import { Component, EventEmitter, Output, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css'
})
export class Filters {

  departureAirport = signal('');
  arrivalAirport = signal('');
  departureTime = signal('');
  arrivalTime = signal('');
  sort = signal('');

  @Output() filterChange = new EventEmitter<any>();

  applyFilters() {
    const filters = {
      DepartureAirport: this.departureAirport(),
      ArrivalAirport: this.arrivalAirport(),
      DepartureTime: this.departureTime(),
      ArrivalTime: this.arrivalTime(),
      Sort: this.sort()
    };
    this.filterChange.emit(filters);
  }
  updateSignal(signalVar: WritableSignal<string>, event: Event) {
    const input = event.target as HTMLInputElement;
    signalVar.set(input.value);
  }
  resetFilters() {
    // Reset signals to default values
    this.departureAirport.set('');
    this.arrivalAirport.set('');
    this.departureTime.set('');
    this.sort.set('');
    this.arrivalTime.set(''); // Reset price range to default bounds

    // Emit empty filter object to parent
    this.filterChange.emit({});
  }
}
