import { CalendarEvent, EventColor, EventAction } from 'calendar-utils';
import { User } from './user.model';
import { Project } from './project.model';
import * as moment from 'moment';
import { EntityLogic } from './entity-logic.model';

export class CheckInCalendar<MetaType = any> extends EntityLogic {
  id?: string | number;
  start: Date;
  end?: Date;
  title: string;
  color?: EventColor;
  actions?: EventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
      beforeStart?: boolean;
      afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: MetaType;
  constructor(item:CheckInModel){
    super()
    this.draggable = true;
    this.resizable= {
      beforeStart: true,
      afterEnd: true
    }
  }
}
export class CheckInModel extends CheckInCalendar implements CalendarEvent{
  idCheckIn: number;
  startDate: Date;
  endDate?: Date;
  timeStart: string;
  timeEnd: string;
  startDateMoment?: moment.Moment;
  endDateMoment?: moment.Moment;
  finished: boolean;
  comments?: string;
  title: string;
  user?: User;
  project?: Project;
  idProject?: number;
  idUser?: number;
  lat?:any;
  lng?:any;
  reliable: boolean;


  //calendar: CheckInCalendar;
  constructor(item:any){
    super(item)
    if(!!item) Object.assign(this, item);
    this.user = item.idUserNavigation;
    this.idUser = item.idUser;
    this.idProject = item.idProject;
    this.project = item.idProjectNavigation;

    this.startDate = new Date(item.startDate);
    this.startDateMoment = moment(item.startDate);
    this.timeStart = this.toTimeFormatDate(item.startDate);
    this.endDate = (item.endDate)?new Date(item.endDate): null;
    this.endDateMoment = (item.endDate)?moment(item.endDate): null;
    this.timeEnd = this.toTimeFormatDate(item.endDate);
    this.id = this.idCheckIn;
    this.start = moment(item.startDate).toDate();
    this.end = moment(item.endDate).toDate();

    this.title = this.title;
    this.color = {
      primary: (this.project)?this.project.colorPrimary: null,
      secondary: (this.project)?this.project.colorSecondary: null,
    }
  }

  private toTimeFormatDate(date: string): string{
    if(!date || typeof(date)!='string') return null;

    if(date.indexOf('T')!=-1){
      let hour = Number(date.substr(date.indexOf('T')+1,2));
      let minutes = date.substr(date.indexOf('T')+4,2);
      let timePeriod = 'AM';
      if(hour>11){
        hour= hour-12;
        timePeriod = 'PM'
      }
      return `${hour}:${minutes} ${timePeriod}`;
    }
    else
      return '';

  }
}
