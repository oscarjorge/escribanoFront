import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../shared/shared-components.module';

import { MaterialModule } from '../material/material.module';

import { DashboardRouting } from './dashboard.routing';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApiService } from '../../services/api/api.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRouting,
    SharedComponentsModule,
    MaterialModule,

  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [
    ApiService
  ]
})
export class DashboardModule { }
