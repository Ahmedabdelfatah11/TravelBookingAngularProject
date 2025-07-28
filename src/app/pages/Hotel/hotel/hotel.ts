import { Component } from '@angular/core';
import { HotelBody } from "../hotel-body/hotel-body";
import { Header } from "../../../components/header/header";
import { Footer } from "../../../components/footer/footer";

@Component({
  selector: 'app-hotel',
  imports: [HotelBody, Header, Footer],
  templateUrl: './hotel.html',
  styleUrl: './hotel.css'
})
export class Hotel {

}
