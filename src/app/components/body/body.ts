import { Component, inject, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlightService } from '../../services/flightService';
import { FlightCompany } from '../../Models/flight-model';
import * as AOS from 'aos';
import { register } from 'swiper/element/bundle';
import { RouterLink } from '@angular/router';


// إضافة SwiperModule إلى المكونات المستوردة    
register();
@Component({
  selector: 'app-body',
  imports: [RouterLink],
  templateUrl: './body.html',
  styleUrl: './body.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Body implements OnInit {

  trips = [
    { title: 'Hotels', description: 'Book hotels in minutes', image: 'img/Hotels.jpg', sub: "Explore hotels", subimg: "img/Hotel.jpg" },
    { title: 'Flights', description: 'Find affordable flights', image: 'img/Flights.jpg', sub: "Explore Flights", subimg: "img/Flight.jpg" },
    { title: 'Tours', description: 'Explore new cities', image: 'img/Tours.jpg', sub: "Explore Tours", subimg: "img/Tour.jpg" },
    { title: 'Cars', description: 'Explore new places easier ', image: 'img/Cars.jpg', sub: "Book Cars", subimg: "img/Car.jpg" },
  ];
  flightCompany = signal<FlightCompany[]>([]);
  loading = signal(false);
  flightService = inject(FlightService);

  // تفعيل تحميل البيانات عند تغيير الفلاتر أو الصفحة
  ngOnInit(): void {
    this.loadFlights();
    AOS.init({
      duration: 1000, // مدة التأثير بالمللي ثانية
      once: true      // يشغّل الأنيميشن مرة واحدة فقط
    });
  }

  loadFlights() {
    this.loading.set(true);



    this.flightService.getFlightCompany().subscribe({
      next: (data) => {
        this.flightCompany.set(data);
        console.log(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching flights:', err);
        this.loading.set(false);
      }
    });
  }
  trackById(index: number, item: any) {
    return item.id;
  }

  getSlidesPerView(): number {
    return window.innerWidth < 576 ? 2 : 5;
  }
}
