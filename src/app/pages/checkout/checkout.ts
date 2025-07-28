import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { PaymentService } from '../../core/services/payment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  standalone: true,
  imports: [CommonModule, StripeCardComponent],
})
export class Checkout implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '400',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'auto',
  };

  paymentIntentClientSecret = '';
  bookingId = 1; // Replace with actual booking ID
  isLoading = false;
  paymentSuccess = false;
  errorMessage = '';

  constructor(
    private paymentService: PaymentService,
    private stripeService: StripeService
  ) {}


  ngOnInit(): void {
    this.paymentService.createPaymentIntent(this.bookingId).subscribe({
      next: (res) => {
        this.paymentIntentClientSecret = res.clientSecret;
      },
      error: (err) => {
        this.errorMessage = '❌ فشل إنشاء الدفع.';
        console.error(err);
      },
    });
  }

  pay(): void {
    if (!this.paymentIntentClientSecret || !this.card) return;

    this.isLoading = true;
    this.stripeService
      .confirmCardPayment(this.paymentIntentClientSecret, {
        payment_method: {
          card: this.card.element,
        },
      })
      .subscribe((result) => {
        this.isLoading = false;
        if (result.error) {
          this.errorMessage = result.error.message || 'حدث خطأ أثناء الدفع.';
          console.error('Stripe Error:', result.error.message);
        } else if (result.paymentIntent?.status === 'succeeded') {
          this.paymentSuccess = true;
          this.errorMessage = '';
        }
      });
  }
}
