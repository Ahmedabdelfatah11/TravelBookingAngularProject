import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Invalid } from './components/invalid/invalid';
import { Flight } from './pages/Flight/flight/flight';
import { FlightDetails } from './pages/flight-details/flight-details';


export const routes: Routes =
  [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'invalid', component: Invalid },
    { path: 'flight', component: Flight },
    { path: 'FlightDetails/:id', component: FlightDetails },
    { path: '**', redirectTo: '/invalid', pathMatch: 'full' }

  ];
