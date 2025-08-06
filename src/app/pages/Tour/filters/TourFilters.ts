import { Component, EventEmitter, inject, Output, signal, WritableSignal } from '@angular/core';
import { TourService } from '../../../Service/tour-service';

@Component({
  selector: 'app-TourFilter',
  imports: [],
  templateUrl: './TourFilters.html',
  styleUrl: './TourFilters.css',
  standalone:true
})
export class Filters {
destination = signal('');
  category = signal('');
  minPrice = signal(0);
  maxPrice = signal(0);
  sort = signal('');
  
  private tourService = inject(TourService);
  @Output() filterChanges = new EventEmitter<any>();
  constructor() {
    this.loadPriceBounds();
  }
minPriceBound = signal(500);
maxPriceBound = signal(5000);
loadPriceBounds() {
  this.tourService.getPriceBounds().subscribe({
    next: bounds => {
      this.minPriceBound.set(bounds.min);
      this.maxPriceBound.set(bounds.max);
      this.minPrice.set(bounds.min);
      this.maxPrice.set(bounds.max);
    },
    error: () => {
      this.minPriceBound.set(500);
      this.maxPriceBound.set(5000);
      this.minPrice.set(500);
      this.maxPrice.set(5000);
    }
  });
}

  applyFilters() {
   const min = Math.min(this.minPrice(), this.maxPrice());
const max = Math.max(this.minPrice(), this.maxPrice());

const filters = {
  Destination: this.destination(),
  Category: this.category(),
  minPrice: min,
  maxPrice: max,
  Sort: this.sort()
};
  console.log('Hello');
  this.filterChanges.emit(filters);

  }

  
  updateSignal<T>(signalVar: WritableSignal<T>, event: Event) {
  const input = event.target as HTMLInputElement;
  let value: unknown = input.value;

  if (typeof signalVar() === 'number') {
    value = Number(value);
  }

  signalVar.set(value as T);
}
onPriceChange(signalVar: WritableSignal<number>, event: Event) {
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);

  if (signalVar === this.minPrice) {
    this.minPrice.set(value);
  } else if (signalVar === this.maxPrice) {
    this.maxPrice.set(value);
  }
}
}


