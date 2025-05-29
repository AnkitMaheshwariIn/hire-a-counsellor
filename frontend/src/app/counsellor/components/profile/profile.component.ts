import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CounsellorService } from '../../services/counsellor.service';
import { Counsellor } from '../../../shared/models/counsellor.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  counsellor: Counsellor | null = null;
  loading = false;
  error = '';
  successMessage = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  
  constructor(
    private fb: FormBuilder,
    private counsellorService: CounsellorService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCounsellorProfile();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('^[0-9]{10}$')],
      bio: ['', Validators.required],
      specialization: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0)]],
      qualifications: ['', Validators.required],
      languages: ['', Validators.required],
      sessionRate: ['', [Validators.required, Validators.min(0)]],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      pincode: ['', Validators.pattern('^[0-9]{6}$')]
    });
  }

  loadCounsellorProfile(): void {
    this.loading = true;
    this.counsellorService.getCounsellorProfile().subscribe({
      next: (counsellor) => {
        this.counsellor = counsellor;
        this.patchFormValues(counsellor);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  patchFormValues(counsellor: Counsellor): void {
    // Extract only the properties that are in the form
    const formValues = {
      name: counsellor.name,
      email: counsellor.email,
      phone: counsellor.phone || '',
      bio: counsellor.bio || '',
      specialization: counsellor.specialization || '',
      experience: counsellor.experience || '',
      qualifications: counsellor.qualifications || '',
      languages: counsellor.languages || '',
      sessionRate: counsellor.sessionRate || '',
      address: counsellor.address || '',
      city: counsellor.city || '',
      state: counsellor.state || '',
      country: counsellor.country || '',
      pincode: counsellor.pincode || ''
    };
    
    this.profileForm.patchValue(formValues);
    
    // Set image preview if available
    if (counsellor.profilePicture) {
      this.imagePreview = counsellor.profilePicture;
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    const profileData = this.profileForm.value;
    
    this.counsellorService.updateCounsellorProfile(profileData).subscribe({
      next: (updatedProfile) => {
        this.successMessage = 'Profile updated successfully';
        this.counsellor = updatedProfile;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update profile';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      return;
    }

    this.loading = true;
    this.counsellorService.updateProfilePicture(this.selectedFile).subscribe({
      next: (response) => {
        this.successMessage = 'Profile picture updated successfully';
        this.loading = false;
        // Reload profile to get updated picture URL
        this.loadCounsellorProfile();
      },
      error: (err) => {
        this.error = 'Failed to update profile picture';
        this.loading = false;
      }
    });
  }

  clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }
}
