import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Flight } from './pages/Flight/flight/flight';
import { FlightDetails } from './pages/flight-details/flight-details';
import { HotelDetails } from './pages/hotel-details/hotel-details';
import { Hotel } from './pages/Hotel/hotel/hotel';
import { ConfirmEmail } from './Features/auth/confirm-email/confirm-email';
import { ForgetPassword } from './Features/auth/forget-password/forget-password';
import { Login } from './Features/auth/login/login';
import { Register } from './Features/auth/register/register';
import { ResendConfirmationEmail } from './Features/auth/resend-confirm-email/resend-confirm-email';
import { ResetPassword } from './Features/auth/reset-password/reset-password';
import { Invalid } from './shared/invalid/invalid';
import { Payment } from './pages/payment/payment';
import { Profile } from './pages/profile/profile';
import { CarBody } from './pages/Car/car-body/car-body';
import { CarDetails } from './pages/car-details/car-details';
import { BookDetail } from './pages/book-detail/book-detail';


export const routes: Routes =
  [
    { path: 'home', component: Home, title: 'Home' },

    { path: 'login', component: Login, title: 'Login' },
    { path: 'register', component: Register, title: 'Register' },
    { path: 'confirm-email', component: ConfirmEmail, title: 'Confirm Email' },
    { path: 'resend-confirm', component: ResendConfirmationEmail, title: 'Resend Confirmation' },
    { path: 'forget', component: ForgetPassword, title: 'Forget Password' },
    { path: 'reset', component: ResetPassword, title: 'Reset Password' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'payment/:bookingId', component: Payment, title: 'Payment' },
    { path: "profile",component: Profile},
    { path: 'invalid', component: Invalid },
    // { path: 'flight', component: Flight },
    // { path: 'FlightDetails/:id', component: FlightDetails },
    // { path: 'hotel', component: Hotel },
    // { path: 'hotel-details/:id', component: HotelDetails }, // Assuming you want to use the same component for hotel details

{ path: 'cars', component: CarBody },
{ path: 'cars/:id', component: CarDetails },
{ path: 'Booking/:id', component: BookDetail }, 
{ path: '**', redirectTo: '/invalid', pathMatch: 'full' },
  ];
