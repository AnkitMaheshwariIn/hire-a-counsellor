import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ManageCounsellorsComponent } from './components/manage-counsellors/manage-counsellors.component';
import { ManageTopicsComponent } from './components/manage-topics/manage-topics.component';
import { ManageLocationsComponent } from './components/manage-locations/manage-locations.component';
import { ManageSessionsComponent } from './components/manage-sessions/manage-sessions.component';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageUsersComponent,
    ManageCounsellorsComponent,
    ManageTopicsComponent,
    ManageLocationsComponent,
    ManageSessionsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdminModule { }
