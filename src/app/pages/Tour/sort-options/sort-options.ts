import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-sort-options',
  imports: [],
  templateUrl: './sort-options.html',
  styleUrl: './sort-options.css'
})
export class SortOptions {
 sort = signal('');

  @Output() sortChange = new EventEmitter<string>();

  onSortChange(value: string) {
    this.sort();
    this.sortChange.emit(value);
  }
   getSortLabel(sortValue: string): string {
    switch (sortValue) {
      case 'priceasc':
        return 'priceasc';
      case 'pricedesc':
        return 'pricedesc';

      default:
        return '';
    }
  }
}
