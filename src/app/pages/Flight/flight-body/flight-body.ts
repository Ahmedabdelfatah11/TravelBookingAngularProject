import { Component, effect, inject, signal } from '@angular/core';
import { Flight, FlightFilterParams } from '../../../services/flight-model';
import { Filters } from "../filters/filters";
import { SortOptions } from "../sort-options/sort-options";
import { FlightCard } from "../flight-card/flight-card";
import { FlightService } from '../../../services/flightService';

@Component({
  selector: 'app-flight-body',
  imports: [Filters, SortOptions, FlightCard],
  templateUrl: './flight-body.html',
  styleUrl: './flight-body.css'
})
export class FlightBody {
  flights = signal<any[]>([]);
  currentPage = signal(1);
  pageSize = signal(5);
  flightcount = signal(0);
  loading = signal(false);

  filters = signal<FlightFilterParams>({});
  flightService = inject(FlightService);

  // تفعيل تحميل البيانات عند تغيير الفلاتر أو الصفحة
  loadEffect = effect(() => {
    this.loadFlights();
  });

  loadFlights() {
    this.loading.set(true);

    const params = {
      ...this.filters(),
      PageIndex: this.currentPage(),
      PageSize: this.pageSize()
    };

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