import { ChangeDetectorRef, Component, NgZone, signal } from '@angular/core';
import { Car, CarSearchData } from '../../../Models/car';
import { CarService } from '../../../Service/carService';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from "../../../shared/header/header";
import { SortOptions } from "../sort-options/sort-options";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-car-body',
  imports: [FormsModule, CommonModule, Header, SortOptions, Footer],
  templateUrl: './car-body.html',
  styleUrl: './car-body.css'
})
export class CarBody {

  cars: Car[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  isLoading = false;
  errorMessage = '';
  searchModel: string = '';
  location = '';
  Sort = signal<string>('');
  minPrice = 0;
  maxPrice = 10000000;
  searchData: CarSearchData | null = null;


  constructor(
    private carService: CarService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,

  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { searchData: CarSearchData };
    if (state?.searchData) {
      this.searchData = state.searchData;
      console.log('Received search data:', state.searchData);

      if (this.searchData !== null) {
        this.searchModel = this.searchData.model ?? '';
        this.location = this.searchData.location ?? '';
      }
    }


  }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(pageIndex: number = 1): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cars = [];
    this.currentPage = pageIndex;
    this.cdr.detectChanges();

    this.carService.getFilteredCars(
      this.searchModel,
      this.minPrice,
      this.maxPrice,
      this.location,
      this.Sort(),
      this.currentPage,
      this.pageSize,
    ).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (response && response.data) {
          this.cars = [...response.data];
          this.totalPages = Math.ceil(response.count / this.pageSize);
        } else {
          this.cars = [];
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
        this.cars = [];
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
    this.Sort.set('');
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Navigating to car details:', carId);
    this.router.navigate(['cars', carId]).then(success => {
      if (!success) {
        console.log('Navigation failed!');
      } else {
        console.log('Navigation successful!');
      }
    });
  }
  onSortChange(sort: string) {
    this.Sort.set(sort);
    this.currentPage = 1;
    this.ngZone.run(() => {
      this.cdr.detectChanges();
    });
    this.loadCars();
  }
}
