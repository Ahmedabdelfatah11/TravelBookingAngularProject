import { Component } from '@angular/core';
import { NavBar } from "../../shared/nav-bar/nav-bar";

@Component({
  selector: 'app-contactus',
  imports: [NavBar],
  templateUrl: './contactus.html',
  styleUrl: './contactus.css'
})
export class Contactus { 
ngOnInit() {
    document.body.classList.add('home-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-body');
  }
}
