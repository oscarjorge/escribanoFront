import * as moment from 'moment';
import { Role } from './role.model';
import { RoleUser } from './role-user.model';
import { ProjectUser } from './project-user.model';
export class User{
  idUser: number;
  nickName: string;
  name: string;
  surname: string;
  mail: string;
  password: string;
  tempPassword: string;
  confirmed: boolean;
  active: boolean;
  tempLapsed: moment.Moment;
  roles: Role[];
  roleUser: RoleUser[];
  projectUser: ProjectUser[];
  pic: any;
  allowForwardConfirmMail: boolean;
  constructor(item:any){
    if(!!item){
      Object.assign(this, item);
      if(item.roleUser){
        this.roles = [];
        item.roleUser.forEach(role=>{
          this.roles.push(new Role(role.idRoleNavigation));
        })
      }
      this.tempLapsed = (item.tempLapsed)? moment(item.tempLapsed):null;
    }


  }
}
