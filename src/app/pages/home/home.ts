import { Component } from '@angular/core';
import { Header } from "../../shared/header/header";
import { SearchBarComponent } from "./search-bar/search-bar";
import { Footer } from "../../shared/footer/footer";

import { Body } from './body/body';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, Body, SearchBarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  Image = 'img/Cover.jpg';
}
