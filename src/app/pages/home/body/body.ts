import { Component, inject, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import * as AOS from 'aos';
import { register } from 'swiper/element/bundle';
import { RouterLink } from '@angular/router';
import { FlightCompany } from '../../../Models/flight-model';
import { FlightService } from '../../../Service/flightService';
import { TourService } from '../../../Service/tour-service';
import { ITourCompany } from '../../../Models/tourModel';



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
  imageList: string[] = [
    'https://i.pinimg.com/736x/7a/74/01/7a7401941b8cbedbfc3262be24b42ff3.jpg',
    'https://i.pinimg.com/736x/58/91/94/5891943b05e7a2a08cee2f3fdc26c90b.jpg',
    'https://i.pinimg.com/1200x/f0/23/ca/f023ca3b2be902777ce2c53196d172cc.jpg',
    'https://i.pinimg.com/1200x/fe/19/cd/fe19cd2a665e33865ce1c72be6f0745c.jpg'
  ];
  cars = [
    "https://i.pinimg.com/1200x/27/b7/de/27b7de9c188db33b73b49b79f9a9e99f.jpg",
    "https://i.pinimg.com/1200x/55/27/f2/5527f222cf8f62f743369b8160f06009.jpg",
    "https://i.pinimg.com/736x/a5/ea/c8/a5eac89ee55ade32ba75162a2ccbebd1.jpg",
    "https://i.pinimg.com/736x/28/de/bc/28debc1fb8adadc2346392696b59cf06.jpg",
    "https://i.pinimg.com/736x/18/af/72/18af72dd5c1c8720e33ad26104a9bbf4.jpg",
    "https://i.pinimg.com/1200x/6a/b7/33/6ab7339e9c55b6218aaee4e43acb108b.jpg",
    "https://i.pinimg.com/1200x/bb/48/69/bb4869b06baf8f2b03d0549993b11efa.jpg",
    "https://i.pinimg.com/1200x/f2/59/fd/f259fdb912b55eff4ffc4710ff13fb28.jpg",
    "https://i.pinimg.com/1200x/10/f4/25/10f4257da8bb72817752bc7e95383e81.jpg",
    "https://i.pinimg.com/1200x/81/26/11/812611c18c61bcebf60bf51e4a434210.jpg",
    "https://i.pinimg.com/736x/f1/65/4b/f1654b5c379e9f6a06377bbf85dbbde2.jpg",
    "https://i.pinimg.com/736x/2d/46/f3/2d46f364e5a5edabc69f6dd4ab0c4e54.jpg"
  ];
  trips = [
    { title: 'Hotels', description: 'Book hotels in minutes', image: 'img/Hotels.jpg', sub: "Explore hotels", subimg: "img/Hotel.jpg", link: '/hotel' },
    { title: 'Flights', description: 'Find affordable flights', image: 'img/Flights.jpg', sub: "Explore Flights", subimg: "img/Flight.jpg", link: '/flight' },
    { title: 'Tours', description: 'Explore new cities', image: 'img/Tours.jpg', sub: "Explore Tours", subimg: "img/Tour.jpg", link: '/tour' },
    { title: 'Cars', description: 'Explore new places easier ', image: 'img/Cars.jpg', sub: "Book Cars", subimg: "img/Car.jpg", link: '/cars' },
  ];
  flightCompany = signal<FlightCompany[]>([]);
  TourCompany =signal<ITourCompany[]>([]);
  loading = signal(false);
  flightService = inject(FlightService);
  tourService = inject(TourService);
  // تفعيل تحميل البيانات عند تغيير الفلاتر أو الصفحة
  ngOnInit(): void {
    this.loadFlights();
    this.loadTours();
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
  loadTours(){
    this.loading.set(true);
    this.tourService.getTourCompany().subscribe({
      next:(data) => {
        this.TourCompany.set(data.data);
        console.log(data)
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching Tours:', err);
        this.loading.set(false);
      }
    })

  };
  trackById(index: number, item: any) {
    return item.id;
  }

  getSlidesPerView(): number {
    return window.innerWidth < 576 ? 2 : 5;
  }
}
