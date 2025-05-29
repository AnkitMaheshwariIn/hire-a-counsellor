import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: boolean;
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Load user from local storage on service initialization
    this.loadUserFromStorage();
  }
  
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from local storage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }
  
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  login(email: string, password: string): Observable<User> {
    return this.apiService.post<AuthResponse>('/users/login', { email, password })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Store user details and token in local storage
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            this.currentUserSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        })
      );
  }
  
  register(userData: any): Observable<User> {
    return this.apiService.post<AuthResponse>('/users/register', userData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Store user details and token in local storage
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            this.currentUserSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        })
      );
  }
  
  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }
  
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
  
  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return !!user && roles.includes(user.role);
  }
  
  getToken(): string | null {
    const user = this.currentUserValue;
    return user ? user.token || null : null;
  }
}
