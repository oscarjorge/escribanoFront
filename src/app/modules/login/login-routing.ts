import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  //Login
  {
    path: '', component: LoginComponent, data:{title: "LOGIN"}
  },
  {
    path: 'a', component: LoginComponent, data:{title: "LOGIN"}
  },
  {
    path: 'confirm/:user/:pass/:mail', component: LoginComponent, data:{title: "CONFIRM"}
  },
];



export const LoginRouting: ModuleWithProviders = RouterModule.forChild(routes);
