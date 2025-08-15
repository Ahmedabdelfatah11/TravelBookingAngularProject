import { Component, inject, signal } from '@angular/core';
import { Favorite } from '../../../Models/favorite';
import { Favorites } from '../../../Service/favorites';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-tour-favorites',
  imports: [RouterLink, DatePipe],
  templateUrl: './tour-favorites.html',
  styleUrl: './tour-favorites.css'
})
export class TourFavorites {
  tour= signal<Favorite[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  favouriteService = inject(Favorites);
  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favouriteService.getFavoritebytype('tour').subscribe({
      next: (data) => {
        this.tour.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('فشل تحميل المفضلة. يرجى المحاولة لاحقًا.');
        this.isLoading.set(false);
        console.error('Error loading favorites:', err);
      }
    });
  }
  removeFromFavorites(favId: number): void {
    this.favouriteService.removeFromFavorites(favId).subscribe({
      next: () => {
        // حذف العنصر من القائمة فورًا
        this.tour.update(favs => favs.filter(f => f.id !== favId));
        alert('تم الحذف من المفضلة!');
      },
      error: (err) => {
        console.error('Error removing from favorites:', err);
        alert('فشل الحذف. يرجى المحاولة مرة أخرى.');
      }
    });
  }
}
