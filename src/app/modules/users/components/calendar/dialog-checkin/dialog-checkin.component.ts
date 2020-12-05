import { Component, Inject, NgZone, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange, MatCheckboxChange, MAT_CHECKBOX_CLICK_ACTION, MatSnackBar } from '@angular/material';
import { CheckInModel } from '../../../../../modules/admin/models/checkin.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MapsAPILoader, MouseEvent  } from '@agm/core';
import { ProjectUser } from '../../../../../modules/admin/models/project-user.model';
declare var google;
@Component({
  selector: 'dialog-checkin',
  templateUrl: 'dialog-checkin.component.html',
  styleUrls: ['./dialog-checkin.component.less'],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' }
  ]
})
export class DialogCheckIn {
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
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCheckIn>,
    public snackBar: MatSnackBar,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.date = data.date;
    this.events = data.events;
    this.projectsUser = data.projects
    if (!this.events || this.events.length == 0)
      this.selectImpValue = -1;
    else
      this.selectImpValue = this.events[0].idCheckIn;

    this.event = this.events.find(d => d.id == this.selectImpValue);
    this.setForm(this.event);
    this.mapsAPILoader.load().then(() => {
      if (!this.event) {
        this.form.get('reliable').setValue(true);
        this.currentPositionChange({ checked: true, source: null });
      }
      else{
        this.lat = this.event.lat;
        this.lng = this.event.lng;
      }
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
        navigator.geolocation.getCurrentPosition(pos => {
          this.lat = +pos.coords.latitude;
          this.lng = +pos.coords.longitude;
          this.form.get('reliable').setValue(true);
        });
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

  }
  private toTimeFormat(objMoment: moment.Moment): string{
    if(!objMoment) return null;
    let hour = objMoment.utc(false).hour();
    let timePeriod = 'AM';
    if(hour>11){
      hour= hour-12;
      timePeriod = 'PM'
    }
    return `${hour}:${objMoment.utc(false).minute()} ${timePeriod}`;
  }
  setForm(event: CheckInModel) {
    this.event = event;
    this.form = this.fb.group({
      project: new FormControl((this.event) ? this.event.project.idProject : this.projectsUser[0].idProject, [Validators.required]),
      id: new FormControl((this.event) ? this.event.id : 0, [Validators.required]),
      title: new FormControl((this.event) ? this.event.title : this.date.toLocaleDateString(), [Validators.required]),
      date_start: new FormControl((this.event) ? moment(this.event.start) : moment(this.date), [Validators.required]),
      time_start: new FormControl((this.event) ? moment(this.event.start) : this.toTimeFormat(moment(this.date)), [Validators.required]),


      date_end: new FormControl((this.event) ? moment(this.event.end) : moment(this.date), [Validators.required]),
      time_end: new FormControl((this.event) ? moment(this.event.end) : this.toTimeFormat(moment(this.date).add(1,'hours')), [Validators.required]),
      // start: new FormControl((this.event) ? moment(this.event.start) : moment(this.date), [Validators.required]),
      // end: new FormControl((this.event) ? moment(this.event.end) : moment(this.date), [Validators.required]),
      comments: new FormControl((this.event) ? this.event.comments : ''),
      finished: new FormControl((this.event) ? this.event.finished : false, [Validators.required]),

      reliable: new FormControl((this.event) ? this.event.reliable : false),
    });
  }
  onDelete(): void {
    this.event.toRemove = true;
    this.dialogRef.close(this.events);
  }
  onClick(): void {
    if (this.form.valid) {
      if (!this.event) {
        this.event = new CheckInModel({
          idCheckin: 0,
          startDate: this.form.get('start').value.toDate(),
          endDate: this.form.get('end').value.toDate(),
          finished: this.form.get('finished').value,
          comments: this.form.get('comments').value,
          title: this.form.get('title').value,
          lat: this.lat,
          lng: this.lng,
          reliable: this.form.get('reliable').value,
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
        this.events.push(this.event);
      }
      else {
        this.event.title = this.form.get('title').value;
        this.event.start = this.form.get('start').value.toDate();
        this.event.end = this.form.get('end').value.toDate();
        this.event.startDate = this.form.get('start').value.toDate();
        this.event.endDate = this.form.get('end').value.toDate();
        this.event.finished = this.form.get('finished').value;
        this.event.comments = this.form.get('comments').value;
        this.event.lat = this.lat;
        this.event.lng = this.lng;
        this.event.reliable = this.form.get('reliable').value;
        this.event.project = this.projectsUser.find(pu => pu.idProject == this.form.get('project').value).project;
        this.event.idProject = this.event.project.idProject;
        this.event.toUpdate = true;
      }

      this.dialogRef.close(this.events);
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
