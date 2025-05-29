import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth(state.url);
  }
  
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url = `/${segments.map(s => s.path).join('/')}`;
    return this.checkAuth(url);
  }
  
  private checkAuth(url: string): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // Store the attempted URL for redirecting after login
    localStorage.setItem('redirectUrl', url);
    
    // Navigate to the login page
    this.router.navigate(['/auth/login']);
    return false;
  }
}
