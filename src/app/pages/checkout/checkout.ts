import { Component, OnInit, ViewChild } from '@angular/core';
import {
  StripeService,
  StripeCardComponent,
} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { PaymentService } from '../../core/services/payment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  standalone: true,
  imports: [StripeCardComponent],
})
export class CheckoutComponent implements OnInit {
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
  bookingId = 8;
  isLoading = false;
  paymentSuccess = false;

  constructor(
    private paymentService: PaymentService,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.paymentService.createPaymentIntent(this.bookingId).subscribe({
      next: (response) => {
        this.paymentIntentClientSecret = response.clientSecret;
      },
      error: (err) => {
        console.error('Failed to create PaymentIntent:', err);
      },
    });
  }

  pay(): void {
    this.isLoading = true;

    this.stripeService
      .confirmCardPayment(this.paymentIntentClientSecret, {
        payment_method: {
          card: this.card.element,
        },
      })
      .subscribe((result) => {
        this.isLoading = false;

        if (result.paymentIntent?.status === 'succeeded') {
          this.paymentSuccess = true;
          alert('✅ Payment succeeded!');
        } else {
          console.error(result.error?.message);
          alert('❌ Payment failed!');
        }
      });
  }
}
