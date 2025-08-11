import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone,
  signal
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Car } from '../../Models/car';
import { CarService } from '../../Service/carService';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-details.html',
  styleUrl: './car-details.css'
})
export class CarDetails implements OnInit {
  car: Car | null = null;
  isLoading = false;
  errorMessage = '';
  carId: string | null = null;
  carSignal = signal<any>([]);
  
  startDate: string = '';
  endDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.ngZone.run(() => {
      this.carId = this.route.snapshot.paramMap.get('id');
      if (this.carId) {
        this.loadCarDetails(+this.carId);
      } else {
        this.router.navigate(['/cars']);
      }
    });
  }

  loadCarDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.carService.getCarById(id).subscribe({
      next: (car) => {
        this.ngZone.run(() => {
          this.car = car;
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('Error loading car details:', error);
        this.ngZone.run(() => {
          this.errorMessage = 'failed';
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cars']);
  }

  BookCar(): void {
     this.carService.bookcar(Number(this.carId), this.startDate, this.endDate).subscribe({
    next: (response) => {
     console.log('Booking Response:', response); // ⬅️ هنا نعرف بيرجع إيه
      this.carSignal.set(response);
      this.router.navigate([`/Booking/${response.id}`], {
        state: { booking: response }
      });
    },
    error: (error) => {
      console.error('Error booking car:', error);
    }
  });
  }
}
