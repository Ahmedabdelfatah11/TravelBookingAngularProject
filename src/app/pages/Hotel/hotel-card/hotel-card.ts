import { Component, effect, inject, Input, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hotel } from '../../../Models/hotel';
import { Favorites } from '../../../Service/favorites';
import { Favorite } from '../../../Models/favorite';
@Component({
  selector: 'app-hotel-card',
  imports: [RouterLink],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.css'
})


export class HotelCard {
  @Input() hotel: Hotel | undefined;
   // ✅ إشارة (signal) لحالة المفضلة
  isFavoriteSignal = signal<boolean>(false);
  favIdSignal = signal<number | null>(null);

  favouriteService = inject(Favorites);

  constructor() {
    // ✅ افحص حالة المفضلة بمجرد توفر hotel.id
    effect(() => {
      const hotelId = this.hotel?.id;
      if (hotelId) {
        this.loadFavoriteStatus(hotelId);
      }
    });
  }

  // ✅ دالة غير متزامنة (async) بس تستخدم signal
  loadFavoriteStatus(hotelId: number) {
    this.favouriteService.getFavoritebytype("hotel").subscribe({
      next: (favorites: Favorite[]) => {
        const fav = favorites.find(f => f.hotelCompanyId === hotelId);
        if (fav) {
          this.isFavoriteSignal.set(true);
          this.favIdSignal.set(fav.id);
        } else {
          this.isFavoriteSignal.set(false);
          this.favIdSignal.set(null);
        }
      },
      error: (err) => {
        console.error('Error loading favorite status:', err);
        this.isFavoriteSignal.set(false);
        this.favIdSignal.set(null);
      }
    });
  }

  addTofavorites() {
    const hotelId = this.hotel?.id;
    if (!hotelId) return;

    this.favouriteService.addToFavorites(hotelId, 'hotel').subscribe({
      next: (response) => {
        console.log('Added to favorites:', response);
        this.favIdSignal.set(response.id);
        this.isFavoriteSignal.set(true);
        alert('تمت الإضافة إلى المفضلة!');
      },
      error: (error) => {
        console.error('Error adding to favorites:', error);
      }
    });
  }

  removeFromFavorites() {
    const favId = this.favIdSignal();
    if (!favId) {
      console.error('No favorite ID to remove');
      return;
    }

    this.favouriteService.removeFromFavorites(favId).subscribe({
      next: () => {
        console.log('Removed from favorites');
        this.isFavoriteSignal.set(false);
        this.favIdSignal.set(null);
        alert('تم الحذف من المفضلة!');
      },
      error: (error) => {
        console.error('Error removing from favorites:', error);
      }
    });
  }
  getStars(rating: string): number[] {
    const numericRating = Number(rating);
    return Array(Math.floor(numericRating)).fill(0);
  }

  getEmptyStars(rating: string): number[] {
    const numericRating = Number(rating);
    return Array(5 - Math.floor(numericRating)).fill(0);
  }
  
}
