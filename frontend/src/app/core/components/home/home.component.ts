import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  // Sample counselling topics for the homepage
  topics = [
    { name: 'Education', icon: 'school', description: 'Academic guidance, career planning, and study strategies' },
    { name: 'Mental Health', icon: 'psychology', description: 'Anxiety, depression, stress management, and emotional well-being' },
    { name: 'Career', icon: 'work', description: 'Career development, job transitions, and professional growth' },
    { name: 'Relationships', icon: 'people', description: 'Family dynamics, interpersonal relationships, and social skills' },
    { name: 'Personal Growth', icon: 'self_improvement', description: 'Self-improvement, confidence building, and life skills' },
    { name: 'Wellness', icon: 'spa', description: 'Holistic well-being, mindfulness, and healthy lifestyle choices' }
  ];

  // Sample testimonials
  testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Student',
      image: 'assets/images/testimonial1.jpg',
      content: 'The counselling sessions helped me tremendously with my exam anxiety. My counsellor provided practical strategies that made a real difference.'
    },
    {
      name: 'Rahul Verma',
      role: 'IT Professional',
      image: 'assets/images/testimonial2.jpg',
      content: 'I was struggling with work-life balance and stress. My counsellor helped me develop better coping mechanisms and set healthy boundaries.'
    },
    {
      name: 'Anjali Patel',
      role: 'Parent',
      image: 'assets/images/testimonial3.jpg',
      content: 'The parenting counselling sessions gave me valuable insights into understanding my teenager better. Our relationship has improved significantly.'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  findCounsellors(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/user/counsellors']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
