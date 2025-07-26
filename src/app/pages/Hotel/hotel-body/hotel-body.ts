import { Component } from '@angular/core';
import { Filters } from "../filters/filters";
import { SortOptions } from "../sort-options/sort-options";
import { HotelCard } from "../hotel-card/hotel-card";

@Component({
  selector: 'app-hotel-body',
  imports: [Filters, SortOptions, HotelCard],
  templateUrl: './hotel-body.html',
  standalone: true,
  styleUrl: './hotel-body.css'
})
export class HotelBody {

}
