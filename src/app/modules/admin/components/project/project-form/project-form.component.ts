import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Project } from '../../../models/project.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProjectUser } from '../../../models/project-user.model';
import * as moment from 'moment';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
@Component({
  selector: 'admin-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.less'],
  providers: [
    { provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' }
  ]
})
export class ProjectFormComponent implements OnInit, OnChanges {

  @Input() item: Project;
  @Output() onSave = new EventEmitter<Project>();
  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.item && changes.item.currentValue){
      this.form = this.fb.group({
        description: new FormControl(this.item.description, [Validators.required]),
        projectNumber: new FormControl(this.item.projectNumber),
        startDate: new FormControl(moment(this.item.startDate), [Validators.required]),
        endDate: new FormControl(moment(this.item.endDate), [Validators.required]),
        projectManager: new FormControl(this.item.projectManager),
        colorPrimary: new FormControl(this.item.colorPrimary, [Validators.required]),
        colorSecondary: new FormControl(this.item.colorSecondary, [Validators.required]),
        isImputable: new FormControl(this.item.isImputable, [Validators.required]),
      });
      this.form.valueChanges.subscribe(
        a=>{
          this.item.description = a.description;
          this.item.projectNumber = a.projectNumber;
          this.item.startDate = a.startDate.toDate();
          this.item.endDate = a.endDate.toDate();
          this.item.projectManager = a.projectManager;
          this.item.colorPrimary = a.colorPrimary;
          this.item.colorSecondary = a.colorSecondary;
          this.item.isImputable = a.isImputable;
          this.item = JSON.parse(JSON.stringify(this.item));
        }
      );

    }
  }
  onMainColorChange(mainColor: any): void {

    this.form.patchValue({ colorPrimary: mainColor })
  }

  onSecondaryColorChange(secondaryColor: any): void {
    this.form.patchValue({ colorSecondary: secondaryColor })
  }

  save(){
    if(this.form.valid){
      let invalidUser: boolean =false;
      this.item.projectUser.forEach(pu=>{
        invalidUser = invalidUser || (moment(pu.startDate).isBefore(moment(this.item.startDate)) || moment(pu.endDate).isAfter(moment(this.item.endDate)) || moment(pu.endDate).isBefore(moment(pu.startDate)));
      })
      if(!invalidUser){
        this.onSave.emit(this.item);
      }
    }

  }
}
