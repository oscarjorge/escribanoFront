import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BaseService } from './base.service';
import { CacheService } from '../cache/cache.service';
import { MimeService } from '../mime-types/mime.service';
import { CustomHttpResponse } from './custom-http-response';

@Injectable()
export class ApiService extends BaseService {
    constructor(public http: HttpClient, public mimeService:MimeService) {
        super(http, mimeService);
    }
    getBlob(url: string, params?: any): Observable<Blob> {
        return super.getBlob(url, params);
    }
    getBlobResponseInfo(url: string, params?: any): Observable<CustomHttpResponse<Blob>> {
        return super.getBlobResponseInfo(url, params);
    }
    postBlob(url: string, params?: any): Observable<CustomHttpResponse<Blob>>{
        return super.postBlob(url, params);
    }
    get<T>(url: string, params?: any, force?: boolean): Observable<T> {
        return super.get<T>(url, params, force);
    }
    getNoAuth<T>(url: string, params?: any, force?: boolean): Observable<T> {
        return super.getNoAuth<T>(url, params, force);
    }
    put(url: string, params?: any): Observable<any> {
        return super.put(url, params);
    }
    post(url: string, params?: any): Subject<any> {
        return super.post(url, params);
    }
    postNoAuth(url: string, params?: any): Subject<any> {
        return super.postNoAuth(url, params);
    }
    delete(url:string): Observable<any>{
        return super.delete(url);
    }

}
