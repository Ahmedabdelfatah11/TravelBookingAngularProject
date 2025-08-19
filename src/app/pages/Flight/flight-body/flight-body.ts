import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Flight, FlightFilterParams } from '../../../Models/flight-model';
import { Filters } from "../filters/filters";
import { SortOptions } from "../sort-options/sort-options";
import { FlightCard } from "../flight-card/flight-card";
import { FlightService } from '../../../Service/flightService';
import { Router } from '@angular/router';
import * as AOS from 'aos';
@Component({
  selector: 'app-flight-body',
  imports: [Filters, SortOptions, FlightCard],
  templateUrl: './flight-body.html',
  styleUrl: './flight-body.css'
})
export class FlightBody implements OnInit {
  flights = signal<any[]>([]);
  currentPage = signal(1);
  pageSize = signal(5);
  flightcount = signal(0);
  loading = signal(false);
  filters = signal<FlightFilterParams>({});
  searchData = signal<any>(null);

  flightService = inject(FlightService);
  private router = inject(Router);

  constructor() {
    this.filters.set({
      DepartureAirport: '',
      ArrivalAirport: '',
      DepartureTime: '',
      ArrivalTime: '',
      Sort: ''
    });
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { searchData: any };

    if (state?.searchData) {
      this.searchData.set(state.searchData);
      console.log('Received search data:', state.searchData);

      this.filters.set({
        DepartureAirport: this.searchData().DepatureAirport,
        ArrivalAirport: this.searchData().ArrivalAirport,
        DepartureTime: this.searchData().DepartureTime,
        ArrivalTime: this.searchData().ArrivalTime
      });
      console.log('Filters set from search data:', this.filters());
      this.loadFlights();
    }
  }
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { searchData: any };

    if (state?.searchData) {
      this.searchData.set(state.searchData);
      console.log('Received search data:', state.searchData);

      this.filters.set({
        DepartureAirport: this.searchData().DepatureAirport,
        ArrivalAirport: this.searchData().ArrivalAirport,
        DepartureTime: this.searchData().DepartureTime,
        ArrivalTime: this.searchData().ArrivalTime
      });
      console.log('Filters set from search data:', this.filters());
      this.loadFlights();
    }
    AOS.init({
      duration: 1000,
      once: true
    });
  }
  loadEffect = effect(() => {
    // this.LoadsearchData();
    this.loadFlights();
  });
  // today = new Date();
  // isPast(startDate: string): boolean {
  //   // console.log(this.today, startDate)
  //   return new Date(startDate).getDay <= this.today.getDay;
  // }

  loadFlights() {
    this.loading.set(true);

    const params = {
      ...this.filters(),
      PageIndex: this.currentPage(),
      PageSize: this.pageSize()
    };

    console.log('Loading flights with params:', params);
    this.flightService.getFlights(params).subscribe({
      next: (data) => {
        this.flights.set(data.data);
        this.flightcount.set(data.count);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching flights:', err);
        this.loading.set(false);
      }
    });
  }

  nextPage() {
    if (this.currentPage() * this.pageSize() < this.flightcount()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  onFilterChange(filters: any) {
    this.filters.set(filters);
    this.currentPage.set(1);
  }

  onSortChange(sort: string) {
    this.filters.update(f => ({ ...f, Sort: sort }));
    this.currentPage.set(1);
  }

  get totalPages(): number {
    return Math.ceil(this.flightcount() / this.pageSize());
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }
}