import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../shared/models/user.model';
import { Session } from '../../../shared/models/session.model';
import { Topic } from '../../../shared/models/topic.model';
import { Counsellor } from '../../../shared/models/counsellor.model';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  user: User | null = null;
  upcomingSessions: Session[] = [];
  pastSessions: Session[] = [];
  recommendedTopics: Topic[] = [];
  loading = true;
  error = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserSessions();
    this.loadRecommendedTopics();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        this.error = 'Failed to load user profile';
        console.error(err);
      }
    });
  }

  loadUserSessions(): void {
    this.userService.getUserSessions().subscribe({
      next: (sessions) => {
        const now = new Date();
        this.upcomingSessions = sessions
          .filter(session => new Date(session.date) >= now && session.status !== 'cancelled')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3); // Get only the next 3 upcoming sessions

        this.pastSessions = sessions
          .filter(session => new Date(session.date) < now || session.status === 'completed')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3); // Get only the last 3 past sessions

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sessions';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadRecommendedTopics(): void {
    this.userService.getTopics().subscribe({
      next: (topics) => {
        // In a real application, this would be based on user preferences or AI recommendations
        // For now, just show some random active topics
        this.recommendedTopics = topics
          .filter(topic => topic.isActive)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4); // Get 4 random topics
      },
      error: (err) => {
        console.error('Failed to load recommended topics', err);
      }
    });
  }

  viewAllSessions(): void {
    this.router.navigate(['/user/sessions']);
  }

  browseCounsellors(): void {
    this.router.navigate(['/user/counsellors']);
  }

  viewSessionDetails(sessionId: string): void {
    // This would navigate to a session detail page
    // For now, just navigate to the sessions list
    this.router.navigate(['/user/sessions']);
  }

  cancelSession(sessionId: string): void {
    if (confirm('Are you sure you want to cancel this session?')) {
      this.userService.cancelSession(sessionId).subscribe({
        next: () => {
          // Reload sessions after cancellation
          this.loadUserSessions();
        },
        error: (err) => {
          this.error = 'Failed to cancel session';
          console.error(err);
        }
      });
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
}
