import { Component } from '@angular/core';
import { NavBar } from "../../shared/nav-bar/nav-bar";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: 'app-contactus',
  imports: [NavBar, Footer],
  templateUrl: './contactus.html',
  styleUrl: './contactus.css'
})
export class Contactus { 

}
