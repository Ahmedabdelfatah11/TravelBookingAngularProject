import { Component, Input } from '@angular/core';
import { Header } from "../../components/header/header";
import { SearchBarComponent } from "../../components/search-bar/search-bar";
import { Card } from "../../components/card/card";
import { Newsletter } from "../../components/newsletter/newsletter";
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
