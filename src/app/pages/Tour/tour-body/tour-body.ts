import { Component, AfterViewInit } from '@angular/core';
import Typed from 'typed.js';
@Component({
  selector: 'app-tour-body',
  imports: [],
  templateUrl: './tour-body.html',
  styleUrl: './tour-body.css'
})
export class TourBody implements AfterViewInit {
  ngAfterViewInit(): void {
    const options = {
      strings: ['Your Next Adventure Starts Here', 'Explore Top Destinations with Ease','Plan the Perfect Egyptian Getaway'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true
    };

    new Typed('.typed-text', options);
  }
}
