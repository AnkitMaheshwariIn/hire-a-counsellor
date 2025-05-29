import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  selectedRole = 'user';

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

  signUpWithGoogle(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Simulate Google Sign-Up success (since we don't have actual Google Auth integration)
    setTimeout(() => {
      try {
        // Mock user data that would come from Google
        const mockGoogleUser = {
          _id: 'google-user-' + Math.floor(Math.random() * 1000),
          name: 'Google User',
          email: 'googleuser' + Math.floor(Math.random() * 1000) + '@example.com',
          phone: '',
          role: this.selectedRole,
          status: true,
          token: 'mock-token-' + Math.floor(Math.random() * 1000)
        };
        
        // Store the user in local storage
        localStorage.setItem('currentUser', JSON.stringify(mockGoogleUser));
        
        // Register the user
        this.authService.register({
          name: mockGoogleUser.name,
          email: mockGoogleUser.email,
          phone: '0000000000', // Default phone number
          password: 'google-auth',
          role: this.selectedRole
        }).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Account created successfully!', 'Close', {
              duration: 3000
            });
            
            // Navigate based on user role
            this.navigateBasedOnRole();
          },
          error: (error: any) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Failed to create account';
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
