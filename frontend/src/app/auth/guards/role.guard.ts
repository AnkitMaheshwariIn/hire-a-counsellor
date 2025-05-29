import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanLoad {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkRole(route);
  }
  
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkRole(route);
  }
  
  private checkRole(route: ActivatedRouteSnapshot | Route): boolean {
    // Get allowed roles from route data
    const roles = route.data?.['roles'] as string[];
    
    if (!roles || roles.length === 0) {
      return true; // No specific roles required
    }
    
    // Check if user has the required role
    const hasRole = this.authService.hasRole(roles);
    
    if (!hasRole) {
      // Redirect to home page if user doesn't have the required role
      this.router.navigate(['/']);
    }
    
    return hasRole;
  }
}
