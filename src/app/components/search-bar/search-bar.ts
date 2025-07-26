import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class SearchBarComponent {
  searchForm: FormGroup;
  searchData = signal<any>(null);

  constructor(private fb: FormBuilder, private router: Router) {
    this.searchForm = this.fb.group({
      searchType: ['flight', Validators.required],
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
    return ['flight'].includes(this.searchType);
  }

  showToSection(): boolean {
    return ['flight', 'hotels', 'tours', 'cars'].includes(this.searchType);
  }

  showDepartureDate(): boolean {
    return ['flight', 'hotels', 'cars', 'tours'].includes(this.searchType);
  }

  showReturnDate(): boolean {
    return ['flight', 'cars'].includes(this.searchType);
  }

  onSubmit() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const raw = this.searchForm.value;
    const searchData = {
      DepatureAirport: raw.from,
      ArrivalAirport: raw.to,
      DepartureTime: raw.departureDate,
      ArrivalTime: raw.returnDate,
      Guests: raw.guests
    };

    // حفظ البيانات باستخدام signal
    this.searchData.set(searchData);

    // التنقل مع تمرير البيانات
    this.router.navigate(['/' + raw.searchType], {
      state: { searchData }
    });
    console.log('Search Data:', searchData);
  }

  ngOnInit() {
    this.searchForm.get('searchType')?.valueChanges.subscribe(() => {
      this.updateValidators();
    });

    this.searchForm.get('departureDate')?.valueChanges.subscribe(() => {
      this.validateReturnDate();
    });
  }

  private updateValidators() {
    const fromCtrl = this.searchForm.get('from');
    const toCtrl = this.searchForm.get('to');
    const departureDateCtrl = this.searchForm.get('departureDate');
    const returnDateCtrl = this.searchForm.get('returnDate');

    if (this.showFromSection()) {
      fromCtrl?.setValidators([Validators.required]);
    } else {
      fromCtrl?.clearValidators();
      fromCtrl?.setValue('');
    }

    if (this.showToSection()) {
      toCtrl?.setValidators([Validators.required]);
    } else {
      toCtrl?.clearValidators();
      toCtrl?.setValue('');
    }

    if (this.showDepartureDate()) {
      departureDateCtrl?.setValidators([Validators.required]);
    } else {
      departureDateCtrl?.clearValidators();
      departureDateCtrl?.setValue('');
    }

    if (this.showReturnDate()) {
      returnDateCtrl?.setValidators([Validators.required]);
    } else {
      returnDateCtrl?.clearValidators();
      returnDateCtrl?.setValue('');
    }

    fromCtrl?.updateValueAndValidity();
    toCtrl?.updateValueAndValidity();
    departureDateCtrl?.updateValueAndValidity();
    returnDateCtrl?.updateValueAndValidity();
  }

  private validateReturnDate() {
    const returnDateCtrl = this.searchForm.get('returnDate');
    const departureDate = this.searchForm.get('departureDate')?.value;

    if (['flight', 'cars'].includes(this.searchType)) {
      if (!departureDate) return;
      returnDateCtrl?.setValidators([Validators.required]);
    } else {
      returnDateCtrl?.clearValidators();
    }

    returnDateCtrl?.updateValueAndValidity();
  }
}