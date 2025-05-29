import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CounsellorService } from '../../services/counsellor.service';
import { Session } from '../../../shared/models/session.model';
import { Counsellor } from '../../../shared/models/counsellor.model';

interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  cancelledSessions: number;
  totalEarnings: number;
  averageRating: number;
}

@Component({
  selector: 'app-counsellor-dashboard',
  templateUrl: './counsellor-dashboard.component.html',
  styleUrls: ['./counsellor-dashboard.component.scss']
})
export class CounsellorDashboardComponent implements OnInit {
  counsellor!: Counsellor;
  stats!: DashboardStats;
  upcomingSessions: Session[] = [];
  loading = {
    profile: false,
    stats: false,
    sessions: false
  };
  error = {
    profile: '',
    stats: '',
    sessions: ''
  };

  constructor(
    private counsellorService: CounsellorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCounsellorProfile();
    this.loadDashboardStats();
    this.loadUpcomingSessions();
  }

  loadCounsellorProfile(): void {
    this.loading.profile = true;
    this.counsellorService.getCounsellorProfile().subscribe({
      next: (counsellor) => {
        this.counsellor = counsellor;
        this.loading.profile = false;
      },
      error: (err) => {
        this.error.profile = 'Failed to load profile';
        this.loading.profile = false;
      }
    });
  }

  loadDashboardStats(): void {
    this.loading.stats = true;
    this.counsellorService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading.stats = false;
      },
      error: (err) => {
        this.error.stats = 'Failed to load statistics';
        this.loading.stats = false;
      }
    });
  }

  loadUpcomingSessions(): void {
    this.loading.sessions = true;
    this.counsellorService.getUpcomingSessions().subscribe({
      next: (sessions) => {
        this.upcomingSessions = sessions;
        this.loading.sessions = false;
      },
      error: (err) => {
        this.error.sessions = 'Failed to load upcoming sessions';
        this.loading.sessions = false;
      }
    });
  }

  navigateToSession(sessionId: string | undefined): void {
    if (sessionId) {
      this.router.navigate(['/counsellor/sessions', sessionId]);
    }
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
  
  // Helper method to safely get session ID
  getSessionId(session: Session): string {
    return session.id || session._id;
  }

  navigateToAvailability(): void {
    this.router.navigate(['/counsellor/availability']);
  }

  navigateToSessions(): void {
    this.router.navigate(['/counsellor/sessions']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/counsellor/profile']);
  }
}
