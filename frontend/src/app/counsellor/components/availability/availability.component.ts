import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CounsellorService } from '../../services/counsellor.service';
import { TimeSlot } from '../../../shared/models/time-slot.model';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {
  availabilityForm!: FormGroup;
  timeSlots: TimeSlot[] = [];
  loading = false;
  error = '';
  successMessage = '';
  editingSlot: TimeSlot | null = null;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  timeOptions = this.generateTimeOptions();
  
  constructor(
    private fb: FormBuilder,
    private counsellorService: CounsellorService,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadAvailability();
  }

  initForm(): void {
    this.availabilityForm = this.fb.group({
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      isRecurring: [true],
      date: [null]
    });

    // Add conditional validation for date field
    this.availabilityForm.get('isRecurring')?.valueChanges.subscribe(isRecurring => {
      const dateControl = this.availabilityForm.get('date');
      if (!isRecurring) {
        dateControl?.setValidators(Validators.required);
      } else {
        dateControl?.clearValidators();
        dateControl?.setValue(null);
      }
      dateControl?.updateValueAndValidity();
    });
  }

  loadAvailability(): void {
    this.loading = true;
    this.counsellorService.getAvailability().subscribe({
      next: (timeSlots) => {
        this.timeSlots = timeSlots;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load availability';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.availabilityForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.availabilityForm.value;
    
    // Prepare the time slot data
    const timeSlotData: TimeSlot = {
      counsellorId: '', // Will be set by the backend
      day: formValue.day,
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      isRecurring: formValue.isRecurring
    };

    if (!formValue.isRecurring && formValue.date) {
      timeSlotData.date = formValue.date;
    }

    if (this.editingSlot && this.editingSlot.id) {
      // Update existing time slot
      this.counsellorService.updateAvailability(this.editingSlot.id, timeSlotData).subscribe({
        next: (updatedSlot) => {
          this.successMessage = 'Availability updated successfully';
          this.resetForm();
          this.loadAvailability();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to update availability';
          this.loading = false;
        }
      });
    } else {
      // Add new time slot
      this.counsellorService.addAvailability(timeSlotData).subscribe({
        next: (newSlot) => {
          this.successMessage = 'Availability added successfully';
          this.resetForm();
          this.loadAvailability();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to add availability';
          this.loading = false;
        }
      });
    }
  }

  editTimeSlot(slot: TimeSlot): void {
    this.editingSlot = slot;
    this.availabilityForm.patchValue({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isRecurring: slot.isRecurring,
      date: slot.date || null
    });
  }

  deleteTimeSlot(slotId: string | undefined): void {
    if (!slotId) {
      this.error = 'Invalid time slot ID';
      setTimeout(() => this.error = '', 3000);
      return;
    }
    
    if (confirm('Are you sure you want to delete this time slot?')) {
      this.counsellorService.deleteAvailability(slotId).subscribe({
        next: () => {
          this.successMessage = 'Time slot deleted successfully';
          this.loadAvailability(); // Reload the list
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete time slot';
          console.error(err);
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }
  
  // Helper method to safely get time slot ID
  getTimeSlotId(slot: TimeSlot): string {
    return slot.id || '';
  }

  resetForm(): void {
    this.availabilityForm.reset({
      isRecurring: true
    });
    this.editingSlot = null;
  }

  clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }

  generateTimeOptions(): string[] {
    const options = [];
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        options.push(`${h}:${m}`);
      }
    }
    return options;
  }
  
  // Helper method to filter recurring time slots
  getRecurringTimeSlots(): TimeSlot[] {
    return this.timeSlots.filter(slot => slot.isRecurring);
  }
  
  // Helper method to filter one-time time slots
  getOneTimeTimeSlots(): TimeSlot[] {
    return this.timeSlots.filter(slot => !slot.isRecurring);
  }
  
  // Helper method to check if there are recurring time slots
  hasRecurringTimeSlots(): boolean {
    return this.timeSlots.some(slot => slot.isRecurring === true);
  }
  
  // Helper method to check if there are one-time time slots
  hasOneTimeTimeSlots(): boolean {
    return this.timeSlots.some(slot => slot.isRecurring === false);
  }

  getTimeSlotLabel(slot: TimeSlot): string {
    if (slot.isRecurring) {
      return `${slot.day}, ${slot.startTime} - ${slot.endTime}`;
    } else {
      const dateStr = slot.date ? new Date(slot.date).toLocaleDateString() : '';
      return `${dateStr}, ${slot.startTime} - ${slot.endTime}`;
    }
  }

  isEndTimeValid(): boolean {
    const startTime = this.availabilityForm.get('startTime')?.value;
    const endTime = this.availabilityForm.get('endTime')?.value;
    
    if (!startTime || !endTime) return true;
    
    return startTime < endTime;
  }
}
