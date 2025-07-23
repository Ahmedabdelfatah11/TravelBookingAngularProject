import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
  imports: [ReactiveFormsModule]
})
export class SearchBarComponent {
  searchForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchType: ['flights'],
      from: [''],
      to: [''],
      departureDate: [''],
      returnDate: [''],
      guests: [1]
    });
  }
  get searchType() {
    return this.searchForm.get('searchType')?.value;
  }

  get f() {
    return this.searchForm.controls;
  }
  showFromSection(): boolean {
    return ['flights'].includes(this.searchType);
  }

  showToSection(): boolean {
    return ['flights', 'hotels', 'tours', 'cars'].includes(this.searchType);
  }

  showDepartureDate(): boolean {
    return ['flights', 'hotels', 'cars', 'tours'].includes(this.searchType);
  }

  showReturnDate(): boolean {
    return ['flights', 'hotels', 'cars', 'tours'].includes(this.searchType);
  }


  onSubmit() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    // Call service to submit form
    console.log('Form Value:', this.searchForm.value);
    // this.searchService.submitSearch(this.searchForm.value);
  }
  ngOnInit() {
    this.searchForm.get('searchType')?.valueChanges.subscribe(val => {
      // You can add extra logic here when search type changes
    });

    this.searchForm.get('departureDate')?.valueChanges.subscribe(() => {
      this.validateReturnDate();
    });
  }

  private validateReturnDate() {
    const returnDateCtrl = this.searchForm.get('returnDate');
    const departureDate = this.searchForm.get('departureDate')?.value;

    if (this.searchType === 'flights' || this.searchType === 'cars') {
      if (!departureDate) return;

      returnDateCtrl?.setValidators(Validators.required);
    } else {
      returnDateCtrl?.clearValidators();
    }

    returnDateCtrl?.updateValueAndValidity();
  }
}