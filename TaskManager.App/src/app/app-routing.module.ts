import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './Components/landing/landing.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AdminComponent } from './Components/admin/admin.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { AnalyticsDashboardComponent } from './Components/analytics-dashboard/analytics-dashboard.component';
import { SubtaskBoardComponent } from './Components/subtask-board/subtask-board.component';
import { AnimationsComponent } from './Components/animations/animations.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';
import { HelpComponent } from './Components/help/help.component';
import { DeveloperDocsComponent } from './Components/developer-docs/developer-docs.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected app routes
  { path: 'dashboard',  component: DashboardComponent,        canActivate: [AuthGuard] },
  { path: 'settings',   component: SettingsComponent,         canActivate: [AuthGuard] },
  { path: 'calendar',   component: CalendarComponent,         canActivate: [AuthGuard] },
  { path: 'analytics',  component: AnalyticsDashboardComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'admin',      component: AdminComponent,            canActivate: [AuthGuard] },
  { path: 'admin/tasks', component: AdminComponent,           canActivate: [AuthGuard] },
  { path: 'admin/users', component: AdminComponent,           canActivate: [AuthGuard] },
  { path: 'tasks/:id/subtasks', component: SubtaskBoardComponent, canActivate: [AuthGuard] },
  { path: 'animations', component: AnimationsComponent,       canActivate: [AuthGuard] },
  { path: 'help',       component: HelpComponent,             canActivate: [AuthGuard] },
  { path: 'developer-docs', component: DeveloperDocsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
