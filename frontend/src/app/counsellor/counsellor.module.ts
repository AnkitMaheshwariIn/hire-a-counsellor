import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CounsellorRoutingModule } from './counsellor-routing.module';
import { SharedModule } from '../shared/shared.module';

import { CounsellorDashboardComponent } from './components/counsellor-dashboard/counsellor-dashboard.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { SessionDetailComponent } from './components/session-detail/session-detail.component';

@NgModule({
  declarations: [
    CounsellorDashboardComponent,
    AvailabilityComponent,
    ProfileComponent,
    SessionsComponent,
    SessionDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CounsellorRoutingModule,
    SharedModule
  ]
})
export class CounsellorModule { }
