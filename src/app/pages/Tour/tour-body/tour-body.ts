import { Component, AfterViewInit, OnInit, signal, inject, effect, computed } from '@angular/core';
// import Typed from 'typed.js';
import { TourFilterParams, TourResponse } from '../../../Models/tourModel';
import { TourService } from '../../../Service/tour-service';
import { Router } from '@angular/router';
import { TourCard } from "../tour-card/tour-card";
import { Filters } from "../filters/TourFilters";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SortOptions } from '../sort-options/sort-options';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tour-body',
  imports: [SortOptions, TourCard, Filters],
  templateUrl: './tour-body.html',
  styleUrl: './tour-body.css'
})
export class TourBody implements OnInit {

  isMdOrBelow = signal(false);


  constructor(private breakpointObserver: BreakpointObserver,private Toastr : ToastrService) {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe(result => {
        this.isMdOrBelow.set(result.matches);
      });

  }

  Tours = signal<any[]>([]);
  currentPage = signal(1);
  pageSize = signal(5);
  Tourcount = signal(0);
  loading = signal(false);
  filters = signal<TourFilterParams>({});
  searchData = signal<any>(null); // سيتم تعبئتها من حالة الراوتر

  TourService = inject(TourService);
  private router = inject(Router);
  
  ngOnInit() {
    // Step 1: Try getting filters from route state (search page navigation)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { searchData: any };
    console.log('Tour received in card component:', this.Tours);
    if (state?.searchData) {
      this.filters.set({
        Destination: state.searchData.Destination

      });
    } else {
      // Step 2: Fallback to URL query params
      const queryParams = this.router.routerState.snapshot.root.queryParams;

      const destination = queryParams['Destination'];
      const category = queryParams['Category'];
      const price = queryParams['price'];
      const sort = queryParams['Sort'];

      if (destination || category || price || sort) {
        this.filters.set({ Destination: destination, Category: category, Price: price, Sort: sort });
      }
    }
  }
  loadEffect = effect(() => {
    // this.LoadsearchData();
    this.loadTours();
  });


  loadTours() {
    this.loading.set(true);

    const params = {
      ...this.filters(),
      PageIndex: this.currentPage(),
      PageSize: this.pageSize()
    };

    this.TourService.getFilteredTours(params).subscribe({
      next: (data: any) => {
        const tours = data.pagination?.data;
        const count = data.pagination?.count;

        this.Tours.set(tours || []);
        this.Tourcount.set(count || 0);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error fetching tours:', err);
        this.Toastr.error('Error fetching tours:', err);
        this.loading.set(false);
      }
    });
  }

  // باقي الدوال كما هي...
  nextPage() {
    if (this.currentPage() * this.pageSize() < this.Tourcount()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
  onFilterChange(filters: TourFilterParams) {
    this.filters.set(filters);
    this.currentPage.set(1);
  }


  onSortChange(sort: string) {
    this.filters.update(f => ({ ...f, Sort: sort }));
    this.currentPage.set(1);
  }

  get totalPages(): number {
    return Math.ceil(this.Tourcount() / this.pageSize());
  }

  pages = computed(() => {
    const count = Math.ceil(this.Tourcount() / this.pageSize());
    return Array.from({ length: count }, (_, i) => i + 1);
  });



  goToPage(page: number) {
    this.currentPage.set(page);
  }
  


}
