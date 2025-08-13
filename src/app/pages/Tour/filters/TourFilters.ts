import { Component, EventEmitter, inject, Output, signal, WritableSignal } from '@angular/core';
import { TourService } from '../../../Service/tour-service';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { TourFilterParams } from '../../../Models/tourModel';

@Component({
  selector: 'app-TourFilter',
  imports: [NgxSliderModule],
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
  selectedCategory = signal<string>(''); // ⬅️ single string now

onCategorySelect(category: string) {
  this.selectedCategory.set(category);
}

  private tourService = inject(TourService);
  @Output() filterChanges = new EventEmitter<any>();
  constructor() {
    this.loadPriceBounds();
  }
minPriceBound = signal(500);
maxPriceBound = signal(5000);
loadPriceBounds() {
  const defaultParams = {}; // no filters applied
  this.tourService.getFilteredTours(defaultParams).subscribe({
    next: (res:any) => {
      const bounds = res.priceBounds;
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
  const filters: TourFilterParams = {
    Destination: this.destination(),
    Category: this.selectedCategories(),
    minPrice: Math.min(this.minPrice(), this.maxPrice()),
    maxPrice: Math.max(this.minPrice(), this.maxPrice()),
    Sort: this.sort()
  };

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
get minPriceValue(): number {
  return this.minPrice();
}
set minPriceValue(val: number) {
  this.minPrice.set(val);
}

get maxPriceValue(): number {
  return this.maxPrice();
}
set maxPriceValue(val: number) {
  this.maxPrice.set(val);
}
get priceOptions() {
  return {
    floor: this.minPriceBound(),
    ceil: this.maxPriceBound(),
    step: 50,
    showTicks: true,
    enforceRange: true
  };
}


categoryOptions = ['Adventure', 'Relaxation', 'Cultural', 'Nature', 'Historical'];
selectedCategories = signal<string[]>([]);

onCategoryToggle(category: string, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  const current = this.selectedCategories();

  const updated = checked
    ? [...current, category]
    : current.filter(c => c !== category);

  this.selectedCategories.set(updated);
}

resetFilters() {
  // Reset signals to default values
  this.destination.set('');
  this.selectedCategories.set([]);
  this.selectedCategory.set('');
  this.sort.set('');
  this.loadPriceBounds(); // Reset price range to default bounds

  // Emit empty filter object to parent
  this.filterChanges.emit({});
}
}


