import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';

import { NgModule, Injectable, NgZone } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject, interval, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AUTH_URL, API_USER_URL } from '../modules/shared/constants/constants';
import { User } from './user.class';
import { ApiService } from '../services/api/api.service';
import { CacheService } from '../services/cache/cache.service';
import { environment } from '../../environments/environment';

export const LUBARA_TOKEN: string = 'lubara-token';

@Injectable()
export class AuthService implements CanActivate {

    private tokenExpired = new Subject<boolean>();
    public tokenExpired$ = this.tokenExpired.asObservable();

    private sessionIntervalDuration = new Subject<moment.Moment>();
    public changeSessionIntervalDuration$ = this.sessionIntervalDuration.asObservable();

    private sessionDuration = new BehaviorSubject<any>(null);
    public changeSessionDuration$ = this.sessionDuration.asObservable();

    private changeUserSource = new Subject<User>();
    public changeUser$ = this.changeUserSource.asObservable();

    private logged = new Subject<boolean>();
    public logged$ = this.logged.asObservable();

    private errorLogin = new Subject<number>();
    public errorLogin$ = this.errorLogin.asObservable();

    confirmUser$ = new Subject<any>();
    confirmUserError$ = new Subject<any>();

    public user: User = new User();
    private _timeout?: any = null;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private ngZone: NgZone,
        private cacheService: CacheService
    ) {
        Date.prototype.toJSON = function () { return moment(this).format(); }
        this.setUser();
        this.checkSessionDuration();
    }

    setUser(): void {
        this.user = this.getToken() ? new User(this.decodeToken()) : null;
        if (this.user != null)
            this.apiService.getBlob(`${API_USER_URL}/pic`,{mail:this.user.mail}).subscribe(
                blob => {
                    let reader = new FileReader();
                    reader.onerror = () => {
                        this.changeUserSource.next(this.user);
                    }
                    reader.onload = () => {
                        this.user.picture = reader.result;
                        this.changeUserSource.next(this.user);
                    }
                    reader.readAsDataURL(blob);
                },
                err=>{
                    this.user.picture = null;
                    this.changeUserSource.next(this.user);
                    console.log('Método de obtener foto de usuario no implementado o fallido')
                }
            );
    }

    checkSessionDuration(): void {
        if (!this.getToken() || this.isTokenExpired()) return clearTimeout(this._timeout);
        this.ngZone.runOutsideAngular(() => {
            interval(1000).subscribe(
                () => {
                    if (this.getToken() && !this.isTokenExpired()) {
                        let duration: any = moment.duration(this.getTokenExpirationDate().getTime() - (new Date()).getTime(), "seconds");
                        this.sessionIntervalDuration.next(moment.utc(duration.asSeconds()));
                        //.format('mm[m]:ss[s]')
                   }
                    else{
                        this.tokenExpired.next(true);
                    }
                }
            )
        });
        this.sessionDuration.next(moment(this.getTokenExpirationDate()).format('HH:mm'));
        this._timeout = setTimeout(() => {
            this.checkSessionDuration()
        }, 60000);
    }

    logout(): void {
        localStorage.removeItem(LUBARA_TOKEN);
        this.router.navigate(['/login']);
    }

    bearerToken(): string {
        return JSON.parse(this.getToken()).token.token;
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (this.isLoggedIn()) {
            return await true;
        } else {
            this.router.navigate(['/login']);
            return await false;
        }
    }
    async canActivateAdmin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
      if (this.user.role.includes('ADMIN')) {
          return await true;
      } else {
          this.router.navigate(['/login']);
          return await false;
      }
  }

    getToken(): string {
      var token: any;
      if(localStorage.getItem(LUBARA_TOKEN))
        token = JSON.parse(localStorage.getItem(LUBARA_TOKEN)).token.token
      return token || "";
    }

    decodeToken(token?: any): any {

        return jwt_decode(token || this.getToken());
    }

    isTokenExpired(token?: string): boolean {
        token = token || this.getToken();
        if (!token) return true;

        const date = this.getTokenExpirationDate(token);
        if (date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

    getTokenExpirationDate(token?: string): Date {
        //let tok: any = JSON.parse(token || localStorage.getItem(LUBARA_TOKEN));
        let tok: any = this.decodeToken(token)
        if (tok.exp === undefined) return null;
        return new Date(tok.exp * 1000);
    }

    isLoggedIn(): boolean {
        return !this.getToken()
            ? false
            : !this.isTokenExpired();
    }
    isLoggedInLogicalAccess(): boolean {
        return !!this.user.logical_access;
    }
    public storageToken(token: any): void {
        const d = new Date(0);
        d.setUTCSeconds(this.decodeToken(token.token).exp);

        token.exp = d;// moment(new Date()).add(this.decodeToken(token.token).exp, 'seconds').toDate();
        let _token = JSON.stringify({ token: token });
        localStorage.setItem(LUBARA_TOKEN, JSON.stringify({ username: this.decodeToken(token.token).sub, token: token }));
    }
    private onLoggedComplete(res: any) {
        //let token: any = {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyYXVsLmhlcm5hbnoiLCJlbWFpbCI6InJhdWwuaGVybmFuekBsdWJhcmEuZXMiLCJqdGkiOiJjYmFmMmUyZi1iMTdjLTQwMjYtOTM1Ny05MDI4ZTRiYjUzOWEiLCJyb2xlIjoiVVNFUiIsIm1lbnUiOiIyLDMsNSIsImV4cCI6MTU3OTk1MDI4NywiaXNzIjoibHViYXJhLmFudG9uaW9lc2NyaWJhbm8iLCJhdWQiOiJsdWJhcmEuYW50b25pb2VzY3JpYmFubyJ9.fIz3KhA6bOM1Fw_4wPBDbj6h5fanYm6eouH9ZCRwL6c"};
        let token: any = res;
        this.storageToken(token);
        this.setUser();
        this.checkSessionDuration();
        this.logged.next(true);
    }

    public login(credentials?: any) {
      this.apiService.postNoAuth(`${AUTH_URL}logon`, credentials).subscribe(
          res => {
            console.log(res)
              this.onLoggedComplete(res);
          },
          err => {
              this.errorLogin.next(err.status);
          }
      )
    }
    public confirm(credentials?: any) {
      this.apiService.postNoAuth(`${API_USER_URL}/confirm`, credentials).subscribe(
        res => {
            this.confirmUser$.next(credentials.username);
        },
        err => {
            this.confirmUserError$.next(err);
        }
    )
    }
    public getThumbnail(user_id: string): Observable<any> {
        let thumbnailSource = new BehaviorSubject<any>(null);
        let thumbnail$ = thumbnailSource.asObservable();
        let thumbnails = <[any]>this.cacheService.getLocal('thumbnails');
        const thumbnail = (thumbnails)?thumbnails.find(th=>th['key']==user_id):null;
        if(thumbnail)
            thumbnailSource.next(thumbnail['value']);
        else{
            this.apiService.getBlob(`${API_USER_URL}thumbnail/${user_id}`).subscribe(
                blob => {
                    let reader = new FileReader();
                    reader.onerror = () => {
                        thumbnailSource.next(null);
                    }
                    reader.onload = () => {
                        if(thumbnails)
                            thumbnails.push({key:user_id, value:reader.result})
                        else
                            thumbnails = [{key:user_id, value:reader.result}];
                        this.cacheService.setLocal('thumbnails',thumbnails)
                        thumbnailSource.next(reader.result);
                    }
                    reader.readAsDataURL(blob);
                },
                error =>{
                    console.log(error)
                }
         );
        }
        return thumbnail$;
    }
    refreshToken() {
        this.apiService.post(`${AUTH_URL}refresh`).subscribe(
            res => {
                this.storageToken(res);
                this.checkSessionDuration();
            }
        )
    }
    testDecodeToken(){
      //var token = this.getToken();
      //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvc2NhciIsImVtYWlsIjoib3NjYXJAbHViYXJhLmVzIiwianRpIjoiOTZlOTNiNzYtMDI4Yi00OTgwLWE5ZWYtOTAxNzc2MjkzNjk5Iiwicm9sZSI6WyJBRE1JTiIsIlVTRVIiXSwibWVudSI6IjEsMS4xLDEuMiwxLjMsMiwyLjEsMyw1IiwiZXhwIjoxNTc5OTUxMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjYzOTM5LyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NjM5MzkvIn0.gnL-n0rf9tK-4CBJCggB1A363fzUDXzc7QVsxmrVcV8"
      var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyYXVsLmhlcm5hbnoiLCJlbWFpbCI6InJhdWwuaGVybmFuekBsdWJhcmEuZXMiLCJqdGkiOiJjYmFmMmUyZi1iMTdjLTQwMjYtOTM1Ny05MDI4ZTRiYjUzOWEiLCJyb2xlIjoiVVNFUiIsIm1lbnUiOiIyLDMsNSIsImV4cCI6MTU3OTk1MDI4NywiaXNzIjoibHViYXJhLmFudG9uaW9lc2NyaWJhbm8iLCJhdWQiOiJsdWJhcmEuYW50b25pb2VzY3JpYmFubyJ9.fIz3KhA6bOM1Fw_4wPBDbj6h5fanYm6eouH9ZCRwL6c";
      var decoded = jwt_decode(token);
      console.log(decoded);
    }
}
