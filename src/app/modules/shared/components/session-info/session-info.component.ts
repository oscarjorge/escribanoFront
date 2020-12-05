import { Component, OnInit, NgZone, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.less']
})
export class SessionInfoComponent implements OnInit, OnDestroy {
  @ViewChild('interval', {static:false}) interval: ElementRef;
  @ViewChild('hourglass', {static:false}) hourglass: ElementRef;

  alertMinute: number = environment.sessionOutAlertMinutes;
  alertShow: boolean = false;
  expired: boolean;

  changeSessionIntervalDurationSubscription: Subscription;
  tokenExpiredSubscription: Subscription;
  constructor(
    public authService: AuthService,
    private ngZone: NgZone,
    private renderer: Renderer2,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {

    this.expired = this.authService.isTokenExpired();
    if (!this.expired)
      this.changeSessionIntervalDurationSubscription = this.authService.changeSessionIntervalDuration$.subscribe(
        interval => {
          this.expired = this.authService.isTokenExpired();
          if (!this.expired) {
            //este método corre fuera de la zona angular. Cualquier cambio en el DOM se ha de hacer con renderer puesto que no es sensible a la deteccion de cambios de angular
            let minutes = interval.minutes();
            let duration = interval.format('mm[m]:ss[s]');
            this.renderer.setProperty(this.interval.nativeElement, 'innerHTML', duration);

            if (minutes < this.alertMinute && !this.alertShow) {
              this.renderer.addClass(this.hourglass.nativeElement, 'alerted');
              this.ngZone.run(() => {
                let snackBarRef = this.snackBar.open(
                  "Faltan 5 minutos para que expire la sesión. Pulse aquí para refrescarla",
                 "Refrescar", { duration: 10000, verticalPosition: 'bottom' });
                snackBarRef.onAction().subscribe(() => {
                  this.refreshToken();
                });
              });
              this.alertShow = true;
            }
            if (minutes >= this.alertMinute)
              this.renderer.removeClass(this.hourglass.nativeElement, 'alerted');
          }
          else
            this.setSessionExpired();
        }

      );
    else {
      this.setSessionExpired();
    }
    this.tokenExpiredSubscription = this.authService.tokenExpired$.subscribe(
      res=>{
        this.ngZone.run(() => {
          this.expired = true;
          this.setSessionExpired();
          this.tokenExpiredSubscription.unsubscribe();
        });
      }
    );
  }

  private setSessionExpired() {
    this.renderer.addClass(this.hourglass.nativeElement, 'expired');
  }
  refreshToken() {
    if (!this.expired)
      this.authService.refreshToken();
    else
      this.router.navigate(['/login']);
  }
  ngOnDestroy() {
    if (this.changeSessionIntervalDurationSubscription) this.changeSessionIntervalDurationSubscription.unsubscribe();
    if (this.tokenExpiredSubscription) this.tokenExpiredSubscription.unsubscribe();
  }
}

