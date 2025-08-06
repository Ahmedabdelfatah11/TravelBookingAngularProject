import { Component, Input } from '@angular/core';
import { TourImages, Tours } from '../../../Models/tourModel';
import { TourService } from '../../../Service/tour-service';
import { Tour } from '../tour/tour';

@Component({
  selector: 'app-tour-card',
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css'
})
export class TourCard {
  @Input() Tours: Tours | undefined;

  ngOnInit() {
  console.log('Received tour:', this.Tours);
  console.log('Images:', this.Tours?.imageUrls);
}

  saveForLater(id: number | undefined) {
    console.log(`Tour ${id} saved for later.`);
  }
}