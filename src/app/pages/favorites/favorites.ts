import { Component } from '@angular/core';
import { FavBody } from "./fav-body/fav-body";
import { NavBar } from "../../shared/nav-bar/nav-bar";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: 'app-favorites',
  imports: [FavBody, NavBar, Footer],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites {
ngOnInit() {
    document.body.classList.add('home-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-body');
  }
}
