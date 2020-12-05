import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms'
import { Credentials } from '../../models/credentials';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../../services/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { RoutingState } from '../../../../services/routing/routing-state.service';
import { MatSnackBar } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { ErrorService } from '../../../../services/error/error.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'login-container opaque full-height colorful'}
})
export class LoginComponent implements OnInit, OnDestroy {
  show_password:boolean=false;
  private credentials: Credentials = new Credentials();
  private loggedRef: Subscription = null;
  confirmUserSubscription: Subscription;
  confirmUserErrorSubscription: Subscription;
  logging: boolean = false;
  loginForm: FormGroup;
  confirm: boolean;
  passTemp: string;
  constructor(
    public api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private routingState: RoutingState,
    private snackBar:   MatSnackBar,
    private errorService: ErrorService
  ) {
    this.authService.errorLogin$.subscribe(
      status=>{
        let message: string;

        if(status!=null){
          switch(status){
            case 0:
              message="";
              break;
            case 401:
              message="Las credenciales proporcionadas no son correctas";
              break;
            case 500:
              message="Se ha producido un error en el servidor. Póngase en contacto con el administrador del sistema";
              break;
            default:
              message="Se ha producido un error indeterminado";
              break;
          }
        }
        let ref = this.snackBar.open(message, "Cerrar");
        this.logging = false;
      }
    )
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if(params && params.has('pass') && params.has('user')){
        this.credentials.password = params.get("pass");
        this.credentials.username = params.get("user");
        this.credentials.mail = params.get("mail");
        this.confirm = true;
        this.loginForm = new FormGroup({
          username: new FormControl(this.credentials.username, Validators.required),
          password: new FormControl({value:this.credentials.password, disabled: this.confirm}, Validators.required),
          newpassword: new FormControl(this.credentials.newpassword, Validators.required)
        });
      }
      else{
        this.loginForm = new FormGroup({
          username: new FormControl({value:this.credentials.username, disabled: this.confirm}, Validators.required),
          password: new FormControl({value:this.credentials.password, disabled: this.confirm}, Validators.required)
        });
      }

    })

    this.loggedRef = this.authService.logged$.subscribe(
      logged=>{
        if(logged){
          this.logging = false;
          const a = this.routingState.getPreviousUrl();
          if(!a.includes('confirm'))
            this.router.navigateByUrl(this.routingState.getPreviousUrl());
          else
          this.router.navigateByUrl('/dashboard');
        }
      }
    );
    this.confirmUserSubscription = this.authService.confirmUser$.subscribe(
      res=>{
        this.logging = false;
        let snackBarRef = this.snackBar.open(
          `El proceso de confirmación ha finalizado. Ya puede entrar en la aplicación con la contraseña introducida y el nombre de usuario '${res}'`,
         "Login", { duration: 0, verticalPosition: 'top' });
        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(['/login']);
        });
      }
    )
    this.confirmUserErrorSubscription = this.authService.confirmUserError$.subscribe(
      res=>{
        this.errorService.manageError(res);
        this.logging = false;
      }
    )
  }
  login(){

    if(!this.loginForm.valid)
      return;
    else{
      this.credentials.username = this.loginForm.get('username').value;
      this.credentials.password = this.loginForm.get('password').value;
      this.credentials.newpassword = (this.loginForm.get('newpassword'))? this.loginForm.get('newpassword').value: null;
    }
    this.logging = true;
    if(!this.confirm)
      this.authService.login(this.credentials);
    else
      this.authService.confirm(this.credentials);
  }
  logout(): void {
    localStorage.removeItem('lubara-token');
    this.router.navigate(['/login']);
}
  onKeyPress(e: KeyboardEvent){
    if(e.key === '.')
      e.preventDefault();
  }
  ngOnDestroy(){
    this.loggedRef.unsubscribe();
    this.logging = false;
    if(this.confirmUserSubscription)this.confirmUserSubscription.unsubscribe();
    if(this.confirmUserErrorSubscription)this.confirmUserErrorSubscription.unsubscribe();
  }
}
