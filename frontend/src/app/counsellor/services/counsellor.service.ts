import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Counsellor } from '../../shared/models/counsellor.model';
import { Session } from '../../shared/models/session.model';
import { TimeSlot } from '../../shared/models/time-slot.model';

@Injectable({
  providedIn: 'root'
})
export class CounsellorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Profile management
  getCounsellorProfile(): Observable<Counsellor> {
    return this.http.get<Counsellor>(`${this.apiUrl}/counsellors/profile`);
  }

  updateCounsellorProfile(profile: Partial<Counsellor>): Observable<Counsellor> {
    return this.http.put<Counsellor>(`${this.apiUrl}/counsellors/profile`, profile);
  }

  updateProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return this.http.post(`${this.apiUrl}/counsellors/profile/picture`, formData);
  }

  // Availability management
  getAvailability(): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/counsellors/availability`);
  }

  addAvailability(timeSlot: TimeSlot): Observable<TimeSlot> {
    return this.http.post<TimeSlot>(`${this.apiUrl}/counsellors/availability`, timeSlot);
  }

  updateAvailability(timeSlotId: string, timeSlot: TimeSlot): Observable<TimeSlot> {
    return this.http.put<TimeSlot>(`${this.apiUrl}/counsellors/availability/${timeSlotId}`, timeSlot);
  }

  deleteAvailability(timeSlotId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/counsellors/availability/${timeSlotId}`);
  }

  // Session management
  getSessions(status?: string): Observable<Session[]> {
    let url = `${this.apiUrl}/counsellors/sessions`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<Session[]>(url);
  }

  getSessionById(sessionId: string): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/counsellors/sessions/${sessionId}`);
  }

  updateSessionNotes(sessionId: string, notes: string): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/counsellors/sessions/${sessionId}/notes`, { notes });
  }

  completeSession(sessionId: string): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/counsellors/sessions/${sessionId}/complete`, {});
  }

  cancelSession(sessionId: string): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/counsellors/sessions/${sessionId}/cancel`, {});
  }

  // Dashboard statistics
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/counsellors/dashboard/stats`);
  }

  getUpcomingSessions(limit: number = 5): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/counsellors/dashboard/upcoming-sessions?limit=${limit}`);
  }
}
