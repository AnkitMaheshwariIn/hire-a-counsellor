import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Counsellor } from '../../../shared/models/counsellor.model';
import { Session } from '../../../shared/models/session.model';

@Component({
  selector: 'app-counsellor-details',
  templateUrl: './counsellor-details.component.html',
  styleUrls: ['./counsellor-details.component.scss']
})
export class CounsellorDetailsComponent implements OnInit {
  counsellorId: string = '';
  counsellor: Counsellor | null = null;
  availability: any[] = [];
  selectedDate: Date | null = null;
  availableSlots: any[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.counsellorId = id;
        this.loadCounsellorDetails();
        this.loadCounsellorAvailability();
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
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load counsellor details';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadCounsellorAvailability(): void {
    this.userService.getCounsellorAvailability(this.counsellorId).subscribe({
      next: (availability) => {
        this.availability = availability;
        
        // If there's availability, select the first date by default
        if (this.availability.length > 0) {
          this.selectDate(new Date(this.availability[0].date));
        }
      },
      error: (err) => {
        console.error('Failed to load counsellor availability', err);
      }
    });
  }

  selectDate(date: Date | null): void {
    this.selectedDate = date;
    
    if (!date) {
      this.availableSlots = [];
      return;
    }
    
    // Find the availability entry for the selected date
    const availabilityEntry = this.availability.find(a => {
      const availDate = new Date(a.date);
      return availDate.getDate() === date.getDate() && 
             availDate.getMonth() === date.getMonth() && 
             availDate.getFullYear() === date.getFullYear();
    });
    
    // Get available slots for the selected date
    this.availableSlots = availabilityEntry ? 
      availabilityEntry.slots.filter((slot: any) => !slot.isBooked) : [];
  }

  bookSession(slot: any): void {
    if (!this.selectedDate || !this.counsellor) return;
    
    // Navigate to booking page with necessary parameters
    this.router.navigate(['/user/book', this.counsellorId], {
      queryParams: {
        date: this.selectedDate.toISOString(),
        startTime: slot.startTime,
        endTime: slot.endTime
      }
    });
  }

  getAvailableDates(): Date[] {
    return this.availability.map(a => new Date(a.date));
  }

  isDateAvailable(date: Date): boolean {
    return this.getAvailableDates().some(availDate => 
      availDate.getDate() === date.getDate() && 
      availDate.getMonth() === date.getMonth() && 
      availDate.getFullYear() === date.getFullYear()
    );
  }

  formatTime(time: string): string {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }

  goBack(): void {
    this.router.navigate(['/user/counsellors']);
  }
}
