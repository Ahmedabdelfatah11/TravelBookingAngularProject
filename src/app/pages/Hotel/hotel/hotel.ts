import { Component } from '@angular/core';
import { HotelBody } from "../hotel-body/hotel-body";
import { Header } from "../../../shared/header/header";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-hotel',
  imports: [HotelBody, Header, Footer],
  templateUrl: './hotel.html',
  styleUrl: './hotel.css'
})
export class Hotel {
  Image: string = 'img/12.jpg';
}
