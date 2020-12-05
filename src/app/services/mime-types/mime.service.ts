import { Injectable } from '@angular/core';
import { DBMimeTypes } from './db'

@Injectable()
export class MimeService  {
    constructor() {
        
    }
    extension(mimetype:string):MimeType{
        const mime = DBMimeTypes.db[mimetype];
        if(mime)
            return new MimeType(mime.source,mime.compressible, mime.extensions );
        else
            return null;
    }

}
export class MimeType{
    public source: string;
    public compressible: boolean;
    public extensions: string[];
    constructor(_source:string, _compressible:boolean, extensions:string[]){
        this.compressible = _compressible;
        this.extensions = extensions;
        this.source=_source;
    }
}

