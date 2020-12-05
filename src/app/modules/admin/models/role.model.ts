export class Role{
  idRole: number;
  description: string;
  menu: string[];
  constructor(item:any){
    if(!!item) Object.assign(this, item);
    if(item && item.menu){
      this.menu = item.menu.split(",")
    }
  }
}
