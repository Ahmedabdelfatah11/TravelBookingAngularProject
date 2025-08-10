import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeService, StripeCardComponent, NgxStripeModule } from 'ngx-stripe';
import { PaymentService } from '../../core/services/payment';

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
  paymentProcessing = false; // ✅ loading state

  constructor(private router: Router) { }

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
    if (!this.clientSecret) {
      alert("⚠️ Payment not ready yet. Please wait a moment.");
      return;
    }

    this.paymentProcessing = true; // ✅ بدء الـ processing

    this.stripeService.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card.element,
      }
    }).subscribe(result => {
      if (result.paymentIntent?.status === 'succeeded') {
        console.log('Payment succeeded:', result);
        
        // ✅ تأكيد الدفع مع الـ backend
        this.confirmPaymentWithBackend(result.paymentIntent.id);
      } else {
        this.paymentProcessing = false;
        alert('❌ Payment failed: ' + result.error?.message);
      }
    });
  }

  // ✅ الـ method الجديدة للتأكيد
  confirmPaymentWithBackend(paymentIntentId: string): void {
    this.paymentService.confirmPayment(paymentIntentId).subscribe({
      next: (response) => {
        this.paymentSuccess = true;
        this.paymentProcessing = false;
        console.log('Payment confirmed with backend:', response);
        alert('✅ Payment succeeded and booking confirmed!');
        
        // الانتقال للصفحة التالية
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (error) => {
        this.paymentProcessing = false;
        console.error('Error confirming payment with backend:', error);
        alert('⚠️ Payment succeeded but there was an issue confirming your booking. Please contact support.');
      }
    });
  }
}