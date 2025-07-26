import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendConfirmEmail } from './resend-confirm-email';

describe('ResendConfirmEmail', () => {
  let component: ResendConfirmEmail;
  let fixture: ComponentFixture<ResendConfirmEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResendConfirmEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendConfirmEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
