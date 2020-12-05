import { HttpResponse,HttpHeaders } from "@angular/common/http";

export class CustomHttpResponse<T> extends HttpResponse<T>{
    filename:string;
    extension:string;
    constructor(_filename:string, _extension:string,init?: {
        body?: T | null;
        headers?: HttpHeaders;
        status?: number;
        statusText?: string;
        url?: string;
    }){
        super(init);
        this.filename = _filename;
        this.extension = _extension;
    }
}

