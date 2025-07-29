
import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeService, StripeCardComponent, NgxStripeModule } from 'ngx-stripe';
import { PaymentService } from '../../core/services/payment';
// ... باقي imports

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxStripeModule, NgIf, StripeCardComponent, RouterModule,],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment {
  private route = inject(ActivatedRoute);
  private stripeService = inject(StripeService);
  private paymentService = inject(PaymentService);

  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '400',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  clientSecret = '';
  paymentSuccess = false; 
 constructor(private router: Router) {}
  ngOnInit(): void {
    const bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    if (bookingId) {
      this.paymentService.createPaymentIntent(bookingId).subscribe({
        next: (res) => {
          console.log('clientSecret =>', res.clientSecret);
          this.clientSecret = res.clientSecret;
        },
        error: (err) => {
          console.error('Error creating payment intent', err);
        }
      });
    }
  }

  pay(): void {
    this.stripeService.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card.element, // ← ✅ ده مربوط بالـ StripeCardComponent من الـ template
      }
    }).subscribe(result => {
      if (result.paymentIntent?.status === 'succeeded') {
        this.paymentSuccess = true;
        console.log('Payment succeeded:', result);
        alert('✅ Payment succeeded');
        this.router.navigate(['/home']);

        
      } else {
        alert('❌ Payment failed: ' + result.error?.message);
      }
    });
  }
}
