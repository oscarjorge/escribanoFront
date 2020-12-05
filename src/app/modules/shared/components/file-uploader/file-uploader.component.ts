import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';

import { fadeInOut } from '../../animations/animations';
import { AuthService } from '../../../../auth/auth.service';
@Component({
  selector: 'custom-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.less'],
  animations: [
    fadeInOut
  ]
})
export class FileUploaderComponent implements OnInit, OnChanges {
  @Input('url') url: string;
  @Input() multiple: boolean;
  @Output() onUploaded = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  constructor(private authService: AuthService) {

  }
  ngOnChanges(e) {
    if (e.url && this.uploader) {
      this.uploader.options.url = e.url.currentValue;
    }
  }
  ngOnInit() {
    this.uploader = new FileUploader(
      {
        url: `${this.url}`,
        authToken: `Bearer ${this.authService.bearerToken()}`,
        disableMultipart: false
      });
    this.uploader.onCompleteItem = (item: FileItem, response: any, status: any, headers: any) => {
      if (item.isSuccess)
        this.onUploaded.emit(response);
      if (item.isError)
        this.onError.emit(response);
    };
  }
  public fileOverBase(e: any): void {

    this.hasBaseDropZoneOver = e;
  }
  public onFileDrop(e: any) {

  }

  // public fileOverAnother(e:any):void {
  //   this.hasAnotherDropZoneOver = e;
  // }
}
