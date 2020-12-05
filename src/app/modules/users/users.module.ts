import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRouting } from './users.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DialogCheckIn } from './components/calendar/dialog-checkin/dialog-checkin.component';
import { AgmCoreModule } from '@agm/core';
import { CheckinEditComponent } from './components/calendar/checkin-edit/checkin-edit.component';
import { QuickCheckinComponent } from './components/calendar/quick-checkin/quick-checkin.component';

@NgModule({
  declarations: [ProfileComponent, CalendarComponent, DialogCheckIn, CheckinEditComponent, QuickCheckinComponent],
  imports: [
    CommonModule,
    UsersRouting,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedComponentsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AgmCoreModule
  ],
  entryComponents:[
    DialogCheckIn
  ]
})
export class UsersModule { }
