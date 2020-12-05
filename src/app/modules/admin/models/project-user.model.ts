import * as moment from 'moment';
import { User } from './user.model';
import { Project } from './project.model';
export class ProjectUser{
  idProjectUser: number;
  idUser: number;
  user: User;
  project: Project
  idProject: number;
  startDate: moment.Moment;
  endDate: moment.Moment;
  constructor(item:any){
    if(!!item) Object.assign(this, item);
    this.startDate = (item && item.startDate)? moment(item.startDate):null;
    this.endDate = (item && item.endDate)? moment(item.endDate):null;
    this.project = new Project(this.project);
    this.user = new User(this.user);
  }
}
