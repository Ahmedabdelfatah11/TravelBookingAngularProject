import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Invalid } from './components/invalid/invalid';
import { Flight } from './pages/Flight/flight/flight';
import { FlightDetails } from './pages/flight-details/flight-details';
import { HotelDetails } from './pages/hotel-details/hotel-details';
import { Hotel } from './pages/Hotel/hotel/hotel';


export const routes: Routes =
  [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'invalid', component: Invalid },
    { path: 'flight', component: Flight },
    { path: 'FlightDetails/:id', component: FlightDetails },
    { path: 'hotel', component: Hotel },
    { path: 'hotel-details/:id', component: HotelDetails }, // Assuming you want to use the same component for hotel details
    { path: '**', redirectTo: '/invalid', pathMatch: 'full' }

  ];
