
import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeService, StripeCardComponent, NgxStripeModule } from 'ngx-stripe';
import { PaymentService } from '../../core/services/payment';
import { ToastrService } from 'ngx-toastr';
// ... باقي imports

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxStripeModule, StripeCardComponent, RouterModule,],
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
  constructor(private router: Router ,private Toastr : ToastrService) { }
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
      this.Toastr.error('⚠️ Payment not ready yet. Please wait a moment.');
      
      return;
    }
    this.stripeService.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card.element, 
      }
    }).subscribe(result => {
      if (result.paymentIntent?.status === 'succeeded') {
        this.paymentSuccess = true;
        console.log('Payment succeeded:', result);
        this.Toastr.success('✅ Payment succeeded');
        this.router.navigate(['/home']);


      } else {
        console.error('Payment failed:', result.error);
        this.Toastr.error('❌ Payment failed: ' + result.error?.message);
      }
    });
  }
}
