import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { Session } from '../../../shared/models/session.model';
import { Counsellor } from '../../../shared/models/counsellor.model';

@Component({
  selector: 'app-my-sessions',
  templateUrl: './my-sessions.component.html',
  styleUrls: ['./my-sessions.component.scss']
})
export class MySessionsComponent implements OnInit {
  sessions: Session[] = [];
  upcomingSessions: Session[] = [];
  pastSessions: Session[] = [];
  loading = true;
  error = '';
  activeTab = 0; // 0 = upcoming, 1 = past

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.userService.getUserSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.filterSessions();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sessions';
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterSessions(): void {
    const now = new Date();
    
    // Upcoming sessions: date is in the future or status is pending/confirmed
    this.upcomingSessions = this.sessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        return (sessionDate >= now && session.status !== 'cancelled') || 
               (session.status === 'pending' || session.status === 'confirmed');
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Past sessions: date is in the past or status is completed/cancelled
    this.pastSessions = this.sessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        return (sessionDate < now || session.status === 'completed' || session.status === 'cancelled');
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  cancelSession(sessionId: string): void {
    if (confirm('Are you sure you want to cancel this session? This action cannot be undone.')) {
      this.userService.cancelSession(sessionId).subscribe({
        next: () => {
          this.snackBar.open('Session cancelled successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadSessions();
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Failed to cancel session', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error(err);
        }
      });
    }
  }

  viewCounsellorProfile(counsellorId: string): void {
    this.router.navigate(['/user/counsellors', counsellorId]);
  }

  bookNewSession(): void {
    this.router.navigate(['/user/counsellors']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  // Helper method to check if a value is an object
  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }

  // Helper method to get counsellor name safely
  getCounsellorName(counsellor: any): string {
    if (this.isObject(counsellor) && counsellor.name) {
      return counsellor.name;
    }
    return 'Counsellor';
  }

  // Helper method to get counsellor specialization safely
  getCounsellorSpecialization(counsellor: any): string {
    if (this.isObject(counsellor) && counsellor.specialization) {
      return counsellor.specialization;
    }
    return 'General Counselling';
  }

  // Helper method to get counsellor ID safely
  getCounsellorId(counsellor: any): string {
    if (this.isObject(counsellor) && counsellor._id) {
      return counsellor._id;
    }
    return counsellor as string;
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    // Simple time formatting, could be enhanced with a proper time library
    return time;
  }
}
