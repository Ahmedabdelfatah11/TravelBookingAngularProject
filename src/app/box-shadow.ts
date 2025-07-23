import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appBoxShadow]'
})
export class BoxShadow {

  constructor() { }
  private el = inject(ElementRef);

  @HostListener('mouseenter') onMouseEnter() {
    this.setBoxShadow();
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.removeBoxShadow();
  }

  setBoxShadow(){
    const element = this.el.nativeElement;
    if (element) {
      element.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)';
    }
  }
  removeBoxShadow() {
    const element = this.el.nativeElement;
    if (element) {
      element.style.boxShadow = '';
    }
  }

}
