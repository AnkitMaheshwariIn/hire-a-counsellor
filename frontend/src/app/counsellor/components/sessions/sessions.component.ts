import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CounsellorService } from '../../services/counsellor.service';
import { Session } from '../../../shared/models/session.model';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {
  sessions: Session[] = [];
  filteredSessions: Session[] = [];
  loading = false;
  error = '';
  statusFilter = new FormControl('all');
  searchQuery = new FormControl('');
  sortOrder = new FormControl('newest');
  
  constructor(
    private counsellorService: CounsellorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSessions();
    
    // Subscribe to filter changes
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    this.searchQuery.valueChanges.subscribe(() => this.applyFilters());
    this.sortOrder.valueChanges.subscribe(() => this.applyFilters());
  }

  loadSessions(): void {
    this.loading = true;
    this.counsellorService.getSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sessions';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.sessions];
    
    // Apply status filter
    const status = this.statusFilter.value;
    if (status && status !== 'all') {
      filtered = filtered.filter(session => session.status === status);
    }
    
    // Apply search filter
    const query = this.searchQuery.value?.toLowerCase();
    if (query) {
      filtered = filtered.filter(session => {
        // Check if user is an object with name property
        const userName = typeof session.user === 'object' && session.user?.name ? 
          session.user.name.toLowerCase() : '';
        
        // Check if topic exists and is a string
        const topicText = session.topic ? session.topic.toLowerCase() : '';
        
        return userName.includes(query) || topicText.includes(query);
      });
    }
    
    // Apply sorting
    const sort = this.sortOrder.value;
    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    this.filteredSessions = filtered;
  }

  viewSessionDetails(sessionId: string | undefined): void {
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  refreshSessions(): void {
    this.loadSessions();
  }
}
