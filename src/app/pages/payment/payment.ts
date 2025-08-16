import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeService, StripeCardComponent, NgxStripeModule } from 'ngx-stripe';
import { PaymentService } from '../../core/services/payment';
import { ToastrService } from 'ngx-toastr';
import { NavBar } from "../../shared/nav-bar/nav-bar";
import { Footer } from "../../shared/footer/footer";
import { Booking } from '../../Models/booking';
import { BookingService } from '../../Service/booking-service';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxStripeModule, StripeCardComponent, RouterModule, NavBar, Footer],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment {
  private route = inject(ActivatedRoute);
  private stripeService = inject(StripeService);
  private paymentService = inject(PaymentService);
  private BookingService = inject(BookingService)
  bookingDetails = signal<Booking | null>(null);
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

  constructor(private router: Router, private Toastr: ToastrService) { }

   ngOnInit(): void {
    document.body.classList.add('home-body');
    const bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    if (bookingId) {
      this.paymentService.createPaymentIntent(bookingId).subscribe({
        next: (res) => {
          console.log('clientSecret =>', res.clientSecret);
          this.clientSecret = res.clientSecret;
           this.GetBookDetails(bookingId);

        },
        error: (err) => {
          console.error('Error creating payment intent', err);
        }
      });
     
    }
  }

  ngOnDestroy() {
    document.body.classList.remove('home-body');
  }
  GetBookDetails(id: number): void {
    this.BookingService.GetBookById(id).subscribe({
      next: (res) => {
        console.log('Booking details =>', res);
        this.bookingDetails.update(prev => ({
          ...prev,
          ...res
        }));
        // this.bookingDetails = res;
      },
      error: (err) => {
        console.error('Error Loading Booking Details', err);
      }
    });
  }
  get nights(): number {
    const b = this.bookingDetails();
    if (!b) return 0;
    const start = new Date(b.startDate).getTime();
    const end = new Date(b.endDate).getTime();
    return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24))); //
  }
  get flightDuration(): string {
    const b = this.bookingDetails();
    if (!b) return '';

    const start = new Date(b.startDate).getTime();
    const end = new Date(b.endDate).getTime();

    if (isNaN(start) || isNaN(end) || end <= start) return '';

    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  pay(): void {
    if (!this.clientSecret) {
      this.Toastr.error('⚠️ Payment not ready yet. Please wait a moment.');

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
        this.Toastr.success('✅ Payment succeeded');
        this.router.navigate(['/home']);
      } else {
        this.paymentProcessing = false;
        this.Toastr.error('❌ Payment failed: ' + result.error?.message);
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
        this.Toastr.success('✅ Payment succeeded and booking confirmed!');

        // الانتقال للصفحة التالية
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (error) => {
        this.paymentProcessing = false;
        console.error('Error confirming payment with backend:', error);
        this.Toastr.error('⚠️ Payment succeeded but there was an issue confirming your booking. Please contact support.');
      }
    });
  }
}