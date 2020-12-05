import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Project } from '../../models/project.model';
import { ErrorService } from '../../../../services/error/error.service';
import { ProjectUser } from '../../models/project-user.model';
import { ActivatedRoute } from '@angular/router';
import { CardExtendedComponent } from 'card-extended';

@Component({
  selector: 'admin-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less']
})
export class ProjectComponent implements OnInit, OnDestroy {
  @ViewChildren(CardExtendedComponent) cards: QueryList<CardExtendedComponent>;
  getProjectsSubscription: Subscription;
  getProjectsErrorSubscription: Subscription;
  editProjectSubscription: Subscription;
  editProjectErrorSubscription: Subscription;
  addProjectSubscription: Subscription;
  addProjectErrorSubscription: Subscription;
  deleteProjectSubscription: Subscription;
  deleteProjectErrorSubscription: Subscription;

  items: Project[];
  itemEditing: Project;
  loading:boolean;
  idItemDefault: string;
  titleEdit: string = 'Proyecto';
  constructor(private service: AdminService, private errorService: ErrorService, private route: ActivatedRoute,) {
    this.route.paramMap.subscribe(params => {
       if(params.get('id'))
        this.idItemDefault = params.get('id');
    });
  }

  ngOnInit() {
    this.getProjectsSubscription = this.service.getProjects$.subscribe(
      projects=>{
        this.items = projects;
        this.loading = false;
        if(this.idItemDefault){
          const pr = this.items.find(p=>p.idProject.toString() == this.idItemDefault);
          if(pr){
            this.edit(pr);
            this.idItemDefault = null;
          }

        }
      }
    );
    this.getProjectsErrorSubscription = this.service.getProjectsError$.subscribe(
      err=>{
        this.errorService.manageError(err);
        this.loading = false;
      }
    );
    this.editProjectSubscription = this.service.editProjects$.subscribe(
      project=>{

        this.cards.last.close();
        this.titleEdit = 'Proyecto';
      }
    );
    this.editProjectErrorSubscription = this.service.editProjectsError$.subscribe(
      err=>{
        this.errorService.manageError(err);
      }
    );
    this.addProjectSubscription = this.service.addProjects$.subscribe(
      project=>{
        this.items.push(new Project(project));
        this.items = this.items.slice();
        this.cards.last.close();
        this.titleEdit = 'Proyecto';
      }
    );
    this.addProjectErrorSubscription = this.service.addProjectsError$.subscribe(
      err=>{
        this.errorService.manageError(err);
      }
    );
    this.deleteProjectSubscription = this.service.deleteProjects$.subscribe(
      idProject=>{
        this.items = this.items.filter(i=>i.idProject!=idProject);
      }
    );
    this.addProjectErrorSubscription = this.service.addProjectsError$.subscribe(
      err=>{
        this.errorService.manageError(err);
      }
    );

    this.loading = true;
    this.service.getProjects();
  }
  delete(project:Project){
    this.service.deleteProject(project);
  }
  edit(project:Project){
    this.titleEdit = project.description;
    this.cards.last.open();
    this.itemEditing = project;
  }
  add(){
    this.titleEdit = "Nuevo proyecto";
    this.cards.last.open();
    this.itemEditing = new Project(null);

  }
  save(project:Project){
    if(project.idProject)
      this.service.editProject(project);
    else
      this.service.addProject(project);
  }
  ngOnDestroy(){
    if(this.getProjectsSubscription)this.getProjectsSubscription.unsubscribe();
    if(this.getProjectsErrorSubscription)this.getProjectsErrorSubscription.unsubscribe();
    if(this.editProjectSubscription)this.editProjectSubscription.unsubscribe();
    if(this.editProjectErrorSubscription)this.editProjectErrorSubscription.unsubscribe();
    if(this.addProjectSubscription)this.addProjectSubscription.unsubscribe();
    if(this.addProjectErrorSubscription)this.addProjectErrorSubscription.unsubscribe();
    if(this.deleteProjectSubscription)this.deleteProjectSubscription.unsubscribe();
    if(this.deleteProjectErrorSubscription)this.deleteProjectErrorSubscription.unsubscribe();
  }

}
