import { Component, Input } from '@angular/core';
import { NavBar } from "../../../shared/nav-bar/nav-bar";

@Component({
  selector: 'app-header',
  imports: [NavBar],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
@Input() title: string | undefined ;
@Input() Image: string | undefined ;
}
