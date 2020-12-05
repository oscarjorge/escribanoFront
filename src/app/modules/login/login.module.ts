import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { LoginRouting } from './login-routing';
import { ApiService } from '../../services/api/api.service';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRouting,
    SharedComponentsModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers:[
    ApiService
  ]
})
export class LoginModule { }
