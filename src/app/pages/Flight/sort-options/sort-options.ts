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

  onSortChange(event: any) {
    this.sort();
    this.sortChange.emit(event.target.value);
  }
}
