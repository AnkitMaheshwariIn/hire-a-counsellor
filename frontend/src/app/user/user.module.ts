import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';

import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { CounsellorListComponent } from './components/counsellor-list/counsellor-list.component';
import { CounsellorDetailsComponent } from './components/counsellor-details/counsellor-details.component';
import { BookSessionComponent } from './components/book-session/book-session.component';
import { MySessionsComponent } from './components/my-sessions/my-sessions.component';

@NgModule({
  declarations: [
    UserDashboardComponent,
    CounsellorListComponent,
    CounsellorDetailsComponent,
    BookSessionComponent,
    MySessionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
