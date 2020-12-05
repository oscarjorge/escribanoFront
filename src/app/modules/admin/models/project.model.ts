import * as moment from 'moment';
import { User } from './user.model';
import { CheckInModel, CheckInCalendar } from './checkin.model';
import { Photo } from './photo.model';
import { ProjectUser } from './project-user.model';
export class Project{
  idProject: number;
  description: string;
  projectNumber: string;
  startDate: Date;
  endDate: Date;
  projectManager: string;
  colorPrimary: string;
  colorSecondary: string;
  projectUser: ProjectUser[]=[];
  photo: Photo[]=[];
  checkInModel: CheckInModel[]=[];
  checkInCalendar: CheckInCalendar[]=[];
  isImputable:boolean = true;
  selected: boolean;
  overDate: boolean;
  constructor(item:any){
    if(!!item) Object.assign(this, item);
    this.startDate = (item && item.startDate)? item.startDate:null;
    this.endDate = (item && item.endDate)? item.endDate:null;
    this.overDate = moment(this.endDate).isBefore(moment(new Date()));
  }
}
export enum EPROJECT_TYPE{
  "LUNCH" = "Comida",
  "ABSENCE" = "Ausencia",
}
