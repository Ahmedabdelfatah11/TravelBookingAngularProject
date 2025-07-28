import { Component } from '@angular/core';
import { NavBar } from "../../shared/nav-bar/nav-bar";
import { Footer } from "../../shared/footer/footer";
import { ProfileBody } from "./profile-body/profile-body";

@Component({
  selector: 'app-profile',
  imports: [NavBar, Footer, ProfileBody],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  ngOnInit() {
    document.body.classList.add('home-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-body');
  }
}
