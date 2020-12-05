import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from 'rxjs';
import { LUBARA_TOKEN } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            if (req.withCredentials) {
                const clonedRequest = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${this.bearerToken()}`
                    }
                });
               return next.handle(clonedRequest);
            }
            return next.handle(req);
        
    }
    bearerToken(): string {
        if(this.getToken()!='')
            return JSON.parse(this.getToken()).token.token;
        else
            return null;
    }
    getToken(): string {
        return localStorage.getItem(LUBARA_TOKEN) || "";
    }
}
