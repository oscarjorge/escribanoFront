import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../auth/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CheckinEditComponent } from './components/calendar/checkin-edit/checkin-edit.component';
import { QuickCheckinComponent } from './components/calendar/quick-checkin/quick-checkin.component';

const routes: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data:{title: "ProfileComponent"}},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard], data:{title: "CalendarComponent"}},
  {path: 'checkin/:date', component: CheckinEditComponent, canActivate: [AuthGuard], data:{title: "CheckinEditComponent"}},
  {path: 'quick-checkin', component: QuickCheckinComponent, canActivate: [AuthGuard], data:{title: "QuickCheckinComponent"}},
];

export const UsersRouting: ModuleWithProviders = RouterModule.forChild(routes);
