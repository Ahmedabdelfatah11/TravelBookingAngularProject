import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Car } from '../../../Models/car';
import { CarService } from '../../../Service/carService';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-body',
  imports: [FormsModule,CommonModule],
  templateUrl: './car-body.html',
  styleUrl: './car-body.css'
})
export class CarBody {
car: Car[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  isLoading = false;
  errorMessage = '';

  searchModel = '';
  location = '';  
  minPrice = 0;
  maxPrice = 10000000;

  constructor(
    private carService: CarService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(pageIndex: number = 1): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.car = [];
    this.currentPage = pageIndex;
    this.cdr.detectChanges();

    this.carService.getFilteredCars(
      this.searchModel,
      this.minPrice,
      this.maxPrice,
      this.location,    
      this.currentPage,
      this.pageSize,
    ).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (response && response.data) {
          this.car = [...response.data];
          this.totalPages = Math.ceil(response.count / this.pageSize);
        } else {
          this.car = [];
          this.totalPages = 1;
        }

        this.isLoading = false;
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('Error Details:', error);
        this.errorMessage = `An error occurred: ${error}`;
        this.isLoading = false;
        this.car = [];
        this.totalPages = 1;

        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadCars();
  }

  resetFilters(): void {
    this.searchModel = '';
    this.location = '';   
    this.minPrice = 0;
    this.maxPrice = 10000000;
    this.currentPage = 1;
    this.loadCars();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadCars(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadCars(this.currentPage + 1);
    }
  }

  navigateToDetails(carId: number): void {
    console.log('Navigating to car details:', carId);
    this.router.navigate(['cars', carId]).then(success => {
      if (!success) {
        console.log('Navigation failed!');
      } else {
        console.log('Navigation successful!');
      }
    });
  }
}
