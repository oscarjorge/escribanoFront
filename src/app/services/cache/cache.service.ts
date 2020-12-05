import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {

  private prefix: string = "Midala";
  constructor() { }

  setSession(key: string, value: any):void{
    key = `${this.prefix}-${key}`;
    this.clearSession(key);
    localStorage.setItem(key, JSON.stringify(value));
  }

  getSession<T>(key: string):T{
    let value = localStorage.getItem(`${this.prefix}-${key}`);
    return <T>JSON.parse(value);
  }
  clearSession(key: string){
    localStorage.removeItem(key);
  }
  setLocal(key: string, value: any):void{
    key = `${this.prefix}-${key}`;
    this.clearLocal(key);
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocal<T>(key: string):T{
    let value = localStorage.getItem(`${this.prefix}-${key}`);
    return <T>JSON.parse(value);
  }
  clearLocal(key: string){
    localStorage.removeItem(key);
  }
  
}

