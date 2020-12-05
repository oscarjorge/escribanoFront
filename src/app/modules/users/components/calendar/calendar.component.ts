import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscribable, Subscription } from 'rxjs';
import { CalendarEvent, DAYS_OF_WEEK } from 'calendar-utils';
import * as moment from 'moment';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { CalendarEventAction, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { CheckInService } from '../../services/checkin.service';
import { ErrorService } from '../../../../services/error/error.service';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogCheckIn } from './dialog-checkin/dialog-checkin.component';
import { CheckInModel } from '../../../../modules/admin/models/checkin.model';
import { AdminService } from '../../../../modules/admin/services/admin.service';
import { ProjectUser } from '../../../../modules/admin/models/project-user.model';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
// const colors: any = {
//   red: {
//     primary: '#ad2121',
//     secondary: '#FAE3E3'
//   },
//   blue: {
//     primary: '#1e90ff',
//     secondary: '#D1E8FF'
//   },
//   yellow: {
//     primary: '#e3bc08',
//     secondary: '#FDF1BA'
//   }
// };
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit, OnDestroy {
  locale: string = 'es';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
  getCheckInsSubscription: Subscription;
  getCheckInsErrorSubscription: Subscription;
  addCheckInsSubscription: Subscription;
  addCheckInsErrorSubscription: Subscription;
  getProjectsSubscription: Subscription;
  getProjectsErrorSubscription: Subscription;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  refresh: Subject<any> = new Subject();
  loading: boolean = false;
  actions: CalendarEventAction[] = [];
  events: CheckInModel[] = [];

  projectsUser: ProjectUser[] = [];
  constructor(
    private checkInService: CheckInService,
    private adminService: AdminService,
    private errorService: ErrorService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getCheckInsSubscription = this.checkInService.getCheckIns$.subscribe(
      checkins => {
        this.loading = false;
        let arr = [];
        checkins.forEach(checkin => {
          arr.push(checkin)
        });
        this.events = arr;
      }
    );
    this.getCheckInsErrorSubscription = this.checkInService.getCheckInsError$.subscribe(
      error => {
        this.loading = false;
        this.errorService.manageError(error);
      }
    );
    this.getProjectsSubscription = this.adminService.getProjectUserCurrent$.subscribe(
      projects => {
        this.projectsUser = projects;
      }
    );
    this.getProjectsErrorSubscription = this.adminService.getProjectUserCurrentError$.subscribe(
      error => {
        this.errorService.manageError(error);
      }
    );
    this.addCheckInsSubscription = this.checkInService.addCheckIns$.subscribe(
      checkins => {

        this.loading = false;
        let arr = [];
        checkins.forEach(checkin => {
          arr.push(checkin)
        });
        this.events = arr;
      }
    );
    this.addCheckInsErrorSubscription = this.checkInService.addCheckInsError$.subscribe(
      error => {
        this.loading = false;
        this.errorService.manageError(error);
      }
    );
    this.checkInService.getCheckIns();
    this.adminService.getProjectUserByCurrentUser();
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {

    let eventUpdated = this.events.find(e => e.idCheckIn == event.id);
    eventUpdated.startDate = newStart;
    eventUpdated.endDate = newEnd;
    eventUpdated.toUpdate = true;
    this.loading = true;
    this.checkInService.addCheckIns(this.events);
  }
  handleEvent(action: string, event: CheckInModel): void {
    let data: any = {
      events: [
        event
      ],
      date: event.startDate,
    };
    this.openDialog(data);

  }
  openDialog(data) {
    this.router.navigateByUrl(`/users/checkin/${moment(data.date).format(environment.isoDateFormat)}`);
    // if (this.projectsUser && this.projectsUser.length > 0) {
    //   data.projects = this.projectsUser;
    //   const dialogRef = this.dialog.open(DialogCheckIn, {
    //     width: '650px',
    //     data: data
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       this.loading = true;
    //       this.checkInService.addCheckIns(result);
    //     }
    //   });
    // }
    // else {
    //   this.snackBar.open('No tienes asignado ningún proyecto sobre el que imputar horas.', `Cerrar`, { duration: 0 });
    // }
  }
  dayClicked(e) {
    this.openDialog(e)
  }
  setView(view: CalendarView) {
    this.view = view;
  }
  ngOnDestroy(): void {
    if (this.getCheckInsSubscription) this.getCheckInsSubscription.unsubscribe();
    if (this.getCheckInsErrorSubscription) this.getCheckInsErrorSubscription.unsubscribe();
    if (this.addCheckInsSubscription) this.addCheckInsSubscription.unsubscribe();
    if (this.addCheckInsErrorSubscription) this.addCheckInsErrorSubscription.unsubscribe();
    if (this.getProjectsSubscription) this.getProjectsSubscription.unsubscribe();
    if (this.getProjectsErrorSubscription) this.getProjectsErrorSubscription.unsubscribe();
  }
}
