export class RoleUser{
  idRoleUser: number;
  idUser: number;
  idRole: number;
  constructor(item:any){
    if(!!item) Object.assign(this, item);
  }
}
