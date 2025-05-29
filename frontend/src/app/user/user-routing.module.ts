import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { CounsellorListComponent } from './components/counsellor-list/counsellor-list.component';
import { CounsellorDetailsComponent } from './components/counsellor-details/counsellor-details.component';
import { BookSessionComponent } from './components/book-session/book-session.component';
import { MySessionsComponent } from './components/my-sessions/my-sessions.component';

const routes: Routes = [
  { path: '', component: UserDashboardComponent },
  { path: 'counsellors', component: CounsellorListComponent },
  { path: 'counsellors/:id', component: CounsellorDetailsComponent },
  { path: 'book/:id', component: BookSessionComponent },
  { path: 'sessions', component: MySessionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
