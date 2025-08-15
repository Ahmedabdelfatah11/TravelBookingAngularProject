import { Component, EventEmitter, Output, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.css'
})
export class Filters {
  search = signal('');
  sort = signal('');

  @Output() filterChange = new EventEmitter<any>();

  applyFilters() {
    const filters = {
      Search: this.search(),
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
    this.search.set('');
    this.sort.set('');

    // Emit empty filter object to parent
    this.filterChange.emit({});
  }
}
