import { Component, Input } from '@angular/core';
import { Header } from "./header/header";
import { SearchBarComponent } from "./search-bar/search-bar";
import { Footer } from "../../shared/footer/footer";
import { ReactiveFormsModule } from '@angular/forms';
import { FlightBody } from "../Flight/flight-body/flight-body";
import { Body } from './body/body';
// import { Flight } from "../Flight/flight/flight";

@Component({
  selector: 'app-home',
  imports: [Header, Footer, Body, SearchBarComponent, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  @Input() description: string = '';
  @Input() buttonText: string = '';
}
