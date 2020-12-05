import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Project } from '../../../models/project.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList} from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { ErrorService } from '../../../../../services/error/error.service';
import { User } from '../../../models/user.model';
import { ProjectUser } from '../../../models/project-user.model';
import { isNgTemplate } from '@angular/compiler';
import * as moment from 'moment';
@Component({
  selector: 'admin-project-assignment',
  templateUrl: './project-assignment.component.html',
  styleUrls: ['./project-assignment.component.less']
})
export class ProjectAssignmentComponent implements OnInit, OnDestroy, OnChanges {


  @Input() item: Project;

  @Output() onSave = new EventEmitter<Project>();
  minDate: any;
  maxDate: any;
  users: User[] = [];

  getUsersSubscription: Subscription;
  getUsersErrorSubscription: Subscription;

  assigned: ProjectUser[] = [];

  notAssigned: ProjectUser[] = [

  ];

  constructor(private service: AdminService, private errorService: ErrorService) { }

  ngOnInit() {
    this.getUsersSubscription = this.service.getUsers$.subscribe(
      items=>{
        //Lo hago para que al serializar a la hora de guardar no me salte error de referencia circular
        items.forEach(element => {
          element.projectUser=null;
          this.users.push(element);
        });
        this.fillLists();
      }
    );
    this.getUsersErrorSubscription = this.service.getUsersError$.subscribe(
      err=>{
        this.errorService.manageError(err);

      }
    );


    this.service.getUsers();


  }

  ngOnChanges(changes:SimpleChanges): void {
    if(changes && changes.item && this.users){
      this.minDate = this.item.startDate;
      this.maxDate = this.item.endDate;
      this.fillLists();

    }
  }
  fillLists(){
    this.assigned = [];
    this.notAssigned = [];
    this.assigned = this.item.projectUser.filter(pu=>pu.idProject == this.item.idProject);
    this.users.forEach(u => {

      if(this.assigned.find(pu=>pu.idUser==u.idUser)==null)
        this.notAssigned.push(
          new ProjectUser({
            idProject: this.item.idProject,
            idProjectUser: 0,
            idUser: u.idUser,
            user: u,
            startDate: this.item.startDate,
            endDate: this.item.endDate
          })
        );
    });
  }
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);

      //Añade a asignados
      if(event.container.id == "cdk-drop-list-1"){
        this.item.projectUser = event.container.data;
      }
      else
        this.item.projectUser = event.previousContainer.data;

    }

  }
  ngOnDestroy(){
    if(this.getUsersSubscription)this.getUsersSubscription.unsubscribe();
    if(this.getUsersErrorSubscription)this.getUsersErrorSubscription.unsubscribe();

  }
}
