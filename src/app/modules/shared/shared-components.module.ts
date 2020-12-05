import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ApiService } from '../../services/api/api.service';
import { BaseService } from '../../services/api/base.service';
import { CacheService } from '../../services/cache/cache.service';
import { MimeService } from '../../services/mime-types/mime.service';
import { FavoriteService } from '../../services/favorites/favorite.service';
import { VisibleFilterPipe } from './pipes/visible-filter.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeBlobPipe } from './pipes/safe-blob.pipe';
import { MenuService } from '../../services/menu/menu.service';
import { MenuDataService } from '../../services/menu/menu-data';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { FormsModule } from '@angular/forms';
import { SessionInfoComponent } from './components/session-info/session-info.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CustomCardComponent } from './components/custom-card/custom-card.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ColorPickerModule } from 'ngx-color-picker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CardExtendedModule } from 'card-extended';
@NgModule({
  declarations: [
    VisibleFilterPipe,
    SafeHtmlPipe,
    SafeBlobPipe,
    TopBarComponent,
    SideBarComponent,
    SessionInfoComponent,
    LoadingComponent,
    CustomCardComponent,
    FileUploaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    FileUploadModule,
    ColorPickerModule,
    NgxMaterialTimepickerModule,
    CardExtendedModule
  ],
  providers:[
    ApiService, BaseService, CacheService, MimeService, FavoriteService, MenuService, MenuDataService
  ],
  exports:[
    VisibleFilterPipe,
    SafeHtmlPipe,
    SafeBlobPipe,
    TopBarComponent,
    SideBarComponent,
    LoadingComponent,
    CustomCardComponent,
    FileUploaderComponent,
    ColorPickerModule,
    NgxMaterialTimepickerModule,
    CardExtendedModule
  ]
})
export class SharedComponentsModule { }
