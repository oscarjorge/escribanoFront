import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  {path: ':id', component: DashboardComponent, canActivate: [AuthGuard], data:{title: "DASHBOARD"}},
  { path: '', component: DashboardComponent, canActivate: [AuthGuard], data:{title: "DASHBOARD"}}
  
];



export const DashboardRouting: ModuleWithProviders = RouterModule.forChild(routes);