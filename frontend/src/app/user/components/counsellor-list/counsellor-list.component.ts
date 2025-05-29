import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Counsellor } from '../../../shared/models/counsellor.model';
import { Topic } from '../../../shared/models/topic.model';
import { Location } from '../../../shared/models/location.model';

@Component({
  selector: 'app-counsellor-list',
  templateUrl: './counsellor-list.component.html',
  styleUrls: ['./counsellor-list.component.scss']
})
export class CounsellorListComponent implements OnInit {
  counsellors: Counsellor[] = [];
  filteredCounsellors: Counsellor[] = [];
  topics: Topic[] = [];
  locations: Location[] = [];
  filterForm: FormGroup;
  loading = true;
  error = '';
  searchTerm = '';
  
  sortOptions = [
    { value: 'rating', viewValue: 'Rating (High to Low)' },
    { value: 'experience', viewValue: 'Experience (High to Low)' },
    { value: 'hourlyRate', viewValue: 'Price (Low to High)' }
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      topics: [[]],
      locations: [[]],
      sortBy: ['rating']
    });
  }

  ngOnInit(): void {
    this.loadCounsellors();
    this.loadTopics();
    this.loadLocations();
    
    // Subscribe to form value changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadCounsellors(): void {
    this.loading = true;
    this.userService.getCounsellors().subscribe({
      next: (counsellors) => {
        this.counsellors = counsellors;
        this.filteredCounsellors = [...counsellors];
        this.sortCounsellors(this.filterForm.value.sortBy);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load counsellors';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadTopics(): void {
    this.userService.getTopics().subscribe({
      next: (topics) => {
        this.topics = topics.filter(topic => topic.isActive);
      },
      error: (err) => {
        console.error('Failed to load topics', err);
      }
    });
  }

  loadLocations(): void {
    this.userService.getLocations().subscribe({
      next: (locations) => {
        this.locations = locations.filter(location => location.isActive);
      },
      error: (err) => {
        console.error('Failed to load locations', err);
      }
    });
  }

  applyFilters(): void {
    const { topics, locations, sortBy } = this.filterForm.value;
    
    // Filter by search term
    let filtered = this.counsellors.filter(counsellor => {
      if (!this.searchTerm) return true;
      
      const searchLower = this.searchTerm.toLowerCase();
      return (
        counsellor.name.toLowerCase().includes(searchLower) ||
        (counsellor.specialization && counsellor.specialization.toLowerCase().includes(searchLower))
      );
    });
    
    // Filter by topics
    if (topics && topics.length > 0) {
      filtered = filtered.filter(counsellor => {
        if (!counsellor.topics) return false;
        return topics.some((topicId: string) => 
          counsellor.topics?.some(t => t._id === topicId || (typeof t === 'string' && t === topicId))
        );
      });
    }
    
    // Filter by locations
    if (locations && locations.length > 0) {
      filtered = filtered.filter(counsellor => {
        if (!counsellor.locations) return false;
        return locations.some((locationId: string) => 
          counsellor.locations?.some(l => l._id === locationId || (typeof l === 'string' && l === locationId))
        );
      });
    }
    
    this.filteredCounsellors = filtered;
    this.sortCounsellors(sortBy);
  }

  sortCounsellors(sortBy: string): void {
    switch (sortBy) {
      case 'rating':
        this.filteredCounsellors.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'experience':
        this.filteredCounsellors.sort((a, b) => (b.experience || 0) - (a.experience || 0));
        break;
      case 'hourlyRate':
        this.filteredCounsellors.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
        break;
      default:
        break;
    }
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      topics: [],
      locations: [],
      sortBy: 'rating'
    });
    this.searchTerm = '';
    this.filteredCounsellors = [...this.counsellors];
    this.sortCounsellors('rating');
  }

  viewCounsellorDetails(id: string): void {
    this.router.navigate(['/user/counsellors', id]);
  }

  bookSession(id: string): void {
    this.router.navigate(['/user/book', id]);
  }

  compareTopicObjects(topic1: any, topic2: any): boolean {
    return topic1 && topic2 ? topic1 === topic2 || topic1._id === topic2._id : topic1 === topic2;
  }

  compareLocationObjects(location1: any, location2: any): boolean {
    return location1 && location2 ? location1 === location2 || location1._id === location2._id : location1 === location2;
  }
}
