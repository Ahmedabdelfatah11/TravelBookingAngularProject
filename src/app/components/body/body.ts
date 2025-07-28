import { Component, inject, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlightService } from '../../Service/flightService';
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
  cars = [
    "https://i.pinimg.com/1200x/27/b7/de/27b7de9c188db33b73b49b79f9a9e99f.jpg",
    "https://i.pinimg.com/1200x/55/27/f2/5527f222cf8f62f743369b8160f06009.jpg",
    "https://i.pinimg.com/736x/a5/ea/c8/a5eac89ee55ade32ba75162a2ccbebd1.jpg",
    "https://i.pinimg.com/736x/a7/f6/06/a7f606bf22838e1cf4f54d9b41635683.jpg",
    "https://i.pinimg.com/736x/2f/3b/f9/2f3bf9f0ea31ffd6008db72fef359b2a.jpg",
    "https://i.pinimg.com/736x/9c/dc/b3/9cdcb3ce1f2d094f48e391e74d44105e.jpg",
    "https://i.pinimg.com/736x/d2/59/dc/d259dcd272a3ca9b538e68aedf721fb3.jpg",
    "https://i.pinimg.com/1200x/f2/59/fd/f259fdb912b55eff4ffc4710ff13fb28.jpg",
    "https://i.pinimg.com/1200x/10/f4/25/10f4257da8bb72817752bc7e95383e81.jpg",
    "https://i.pinimg.com/1200x/81/26/11/812611c18c61bcebf60bf51e4a434210.jpg",
    "https://i.pinimg.com/736x/03/da/12/03da12c97ce7c9c1e534c486a134bb40.jpg",
    "https://i.pinimg.com/736x/25/70/75/257075a1e799f95704c721f6fc3e28bd.jpg"
  ];
  trips = [
    { title: 'Hotels', description: 'Book hotels in minutes', image: 'img/Hotels.jpg', sub: "Explore hotels", subimg: "img/Hotel.jpg", link: '/hotel' },
    { title: 'Flights', description: 'Find affordable flights', image: 'img/Flights.jpg', sub: "Explore Flights", subimg: "img/Flight.jpg", link: '/flight' },
    { title: 'Tours', description: 'Explore new cities', image: 'img/Tours.jpg', sub: "Explore Tours", subimg: "img/Tour.jpg", link: '/tour' },
    { title: 'Cars', description: 'Explore new places easier ', image: 'img/Cars.jpg', sub: "Book Cars", subimg: "img/Car.jpg", link: '/car' },
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
