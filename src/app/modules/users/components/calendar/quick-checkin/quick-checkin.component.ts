import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar, MatStepper } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CheckInService } from '../../../services/checkin.service';
import { AdminService } from '../../../../../modules/admin/services/admin.service';
import { ErrorService } from '../../../../../services/error/error.service';
import { ProjectUser } from '../../../../../modules/admin/models/project-user.model';
import { Project, EPROJECT_TYPE } from '../../../../../modules/admin/models/project.model';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { CheckInModel } from '../../../../../modules/admin/models/checkin.model';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-quick-checkin',
  templateUrl: './quick-checkin.component.html',
  styleUrls: ['./quick-checkin.component.less']
})
export class QuickCheckinComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', {static:false}) private stepper: MatStepper;
  getProjectsSubscription: Subscription;
  getProjectsErrorSubscription: Subscription;
  getCheckInsSubscription: Subscription;
  getCheckInsErrorSubscription: Subscription;
  addCheckInsSubscription: Subscription;
  addCheckInsErrorSubscription: Subscription;
  lat: any;
  lng: any;
  zoom: number = 14;
  projectsUser: ProjectUser[] = [];
  isLinear: boolean = true;
  projectSelected: Project;
  textLocation: string;
  checkinToAdd: CheckInModel;
  done: boolean = false;
  EPROJECT_TYPE = EPROJECT_TYPE;
  horizontalStepper: boolean = true;
  start: moment.Moment;
  end: moment.Moment;
  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private checkInService: CheckInService,
    private adminService: AdminService,
    private errorService: ErrorService,
    public breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.breakpointObserver
    .observe(['(min-width: 700px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.horizontalStepper = true;
      } else {
        this.horizontalStepper = false;
      }
    });
    this.getCurrentLocaltion();
    this.getProjectsSubscription = this.adminService.getProjectUserCurrent$.subscribe(
      projects => {
        this.projectsUser = projects.filter(p=>p.project.overDate==false && p.project.isImputable);
        if (!this.projectsUser || this.projectsUser.length == 0) {
          this.snackBar.open('No tienes asignado ningún proyecto sobre el que imputar horas.', `Cerrar`, { duration: 0 });
          this.router.navigateByUrl(`/dashboard`);
        }
        else {
          if (this.projectsUser.length == 1) {
            this.stepper.selected.completed = true;
            this.setProjectSelected(this.projectsUser[0].project)
            this.stepper.next();
            this.getCurrentLocaltion();
          }
        }
      }
    );
    this.getProjectsErrorSubscription = this.adminService.getProjectUserCurrentError$.subscribe(
      error => {
        this.errorService.manageError(error);
      }
    );
    this.getCheckInsSubscription = this.checkInService.getCheckIns$.subscribe(
      checkins => {
        let checkinsOtherProjectUncompleteds = checkins.filter(c => c.idProject != this.projectSelected.idProject && c.startDate != null && c.endDate == null);
        if (checkinsOtherProjectUncompleteds.length > 0) {
          this.snackBar.open('Hay un registro sin finalizar de otro proyecto', 'Cerrar', { duration: 0 });
          this.projectSelected = null;
          this.checkinToAdd = null;
          this.done = false;
          this.stepper.previous();
        }
        else{
          let checkinsProjectUncompleteds = checkins.filter(c => c.idProject == this.projectSelected.idProject && c.startDate != null && c.endDate == null);
          if (checkinsProjectUncompleteds.length > 0) {
            if (checkinsProjectUncompleteds.length > 1)
              this.snackBar.open('Hay más de un fichaje incompleto para el proyecto seleccionado. Se imputará sobre el último de ellos', 'Cerrar', { duration: 0 });
            this.checkinToAdd = checkinsProjectUncompleteds[checkinsProjectUncompleteds.length - 1];
            this.checkinToAdd.toUpdate = true;
            this.checkinToAdd.endDate = new Date(Date.now());
            this.checkinToAdd.endDateMoment = moment(new Date());
            this.end = moment(this.checkinToAdd.endDate);
            //El reliable se deja como este. Si era true, sigue siendo tru porque ficha por aqui. Si era false sigue siendo false porque aunque ficha por aqui los dos deben ser true (el de inicio y el de fin)
          }
          else{
            this.checkinToAdd = new CheckInModel({})
            this.checkinToAdd.toInsert = true;
            this.checkinToAdd.startDate = new Date();
            this.checkinToAdd.startDateMoment = moment(new Date());
            this.checkinToAdd.endDate = null;
            //this.checkinToAdd.idUser Se establece el current user en el backend
            this.checkinToAdd.idProject = this.projectSelected.idProject;
            this.checkinToAdd.title = `${moment(new Date).format(environment.isoDateFormat)} - ${this.projectSelected.description}`;
            this.checkinToAdd.reliable = true;
          }
          this.checkinToAdd.lat = this.lat;
          this.checkinToAdd.lng = this.lng;
        }
      }
    );
    this.getCheckInsErrorSubscription = this.checkInService.getCheckInsError$.subscribe(
      error => {
        this.errorService.manageError(error);
      }
    );
    this.addCheckInsSubscription = this.checkInService.addCheckIns$.subscribe(
      checkins => {
        this.done = true;
        this.stepper.next();

      }
    );
    this.addCheckInsErrorSubscription = this.checkInService.addCheckInsError$.subscribe(
      error => {

        this.errorService.manageError(error);
      }
    );
    this.adminService.getProjectUserByCurrentUser();
  }
  private setMoment(date: Date): moment.Moment{
    let objMoment: moment.Moment = moment(date);
    objMoment = objMoment.set('hour', 0);
    objMoment = objMoment.set('minute', 0);
    let hour = date.getHours();
    let minute = date.getMinutes();
    objMoment = objMoment.add(hour, 'h');
    objMoment = objMoment.add(minute, 'm');
    return objMoment.local();
  }
  setProjectSelected(project: Project) {
    this.projectSelected = project;
    this.projectSelected.selected = true;
    this.checkInService.getCheckIns();
  }
  onClickProject(projectUserClicked: ProjectUser) {
    if(!this.done){
      this.projectsUser.forEach(projectUser => {
        if (projectUserClicked.idProjectUser === projectUser.idProjectUser) {

          this.setProjectSelected(projectUserClicked.project);
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
        else
          projectUser.project.selected = false;
      });
    }

  }
  verifyDone(){
    this.checkinToAdd.startDate = this.checkinToAdd.startDateMoment.toDate();
    if(this.checkinToAdd.endDate)
      this.checkinToAdd.endDate = this.checkinToAdd.endDateMoment.toDate();
    this.checkInService.postCheckinCurrentUser([this.checkinToAdd]);
  }
  reset(){

    this.stepper.reset();
    this.done = false;
    this.projectSelected = null;
    this.checkinToAdd = null;
    this.adminService.getProjectUserByCurrentUser();
  }
  getCurrentLocaltion() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = +pos.coords.latitude;
          this.lng = +pos.coords.longitude;
        },
        err => {
          this.router.navigateByUrl(`/dashboard`);
          this.snackBar.open('No se ha podido establecer la posición. Compruebe que ha dado permiso a la aplicación para permitirla geoposicionar', 'Cerrar', { duration: 0 })
        }
      );
    }
  }
  ngOnDestroy(): void {
    if (this.getProjectsSubscription) this.getProjectsSubscription.unsubscribe();
    if (this.getProjectsErrorSubscription) this.getProjectsErrorSubscription.unsubscribe();
    if (this.getCheckInsSubscription) this.getCheckInsSubscription.unsubscribe();
    if (this.getCheckInsErrorSubscription) this.getCheckInsErrorSubscription.unsubscribe();
    if (this.addCheckInsSubscription) this.addCheckInsSubscription.unsubscribe();
    if (this.addCheckInsErrorSubscription) this.addCheckInsErrorSubscription.unsubscribe();
  }

}
