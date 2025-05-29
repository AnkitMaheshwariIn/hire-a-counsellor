import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { Counsellor } from '../../../shared/models/counsellor.model';

@Component({
  selector: 'app-book-session',
  templateUrl: './book-session.component.html',
  styleUrls: ['./book-session.component.scss']
})
export class BookSessionComponent implements OnInit {
  counsellorId: string = '';
  counsellor: Counsellor | null = null;
  sessionDate: Date | null = null;
  startTime: string = '';
  endTime: string = '';
  bookingForm: FormGroup;
  loading = true;
  submitting = false;
  error = '';
  packageOptions = [
    { value: 'single', viewValue: 'Single Session' },
    { value: 'five', viewValue: '5 Sessions Package (10% off)' },
    { value: 'ten', viewValue: '10 Sessions Package (20% off)' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      package: ['single', Validators.required],
      notes: [''],
      agreeToTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.counsellorId = id;
        this.loadCounsellorDetails();
        
        // Get query parameters for session details
        this.route.queryParamMap.subscribe(queryParams => {
          const dateStr = queryParams.get('date');
          this.startTime = queryParams.get('startTime') || '';
          this.endTime = queryParams.get('endTime') || '';
          
          if (dateStr) {
            this.sessionDate = new Date(dateStr);
          }
          
          if (!this.sessionDate || !this.startTime || !this.endTime) {
            this.error = 'Missing session details';
          }
          
          this.loading = false;
        });
      } else {
        this.error = 'Counsellor ID not found';
        this.loading = false;
      }
    });
  }

  loadCounsellorDetails(): void {
    this.userService.getCounsellorById(this.counsellorId).subscribe({
      next: (counsellor) => {
        this.counsellor = counsellor;
      },
      error: (err) => {
        this.error = 'Failed to load counsellor details';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.sessionDate || !this.counsellor) {
      return;
    }
    
    this.submitting = true;
    
    const formValues = this.bookingForm.value;
    let paymentAmount = this.calculatePaymentAmount(formValues.package);
    
    const sessionData = {
      counsellor: this.counsellorId,
      date: this.sessionDate,
      startTime: this.startTime,
      endTime: this.endTime,
      notes: formValues.notes,
      packageType: formValues.package,
      paymentAmount,
      paymentStatus: 'pending' as 'pending' | 'paid' | 'refunded'
    };
    
    this.userService.bookSession(sessionData).subscribe({
      next: (session) => {
        this.submitting = false;
        this.snackBar.open('Session booked successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/user/sessions']);
      },
      error: (err) => {
        this.submitting = false;
        this.error = err.error?.message || 'Failed to book session';
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error(err);
      }
    });
  }

  calculatePaymentAmount(packageType: string): number {
    if (!this.counsellor) return 0;
    
    const baseRate = this.counsellor.hourlyRate || 1000;
    
    switch (packageType) {
      case 'single':
        return this.counsellor.packageRates?.oneSession || baseRate;
      case 'five':
        return this.counsellor.packageRates?.fiveSession || (baseRate * 4.5);
      case 'ten':
        return this.counsellor.packageRates?.tenSession || (baseRate * 8);
      default:
        return baseRate;
    }
  }

  getSessionTotal(): number {
    return this.calculatePaymentAmount(this.bookingForm.value.package);
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }
  
  // Helper method to safely get package view value
  getPackageViewValue(packageValue: string): string {
    const option = this.packageOptions.find(o => o.value === packageValue);
    return option ? option.viewValue : 'Single Session';
  }

  goBack(): void {
    this.router.navigate(['/user/counsellors', this.counsellorId]);
  }

  cancel(): void {
    this.goBack();
  }
}
