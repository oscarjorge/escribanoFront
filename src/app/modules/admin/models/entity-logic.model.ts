
export class EntityLogic{
  toRemove: boolean = false;
  toInsert: boolean = false;
  toUpdate: boolean = false;
  constructor(){
    this.toRemove=false;
    this.toInsert=false;
    this.toUpdate=false;
  }
}
