import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NavBar } from "../nav-bar/nav-bar";
import Typed from 'typed.js';

@Component({
  selector: 'app-header',
  imports: [NavBar],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements AfterViewInit {
  @Input() title?: string;
  @Input() Image?: string;
  @Input() typedStrings: string[] = [];

  @ViewChild('typedElement', { static: false }) typedElement!: ElementRef;
  private typedInstance?: Typed;

  ngAfterViewInit(): void {
    setTimeout(() => { // نخليها تتأخر شوية عشان نتأكد إن العنصر موجود
      if (this.typedStrings.length > 0 && this.typedElement) {
        if (this.typedInstance) {
          this.typedInstance.destroy();
        }
        this.typedInstance = new Typed(this.typedElement.nativeElement, {
          strings: this.typedStrings,
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 2000,
          loop: true
        });
      }
    }, 0);
  }
}
