import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.navigateBasedOnRole();
    }
  }

  signInWithGoogle(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Simulate Google Sign-In success (since we don't have actual Google Auth integration)
    setTimeout(() => {
      try {
        // Mock user data that would come from Google
        const mockGoogleUser = {
          _id: 'google-user-123',
          name: 'Google User',
          email: 'googleuser@example.com',
          phone: '',
          role: 'user',
          status: true,
          token: 'mock-token-123'
        };
        
        // Store the user in local storage
        localStorage.setItem('currentUser', JSON.stringify(mockGoogleUser));
        
        // Update the current user in the auth service
        this.authService.login(mockGoogleUser.email, 'google-auth').subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Successfully signed in with Google!', 'Close', {
              duration: 3000
            });
            
            // Navigate based on user role
            this.navigateBasedOnRole();
          },
          error: (error: any) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Failed to sign in with Google';
            this.snackBar.open(this.errorMessage, 'Close', {
              duration: 5000
            });
          }
        });
      } catch (err) {
        this.isLoading = false;
        this.errorMessage = 'An unexpected error occurred';
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 5000
        });
      }
    }, 1500); // Simulate network delay
  }
  
  navigateBasedOnRole(): void {
    const user = this.authService.currentUserValue;
    if (!user) return;
    
    switch (user.role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'counsellor':
        this.router.navigate(['/counsellor/dashboard']);
        break;
      case 'user':
      default:
        this.router.navigate(['/user/dashboard']);
        break;
    }
  }
}
