import { Injectable } from '@angular/core';
//import { HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
//import { Http, Response } from '@angular/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MimeService } from '../mime-types/mime.service';
import { CustomHttpResponse } from './custom-http-response';

@Injectable()
export class BaseService {

    constructor(public http: HttpClient, public mimeService: MimeService) {
    }

    private _headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8').set('Cache-Control', 'no-cache').set('Pragma', 'no-cache');

    private createParamsFrom(params?: any): HttpParams {
        let _params: HttpParams = new HttpParams();
        Object.keys(params || {})
            .forEach(k => _params = _params.set(k, params[k]));
        return _params;
    }

    private getErrorByStatus(e: HttpErrorResponse): string {
        switch (e.status) {
            case 404:
            case 401:
                return !!e.error ? JSON.parse(e.error).message : e.message;
            case 500:
                return JSON.parse(e.error).message;
            default:
                return "Ha ocurrido un error desconocido";
        }
    }
    protected getBlobResponseInfo(url: string, params?: any): Observable<CustomHttpResponse<Blob>> {
        let _headers: HttpHeaders = null;
        return this.http.get(url, {
            headers: _headers,
            observe: "response",
            params: this.createParamsFrom(params),
            reportProgress: true,
            responseType: "blob",
            withCredentials: true
        }).pipe(
            map(res => {
                //"attachment; filename=1056253.zip; filename*=UTF-8''1056253.zip"
                const content_disposition = res.headers.get('Content-Disposition');

                let filename:string ='noname';
                if(content_disposition)
                    content_disposition.split(';').forEach(s=>{
                        if(s.indexOf('filename')>0 && s.indexOf('filename*')==-1){
                            filename = s.split('=')[1];
                            return;
                        }
                    })
                else
                    console.warn('Se ha llamado al método getBlobResponseInfo pero la cabecera de la respuesta no contiene Content-Disposition.')
                const content_type = res.headers.get('Content-Type');
                const mime = this.mimeService.extension(content_type);
                if (mime)
                    res['extension'] = mime.extensions[0];

                const ret = new CustomHttpResponse(filename,mime.extensions[0],res)
                return ret;
            })
        );
    }
    protected getBlob(url: string, params?: any): Observable<Blob> {
        let _headers: HttpHeaders = null;
        return this.http.get(url, {
            headers: _headers,
            params: this.createParamsFrom(params),
            reportProgress: true,
            responseType: "blob",
            withCredentials: true
        });
    }
    protected postBlob(url: string, params?: any) : Observable<CustomHttpResponse<Blob>>{
        let _headers: null,
            _options: any = {
                headers: _headers,
                params: this.createParamsFrom(params),
                reportProgress: true,
                responseType: "blob",
                withCredentials: true,
                observe: "response",
            };
        return this.http.post(url, params, { headers: _headers,
            params: this.createParamsFrom(params),
            reportProgress: true,
            responseType: "blob",
            withCredentials: true,
            observe: "response",}).pipe(
            map(res => {

                const content_disposition = res.headers.get('Content-Disposition');
                let filename:string ='';
                content_disposition.split(';').forEach(s=>{
                     if(s.indexOf('filename')>0 && s.indexOf('filename*')==-1){
                        filename = s.split('=')[1];
                        return;
                     }
                })
                const content_type = res.headers.get('Content-Type');
                const mime = this.mimeService.extension(content_type);
                if (mime)
                    res['extension'] = mime.extensions[0];

                const ret = new CustomHttpResponse(filename,mime.extensions[0],res)
                return ret;

            })
        );;
    }
    protected get<T>(url: string, params?: any, force?: boolean): Observable<any> {

        const result = new Subject<T>();
        let _headers: HttpHeaders = null,
            _options: any = {
                headers: _headers,
                params: this.createParamsFrom(params),
                reportProgress: true,
                //responseType: "json",
                withCredentials: true
            };
        return this.http.get(url, _options);
    }
    protected getNoAuth<T>(url: string, params?: any, force?: boolean): Observable<any> {
        const result = new Subject<T>();
        let _headers: HttpHeaders = null,
            _options: any = {
                headers: _headers,
                params: this.createParamsFrom(params),
            };
        return this.http.get(url, _options);
    }
   protected put(url: string, params?: any): Observable<any> {
        let _headers: null,/*HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8'),*/
            _options: any = {
                headers: _headers,
                reportProgress: true,
                //responseType: "json",
                withCredentials: true
            };
        const result = new Subject<any>();
        let a = JSON.stringify(params);
        //params = {"customer_id":19890,"process_activity":"onboarding","qualitative":{"case_by_case":{"reason":"None","text":"","risk":"HIGH"},"sensitive_country_exposure":false},"relationships":[{"legal_entity_type":"nonOperatingCompany","relationship_type":"accountHolder","pep_exposure":false,"pep_level":0,"adverse_fcc_news":false,"geography":{"division":"IWM","has_address_in_crimea":false,"booking_location":["MX"],"residential_countries":[],"has_material_crimea":false,"country_of_birth":"","main_wealth_source_countries":[],"nationality_countries":[],"sanctioned_countries":null,"main_fund_source_countries":[],"country_of_principal_place_of_business":"","country_of_incorporation":"AF","main_operation_countries":[],"has_incorporation_or_principle_in_crimea":false},"industry":{"ids":[]},"products_and_service":{"has_concentration_or_special_use_account":false,"involves_cross_border_trade_or_export_finance":false},"transaction":{"initially_funded_by_third_party":false},"channel":{"has_relationships_with_multiple_business_lines":false,"channel_sub_type_id":0,"business_relationship_non_face_to_face":false},"client_type":{"is_newly_established_entity":false,"has_complex_ownership_structure":false,"has_ability_to_issue_bearer_shares":false,"sub_type_id":1},"is_internal_sar":false,"is_external_sar":false,"apac_walk_in_client":false,"apacntc_account":false,"apacus_indicia":false},{"legal_entity_type":"NPOfNonOperatingCompany","relationship_type":"beneficialOwner","pep_exposure":false,"pep_level":null,"adverse_fcc_news":false,"geography":{"division":"IWM","has_address_in_crimea":false,"booking_location":[],"residential_countries":["AF"],"has_material_crimea":false,"country_of_birth":"AF","main_wealth_source_countries":["AF"],"has_nexus_to_sensitive":false,"nationality_countries":["AL"],"sanctioned_countries":null,"main_fund_source_countries":["AL"],"country_of_principal_place_of_business":"","country_of_incorporation":"","main_operation_countries":[],"has_incorporation_or_principle_in_crimea":false},"industry":{"ids":[2]},"products_and_service":{},"transaction":{},"channel":{"channel_sub_type_id":0},"client_type":{},"is_internal_sar":false,"is_external_sar":false,"apac_walk_in_client":false,"apacntc_account":false,"apacus_indicia":false}]};
        return this.http.put(url, params, _options);
        // .subscribe(d => {
       //     result.next(d);
        //     this.ajaxComplete();
        // });
        // return result;
    }
    protected post(url: string, params?: any): Subject<any> {
        let _headers: null,/*HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8'),*/
            _options: any = {
                headers: _headers,
                reportProgress: true,
                //responseType: "json",
                withCredentials: true
            };
        const result = new Subject<any>();
        let a = JSON.stringify(params);
        //params = {"customer_id":19890,"process_activity":"onboarding","qualitative":{"case_by_case":{"reason":"None","text":"","risk":"HIGH"},"sensitive_country_exposure":false},"relationships":[{"legal_entity_type":"nonOperatingCompany","relationship_type":"accountHolder","pep_exposure":false,"pep_level":0,"adverse_fcc_news":false,"geography":{"division":"IWM","has_address_in_crimea":false,"booking_location":["MX"],"residential_countries":[],"has_material_crimea":false,"country_of_birth":"","main_wealth_source_countries":[],"nationality_countries":[],"sanctioned_countries":null,"main_fund_source_countries":[],"country_of_principal_place_of_business":"","country_of_incorporation":"AF","main_operation_countries":[],"has_incorporation_or_principle_in_crimea":false},"industry":{"ids":[]},"products_and_service":{"has_concentration_or_special_use_account":false,"involves_cross_border_trade_or_export_finance":false},"transaction":{"initially_funded_by_third_party":false},"channel":{"has_relationships_with_multiple_business_lines":false,"channel_sub_type_id":0,"business_relationship_non_face_to_face":false},"client_type":{"is_newly_established_entity":false,"has_complex_ownership_structure":false,"has_ability_to_issue_bearer_shares":false,"sub_type_id":1},"is_internal_sar":false,"is_external_sar":false,"apac_walk_in_client":false,"apacntc_account":false,"apacus_indicia":false},{"legal_entity_type":"NPOfNonOperatingCompany","relationship_type":"beneficialOwner","pep_exposure":false,"pep_level":null,"adverse_fcc_news":false,"geography":{"division":"IWM","has_address_in_crimea":false,"booking_location":[],"residential_countries":["AF"],"has_material_crimea":false,"country_of_birth":"AF","main_wealth_source_countries":["AF"],"has_nexus_to_sensitive":false,"nationality_countries":["AL"],"sanctioned_countries":null,"main_fund_source_countries":["AL"],"country_of_principal_place_of_business":"","country_of_incorporation":"","main_operation_countries":[],"has_incorporation_or_principle_in_crimea":false},"industry":{"ids":[2]},"products_and_service":{},"transaction":{},"channel":{"channel_sub_type_id":0},"client_type":{},"is_internal_sar":false,"is_external_sar":false,"apac_walk_in_client":false,"apacntc_account":false,"apacus_indicia":false}]};
        this.http.post(url, params, _options).subscribe(
            d => {
                result.next(d);
            },
            err => {
                result.error(err);
            });
        return result;
    }
    protected postNoAuth(url: string, params?: any): Subject<any> {
        let _headers: null,
            _options: any = {
                headers: _headers,
            };
        const result = new Subject<any>();
        let a = JSON.stringify(params);
        this.http.post(url, params, _options).subscribe(
            d => {
                result.next(d);
            },
            err => {
                result.error(err);
            }
        );
        return result;
    }
    protected delete(url: string): Observable<any> {
        let _headers: null,
            _options: any = {
                headers: _headers,
                withCredentials: true
            };
        const result = new Subject<any>();

        return this.http.delete(url, _options);
    }
}
