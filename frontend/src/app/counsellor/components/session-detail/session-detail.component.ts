import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CounsellorService } from '../../services/counsellor.service';
import { Session } from '../../../shared/models/session.model';

@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss']
})
export class SessionDetailComponent implements OnInit {
  sessionId: string = '';
  session!: Session;
  notesForm!: FormGroup;
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private counsellorService: CounsellorService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.sessionId = id;
    }
    this.initForm();
    this.loadSessionDetails();
  }

  initForm(): void {
    this.notesForm = this.fb.group({
      sessionNotes: ['', Validators.required]
    });
  }

  loadSessionDetails(): void {
    this.loading = true;
    this.counsellorService.getSessionById(this.sessionId).subscribe({
      next: (session) => {
        this.session = session;
        if (session.notes) {
          this.notesForm.patchValue({ sessionNotes: session.notes });
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load session details';
        this.loading = false;
      }
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
  
  // Helper method to check if a value is an object
  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }
  
  // Helper method to safely get user name
  getUserName(user: any): string {
    if (this.isObject(user) && user.name) {
      return user.name;
    }
    return 'Client';
  }
  
  // Helper method to safely get user email
  getUserEmail(user: any): string {
    if (this.isObject(user) && user.email) {
      return user.email;
    }
    return 'No email provided';
  }
  
  // Helper method to safely get user phone
  getUserPhone(user: any): string {
    if (this.isObject(user) && user.phone) {
      return user.phone;
    }
    return 'No phone provided';
  }
  
  // Helper method to check if user has phone
  hasUserPhone(user: any): boolean {
    return this.isObject(user) && !!user.phone;
  }

  updateSessionNotes(): void {
    if (this.notesForm.invalid) {
      return;
    }

    this.loading = true;
    const notes = this.notesForm.value.sessionNotes;
    
    this.counsellorService.updateSessionNotes(this.sessionId, notes).subscribe({
      next: () => {
        this.successMessage = 'Session notes updated successfully';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update session notes';
        this.loading = false;
      }
    });
  }

  completeSession(): void {
    this.loading = true;
    this.counsellorService.completeSession(this.sessionId).subscribe({
      next: () => {
        this.successMessage = 'Session marked as completed';
        this.session.status = 'completed';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to complete session';
        this.loading = false;
      }
    });
  }

  cancelSession(): void {
    if (confirm('Are you sure you want to cancel this session? This action cannot be undone.')) {
      this.loading = true;
      this.counsellorService.cancelSession(this.sessionId).subscribe({
        next: () => {
          this.successMessage = 'Session cancelled successfully';
          this.session.status = 'cancelled';
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to cancel session';
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/counsellor/sessions']);
  }
}
