import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../shared/models/user.model';
import { Counsellor } from '../../shared/models/counsellor.model';
import { Session } from '../../shared/models/session.model';
import { Topic } from '../../shared/models/topic.model';
import { Location } from '../../shared/models/location.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  /**
   * Get the current user's profile
   */
  getUserProfile(): Observable<User> {
    return this.apiService.get<User>('/users/profile');
  }

  /**
   * Update the current user's profile
   */
  updateUserProfile(userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>('/users/profile', userData);
  }

  /**
   * Get all counsellors
   */
  getCounsellors(): Observable<Counsellor[]> {
    return this.apiService.get<Counsellor[]>('/counsellors');
  }

  /**
   * Get filtered counsellors by topics and/or locations
   */
  getFilteredCounsellors(topicIds?: string[], locationIds?: string[]): Observable<Counsellor[]> {
    let queryParams = '';
    
    if (topicIds && topicIds.length > 0) {
      queryParams += `topics=${topicIds.join(',')}`;
    }
    
    if (locationIds && locationIds.length > 0) {
      queryParams += queryParams ? '&' : '';
      queryParams += `locations=${locationIds.join(',')}`;
    }
    
    return this.apiService.get<Counsellor[]>(`/counsellors/filter?${queryParams}`);
  }

  /**
   * Get a specific counsellor by ID
   */
  getCounsellorById(id: string): Observable<Counsellor> {
    return this.apiService.get<Counsellor>(`/counsellors/${id}`);
  }

  /**
   * Get counsellor availability
   */
  getCounsellorAvailability(counsellorId: string): Observable<any> {
    return this.apiService.get<any>(`/counsellors/${counsellorId}/availability`);
  }

  /**
   * Book a session with a counsellor
   */
  bookSession(sessionData: Partial<Session>): Observable<Session> {
    return this.apiService.post<Session>('/sessions', sessionData);
  }

  /**
   * Get all sessions for the current user
   */
  getUserSessions(): Observable<Session[]> {
    return this.apiService.get<Session[]>('/sessions/user');
  }

  /**
   * Cancel a session
   */
  cancelSession(sessionId: string): Observable<Session> {
    return this.apiService.put<Session>(`/sessions/${sessionId}/cancel`, {});
  }

  /**
   * Get all topics
   */
  getTopics(): Observable<Topic[]> {
    return this.apiService.get<Topic[]>('/topics');
  }

  /**
   * Get all locations
   */
  getLocations(): Observable<Location[]> {
    return this.apiService.get<Location[]>('/locations');
  }
}
