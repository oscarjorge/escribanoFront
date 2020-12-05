import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRouting } from './app-routing';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedComponentsModule } from './modules/shared/shared-components.module';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import { AuthService } from './auth/auth.service';
import { CacheInterceptor } from './services/cache-interceptor/cache.interceptor';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ApiService } from './services/api/api.service';
import { RoutingState } from './services/routing/routing-state.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { CardExtendedModule } from 'card-extended';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    LayoutModule,
    AppRouting,
    SharedComponentsModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBhWUxz2P3HI7-58iQmKFGyA-xxuHoHGUE',
      libraries: ['places']
    }),
    CardExtendedModule
  ],
  providers: [
    RoutingState,
    AuthGuard,
    AdminGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi:true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
