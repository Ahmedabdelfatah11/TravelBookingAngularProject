import { Component } from '@angular/core';
import { HotelFavorites } from "../hotel-favorites/hotel-favorites";
import { TourFavorites } from "../tour-favorites/tour-favorites";


@Component({
  selector: 'app-fav-body',
  imports: [HotelFavorites, TourFavorites],
  templateUrl: './fav-body.html',
  styleUrl: './fav-body.css'
})
export class FavBody {

}
