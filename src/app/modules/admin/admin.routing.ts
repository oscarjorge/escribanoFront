import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProposalUserComponent } from './components/proposal-user/proposal-user.component';
import { AuthGuard } from '../../auth/auth.guard';
import { ProjectComponent } from './components/project/project.component';
import { UserComponent } from './components/user/user.component';
import { AdminGuard } from '../../auth/admin.guard';

const routes: Routes = [
  {path: 'user/proposal', component: ProposalUserComponent, canActivate: [AuthGuard, AdminGuard], data:{title: "ProposalUserComponent"}},
  {path: 'projects/:id', component: ProjectComponent, canActivate: [AuthGuard, AdminGuard], data:{title: "Projects"}},
  {path: 'projects', component: ProjectComponent, canActivate: [AuthGuard, AdminGuard], data:{title: "Projects"}},
  {path: 'users', component: UserComponent, canActivate: [AuthGuard, AdminGuard], data:{title: "Usuarios"}},

];



export const AdminRouting: ModuleWithProviders = RouterModule.forChild(routes);
