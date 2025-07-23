import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.css'
})
export class Filters {
  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      priceRange: [null],
      departureTime: [null],
      rating: [[]],
      airlines: [[]],
      tripType: [[]]
    });
  }
}
