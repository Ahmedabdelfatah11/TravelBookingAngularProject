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
      NameOrLocation: [''],
      Model:[''],
      Location:[''],
      destination:['']
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
    return ['flight'].includes(this.searchType);
  }

  showDepartureDate(): boolean {
    return ['flight'].includes(this.searchType);
  }
  showLocationOrname(): boolean {
    return ['hotel'].includes(this.searchType);
  }
  showLocation(): boolean {
    return ['cars'].includes(this.searchType);
  }
  showModel(): boolean {
    return ['cars'].includes(this.searchType);
  }
  showReturnDate(): boolean {
    return ['flight'].includes(this.searchType);
  }
  showDestination(): boolean{
    return ['tour'].includes(this.searchType)
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
      NameOrLocation: raw.NameOrLocation,
      model:raw.Model,
      location:raw.Location,
      Destination:raw.destination,

      searchType: raw.searchType,
      

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

  }


}