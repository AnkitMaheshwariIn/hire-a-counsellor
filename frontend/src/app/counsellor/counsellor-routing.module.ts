import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounsellorDashboardComponent } from './components/counsellor-dashboard/counsellor-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { SessionDetailComponent } from './components/session-detail/session-detail.component';

const routes: Routes = [
  { path: '', component: CounsellorDashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'availability', component: AvailabilityComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: 'sessions/:id', component: SessionDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounsellorRoutingModule { }
