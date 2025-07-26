import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ConfirmEmail } from './Features/auth/confirm-email/confirm-email';
import { ForgetPassword } from './Features/auth/forget-password/forget-password';
import { Login } from './Features/auth/login/login';
import { Register } from './Features/auth/register/register';
import { ResendConfirmationEmail } from './Features/auth/resend-confirm-email/resend-confirm-email';
import { ResetPassword } from './Features/auth/reset-password/reset-password';


export const routes: Routes =
  [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'home', component: Home ,title: 'Home'}, 
    { path: 'login', component: Login ,title: 'Login' },
    { path: 'register', component: Register ,title: 'Register' },
    { path: 'confirm-email', component: ConfirmEmail ,title: 'Confirm Email' },
    { path: 'resend-confirm', component: ResendConfirmationEmail ,title: 'Resend Confirmation' },
    { path: 'forget', component: ForgetPassword ,title: 'Forget Password' },
    { path: 'reset', component: ResetPassword ,title: 'Reset Password' }, 

  ];
