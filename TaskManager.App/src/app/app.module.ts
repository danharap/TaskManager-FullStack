import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpdateTaskComponent } from './update-task/update-task.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { TaskListComponent } from './Components/task-list/task-list.component';
import { CreateTaskComponent } from './Components/create-task/create-task.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { AdminComponent } from './Components/admin/admin.component';
import { BannerComponent } from './Components/banner/banner.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskDialogComponent } from './Components/task-dialog/task-dialog.component';
import { UpdateUsernameDialogComponent } from './Components/update-username-dialog/update-username-dialog.component';
import { UpdateRoleDialogComponent } from './Components/update-role-dialog/update-role-dialog.component';
import { AnalyticsDashboardComponent } from './Components/analytics-dashboard/analytics-dashboard.component';
import { SubtaskBoardComponent } from './Components/subtask-board/subtask-board.component';
import { AnimationsComponent } from './Components/animations/animations.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FabCreateTaskComponent } from './Components/fab-create-task/fab-create-task.component';
import { LoadingSpinnerComponent } from './Components/loading-spinner/loading-spinner.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';
import { ToastComponent } from './Components/toast/toast.component';
import { HelpComponent } from './Components/help/help.component';
import { DeveloperDocsComponent } from './Components/developer-docs/developer-docs.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    UpdateTaskComponent,
    DashboardComponent,
    TaskListComponent,
    CreateTaskComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    BannerComponent,
    SidebarComponent,
    SettingsComponent,
    CalendarComponent,
    TaskDialogComponent,
    UpdateUsernameDialogComponent,
    UpdateRoleDialogComponent,
    AnalyticsDashboardComponent,
    SubtaskBoardComponent,
    AnimationsComponent,
    FabCreateTaskComponent,
    LoadingSpinnerComponent,
    NotificationsComponent,
    ToastComponent,
    HelpComponent,
    DeveloperDocsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    BrowserAnimationsModule, // Add this
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}