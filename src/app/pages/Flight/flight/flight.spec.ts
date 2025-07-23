import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flight } from './flight';

describe('Flight', () => {
  let component: Flight;
  let fixture: ComponentFixture<Flight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Flight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
