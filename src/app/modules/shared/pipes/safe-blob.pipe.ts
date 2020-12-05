import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'safeBlob'})
export class SafeBlobPipe {
  constructor(private sanitizer:DomSanitizer){}

  transform(blob) {
    return this.sanitizer.bypassSecurityTrustUrl(blob);
  }
}
