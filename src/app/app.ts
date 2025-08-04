import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './pages/home/home';
import { ReactiveFormsModule } from '@angular/forms';
import { CarBody } from './pages/Car/car-body/car-body';
import { CarDetails } from './pages/car-details/car-details';
import { BookDetail } from './pages/book-detail/book-detail';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, ReactiveFormsModule,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'day3';
}
