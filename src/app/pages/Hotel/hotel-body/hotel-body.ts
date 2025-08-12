import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Filters } from "../filters/filters";
import { SortOptions } from "../sort-options/sort-options";
import { HotelCard } from "../hotel-card/hotel-card";
import { HotelFilterParams } from '../../../Models/hotel';
import { HotelService } from '../../../Service/hotel-service';
import { Router } from '@angular/router';
import * as AOS from 'aos';
@Component({
  selector: 'app-hotel-body',
  imports: [Filters, SortOptions, HotelCard],
  templateUrl: './hotel-body.html',
  standalone: true,
  styleUrl: './hotel-body.css'
})
export class HotelBody {
  hotels = signal<any[]>([]);
  currentPage = signal(1);
  pageSize = signal(5)
  hotelCount = signal(0);
  loading = signal(false);
  filters = signal<HotelFilterParams>({})
  searchData = signal<any>(null); // سيتم تعبئتها من حالة الراوتر
  
  hotelService = inject(HotelService);
  private router = inject(Router);

  constructor() {
    // تهيئة الفلاتر الافتراضية
    this.filters.set({
      Search: '',
      Sort: '',
    });
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { searchData: any };
if (state?.searchData) {
      this.searchData.set(state.searchData);
      console.log('Received search data:', state.searchData);

      // تحويل البيانات إلى الفلاتر المطلوبة
      this.filters.set({
        Search: this.searchData().NameOrLocation,
      });
      console.log('Filters set from search data:', this.filters());
      // تحميل الرحلات بناء على بيانات البحث
      this.loadHotels();
    }
    AOS.init({
      duration: 1000, // مدة التأثير بالمللي ثانية
      once: false      // يشغّل الأنيميشن مرة واحدة فقط
    });
  }
  ngOnInit() {
    // استقبال بيانات البحث من حالة الراوتر
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { searchData: any };

    if (state?.searchData) {
      this.searchData.set(state.searchData);
      console.log('Received search data:', state.searchData);

      // تحويل البيانات إلى الفلاتر المطلوبة
      this.filters.set({
        Search: this.searchData().NameOrLocation,
      });
      console.log('Filters set from search data:', this.filters());
      // تحميل الرحلات بناء على بيانات البحث
      this.loadHotels();
    }
  }
  loadEffect = effect(() => {
  // نربط الـ effect بالإشارات (signals) علشان يعيد التحميل عند التغيير
  const page = this.currentPage();
  const size = this.pageSize();
  const filters = this.filters();

  this.loadHotels();
});

  loadHotels() {
    this.loading.set(true);
    const params = {
      ...this.filters(),
      PageIndex: this.currentPage(),
      PageSize: this.pageSize()
    };
    console.log('Loading hotels with filters:', params);

    this.hotelService.getHotelCompanies(params).subscribe({
      next: (response) => {
        this.hotels.set(response.data);
        this.hotelCount.set(response.count);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.loading.set(false);
      }
    });
    console.log('Loading hotels with filters:', this.filters());
    // محاكاة تحميل البيانات
  }
  nextPage() {
    if (this.currentPage() * this.pageSize() < this.hotelCount()) {
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
    console.log("Sorting by:", sort);
    this.filters.update(f => ({ ...f, Sort: sort }));
    this.currentPage.set(1);
  }

  get totalPages(): number {
    return Math.ceil(this.hotelCount() / this.pageSize());
  }
   get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }
}
