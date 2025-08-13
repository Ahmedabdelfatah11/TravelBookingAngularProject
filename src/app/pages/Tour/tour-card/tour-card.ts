import { Component, inject, Input } from '@angular/core';
import { TourImages, Tours } from '../../../Models/tourModel';
import { TourService } from '../../../Service/tour-service';
import { Tour } from '../tour/tour';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Favorites } from '../../../Service/favorites';

@Component({
  selector: 'app-tour-card',
  imports:[RouterModule],
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css'
})
export class TourCard {
  @Input() Tours: Tours | undefined;
private favouriteService = inject(Favorites);
private toastr = inject(ToastrService);
    private route = inject(ActivatedRoute);

 tourId!: number;
 constructor() {
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
  }
  ngOnInit() {
  console.log('Received tour:', this.Tours);
  console.log('Images:', this.Tours?.imageUrls);
}

  saveForLater(id: number | undefined) {
    console.log(`Tour ${id} saved for later.`);
  }
 getDurationInDays(start?: string | Date, end?: string | Date): number {
  if (!start || !end) return 0; // or return NaN, or show a fallback
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
addToWishlist(id: number | undefined): void {
  console.log('Trying to add tour ID:', id);

  if (!id) {
    this.toastr.error('Invalid tour ID.');
    return;
  }

  this.favouriteService.addTourToFavorites(id).subscribe({
    next: () => {
      this.toastr.success('Tour added to your wishlist!');
    },
    error: (err: any) => {
      if (err.status === 409) {
        this.toastr.warning('This tour is already in your wishlist.');
      } else {
        this.toastr.error('Something went wrong. Please try again.');
      }
    }
  });
}
}