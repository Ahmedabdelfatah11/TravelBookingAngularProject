import { Component } from '@angular/core';

@Component({
  selector: 'app-sort-options',
  imports: [],
  templateUrl: './sort-options.html',
  styleUrl: './sort-options.css'
})
export class SortOptions {
  sortOptions = [
    { label: 'Cheapest', value: 'cheapest' },
    { label: 'Best', value: 'best' },
    { label: 'Quickest', value: 'quickest' },
    { label: 'Recommended', value: 'recommended' }
  ];

  selectedSortOption = 'recommended';
}
