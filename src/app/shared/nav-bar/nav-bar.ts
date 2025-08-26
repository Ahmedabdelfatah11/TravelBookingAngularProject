import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../Service/auth';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.html',
  standalone: true,
  styleUrl: './nav-bar.css'
})
export class NavBar {
  @Input() isSpecialPage = false;
  auth = inject(Auth);
  router = inject(Router);

  logout() {
    this.auth.Logout();
    this.router.navigate(['/login']);
  }
}
