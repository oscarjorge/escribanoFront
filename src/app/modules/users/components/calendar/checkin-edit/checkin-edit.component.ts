import { Component, NgZone, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MatSelectChange, MatCheckboxChange, MAT_CHECKBOX_CLICK_ACTION, MatSnackBar } from '@angular/material';
import { CheckInModel } from '../../../../../modules/admin/models/checkin.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ProjectUser } from '../../../../../modules/admin/models/project-user.model';
import { Subscription } from 'rxjs';
import { CheckInService } from '../../../services/checkin.service';
import { AdminService } from '../../../../../modules/admin/services/admin.service';
import { ErrorService } from '../../../../../services/error/error.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
declare var google;
@Component({
  selector: 'app-checkin-edit',
  templateUrl: './checkin-edit.component.html',
  styleUrls: ['./checkin-edit.component.less'],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' }
  ]
})
export class CheckinEditComponent implements OnInit, OnDestroy {

  getCheckInsSubscription: Subscription;
  getCheckInsErrorSubscription: Subscription;
  getProjectsSubscription: Subscription;
  getProjectsErrorSubscription: Subscription;
  addCheckInsSubscription: Subscription;
  addCheckInsErrorSubscription: Subscription;
  loading: boolean;
  form: FormGroup;
  events: CheckInModel[];
  date: any;
  event: CheckInModel;
  projectsUser: ProjectUser[] = [];
  selectImpValue: number;
  lat: any;
  lng: any;
  zoom: number = 14;
  address: string;
  private geoCoder;
  @ViewChild("search", {static:false})
  searchElementRef: ElementRef;
  constructor(private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private checkInService: CheckInService,
    private adminService: AdminService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {



  }

  ngOnInit() {
    this.loading = true;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.form.get('reliable').setValue(false);
        });
      });
    });
    this.getCheckInsSubscription = this.checkInService.getCheckInsUserDate$.subscribe(
      checkins => {
        this.loading = false;
        let arr = [];
        checkins.forEach(checkin => {
          arr.push(checkin)
        });
        this.events = arr;
        if (!this.events || this.events.length == 0)
          this.selectImpValue = -1;
        else
          this.selectImpValue = this.events[0].idCheckIn;

        this.event = this.events.find(d => d.id == this.selectImpValue);
        this.setForm(this.event);
        if (!this.event) {
          this.form.get('reliable').setValue(true);
          this.currentPositionChange({ checked: true, source: null });
        }
        else {
          this.lat = this.event.lat;
          this.lng = this.event.lng;
        }

      }
    );
    this.getCheckInsErrorSubscription = this.checkInService.getCheckInsUserDateError$.subscribe(
      error => {
        this.loading = false;
        this.errorService.manageError(error);
      }
    );
    this.getProjectsSubscription = this.adminService.getProjectUserCurrent$.subscribe(
      projects => {
        this.projectsUser = projects.filter(p=>p.project.overDate==false && p.project.isImputable);
        if (!this.projectsUser || this.projectsUser.length == 0){
          this.snackBar.open('No tienes asignado ningún proyecto sobre el que imputar horas.', `Cerrar`, { duration: 0 });
          this.router.navigateByUrl(`/users/calendar`);
        }
        else
          this.checkInService.getCheckInsUserDate(moment(this.date).format(environment.isoDateFormat));
      }
    );
    this.getProjectsErrorSubscription = this.adminService.getProjectUserCurrentError$.subscribe(
      error => {
        this.errorService.manageError(error);
      }
    );
    this.addCheckInsSubscription = this.checkInService.addCheckIns$.subscribe(
      checkins => {
        this.router.navigateByUrl(`/users/calendar`);
      }
    );
    this.addCheckInsErrorSubscription = this.checkInService.addCheckInsError$.subscribe(
      error => {
        this.loading = false;
        this.errorService.manageError(error);
      }
    );
    this.route.paramMap.subscribe(params => {
      this.date = new Date(params.get('date'));
      this.adminService.getProjectUserByCurrentUser();
    });
  }
  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {

          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  currentPositionChange(e: MatCheckboxChange) {

    if (!e.checked) {
      this.lat = 0;
      this.lng = 0;
      this.form.get('reliable').setValue(false);
    }
    else {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
          this.lat = +pos.coords.latitude;
          this.lng = +pos.coords.longitude;
          this.form.get('reliable').setValue(true);
        },
        err=>{
          this.form.get('reliable').setValue(false);
          this.form.get('reliable').disable();
          this.snackBar.open('No se ha podido establecer la posición. Compruebe que ha dado permiso a la aplicación para permitirla geoposicionar', 'Cerrar', { duration: 0 })
        }
        );
      }
      else {
        this.snackBar.open('No se ha podido establecer la posición. Compruebe que ha dado permiso a la aplicación para permitirla geoposicionar', 'Cerrar', { duration: 0 })
      }
    }

  }
  selectionChange(e: MatSelectChange) {
    this.event = this.events.find(d => d.id == e.value);

    this.setForm(this.event);
  }
  selectionChangeProject(e: MatSelectChange) {
    this.form.get('title').setValue( this.getTitleDefault(e.value));
  }
  // private toTimeFormat(objMoment: moment.Moment): string{
  //   if(!objMoment) return null;
  //   let hour = objMoment.local().hour();
  //   let timePeriod = 'AM';
  //   if(hour>11){
  //     hour= hour-12;
  //     timePeriod = 'PM'
  //   }
  //   return `${hour}:${objMoment.local().minute()} ${timePeriod}`;
  // }
  private setMoment(start: boolean): moment.Moment{
    let objMoment: moment.Moment = (start)? this.form.get('date_start').value:this.form.get('date_end').value;
    objMoment = objMoment.set('hour', 0);
    objMoment = objMoment.set('minute', 0);

    let hour = (start)?this.form.get('time_start').value.split(':')[0]:this.form.get('time_end').value.split(':')[0];
    let minute = (start)?this.form.get('time_start').value.split(':')[1].split(' ')[0]:this.form.get('time_end').value.split(':')[1].split(' ')[0];
    let timePeriod = (start)?this.form.get('time_start').value.split(':')[1].split(' ')[1]:this.form.get('time_end').value.split(':')[1].split(' ')[1];
    if(timePeriod=='PM' && hour!=12)
      hour = Number(hour)+12;
    if (timePeriod == 'AM' && hour == 12)
      hour=0;;
    objMoment = objMoment.add(hour, 'h');

    objMoment = objMoment.add(minute, 'm');
    return objMoment.local();
  }
  private getTitleDefault(idProject:number): string{
    return `${this.date.toLocaleDateString()} - ${this.projectsUser.find(p=>p.idProject==idProject).project.description}`;
  }
  setForm(event: CheckInModel) {
    this.event = event;
    if(event){
      this.lat = this.event.lat;
        this.lng = this.event.lng;
    }

    this.form = this.fb.group({
      project: new FormControl((this.event) ? this.event.project.idProject : this.projectsUser[0].idProject, [Validators.required]),
      id: new FormControl((this.event) ? this.event.id : 0, [Validators.required]),
      title: new FormControl((this.event) ? this.event.title : this.getTitleDefault(this.projectsUser[0].idProject), [Validators.required]),
      date_start: new FormControl((this.event) ? moment(this.event.start) : moment(this.date), [Validators.required]),
      time_start: new FormControl((this.event && this.event.timeStart) ? this.event.timeStart : '00:00 AM', [Validators.required]),
      date_end: new FormControl((this.event) ? moment(this.event.end) : moment(this.date), [Validators.required]),
      time_end: new FormControl((this.event && this.event.timeEnd) ? this.event.timeEnd : '00:00 AM', [Validators.required]),

      comments: new FormControl((this.event) ? this.event.comments : ''),
      finished: new FormControl((this.event) ? this.event.finished : false, [Validators.required]),

      reliable: new FormControl((this.event) ? this.event.reliable : true),
    });

  }
  onDelete(): void {
    this.event.toRemove = true;
    this.checkInService.addCheckIns(this.events);
  }
  onClick(): void {
    //Reliable siempre será false desde aqui
    if (this.form.valid) {
      if (!this.event) {
        debugger;
        this.event = new CheckInModel({
          idCheckin: 0,
          startDate: this.setMoment(true).toDate(),
          endDate: this.setMoment(false).toDate(),
          finished: this.form.get('finished').value,
          comments: this.form.get('comments').value,
          title: this.form.get('title').value,
          lat: this.lat,
          lng: this.lng,
          reliable: false,
        })
        this.event.toInsert = true;
        this.event.project = this.projectsUser.find(pu => pu.idProject == this.form.get('project').value).project;
        this.event.idProject = this.event.project.idProject;
        this.event.idUser = this.projectsUser.find(pu => pu.idProject == this.form.get('project').value).idUser;
        this.event.color = {
          primary: (this.event.project) ? this.event.project.colorPrimary : null,
          secondary: (this.event.project) ? this.event.project.colorSecondary : null,
        }
        this.event.toInsert = true;
        this.event.reliable = false;
        this.events.push(this.event);
      }
      else {
        this.event.title = this.form.get('title').value;
        this.event.start = this.setMoment(true).toDate();
        this.event.end = this.setMoment(false).toDate();
        this.event.startDate = this.setMoment(true).toDate();
        this.event.endDate = this.setMoment(false).toDate();
        this.event.finished = this.form.get('finished').value;
        this.event.comments = this.form.get('comments').value;
        this.event.lat = this.lat;
        this.event.lng = this.lng;
        this.event.reliable = false;
        this.event.project = this.projectsUser.find(pu => pu.idProject == this.form.get('project').value).project;
        this.event.idProject = this.event.project.idProject;
        this.event.toUpdate = true;
      }
      this.checkInService.addCheckIns(this.events);
    }

  }
  onNoClick(): void {
    this.router.navigateByUrl(`/users/calendar`);
  }
  onNext(){
    this.router.navigateByUrl(`/users/checkin/${moment(this.date).add(1,'d').format(environment.isoDateFormat)}`);
  }
  onPrevious(){
    this.router.navigateByUrl(`/users/checkin/${moment(this.date).subtract(1,'d').format(environment.isoDateFormat)}`);
  }
  getDateFormat(){
    return moment(this.date).format("DD/MM/YYYY");
  }
  ngOnDestroy(): void {
    if (this.getCheckInsSubscription) this.getCheckInsSubscription.unsubscribe();
    if (this.getCheckInsErrorSubscription) this.getCheckInsErrorSubscription.unsubscribe();
    if (this.getProjectsSubscription) this.getProjectsSubscription.unsubscribe();
    if (this.getProjectsErrorSubscription) this.getProjectsErrorSubscription.unsubscribe();
    if (this.addCheckInsSubscription) this.addCheckInsSubscription.unsubscribe();
    if (this.addCheckInsErrorSubscription) this.addCheckInsErrorSubscription.unsubscribe();
  }
}
