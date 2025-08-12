import { Component } from '@angular/core';  
import { RouterLink } from '@angular/router';
import { NavBar } from '../../shared/nav-bar/nav-bar';

@Component({
  selector: 'app-aboutus',
  imports: [RouterLink, NavBar],
  templateUrl: './aboutus.html',
  styleUrls: ['./aboutus.css']
})
export class Aboutus {
ngOnInit() {
    document.body.classList.add('home-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-body');
  }
}
