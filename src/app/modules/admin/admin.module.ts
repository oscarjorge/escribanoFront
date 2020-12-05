import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRouting } from './admin.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { ProposalUserComponent } from './components/proposal-user/proposal-user.component';
import { ProjectComponent } from './components/project/project.component';
import { ProjectGridComponent } from './components/project/project-grid/project-grid.component';
import { ProjectFormComponent } from './components/project/project-form/project-form.component';
import { UserComponent } from './components/user/user.component';
import { UserGridComponent } from './components/user/user-grid/user-grid.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { ProjectAssignmentComponent } from './components/project/project-assignment/project-assignment.component';
import { DragDropModule  } from '@angular/cdk/drag-drop'

@NgModule({
  declarations: [ProposalUserComponent, ProjectComponent, ProjectGridComponent, ProjectFormComponent, UserComponent, UserGridComponent, UserFormComponent, ProjectAssignmentComponent],
  imports: [
    CommonModule,
    AdminRouting,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedComponentsModule,
    DragDropModule
  ]
})
export class AdminModule { }
