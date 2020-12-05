import { Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';
import { Favorite } from '../menu/menu-data';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor(
        public snackBar: MatSnackBar,
        private router: Router
    ) { }

    public manageError(err) {
        let refSnackbar:any;
        let message: string;
        if (err != null && err.status != null) {
            switch (err.status) {
                case 204:
                    if (err.error)
                        message = `Ha ocurrido un error (204) ${err.error}`;
                    else
                        message = `Ha ocurrido un error (204)`;
                    this.snackBar.open(message, `Cerrar`, { duration: 0 });
                    break;
                case 400:
                    if (err.error)
                        message = `Ha ocurrido un error (400) ${err.error}`;
                    else
                        message = `Ha ocurrido un error (400)`;
                    this.snackBar.open(message, `Cerrar`, { duration: 0 });
                    break;
                case 401:
                    message =`Ha ocurrido un error (401). Puede que su sesión se haya agotado. Ingrese de nuevo sus credenciales`;
                    refSnackbar = this.snackBar.open(message, `Login`, { duration: 0 });
                    refSnackbar.onAction().subscribe(() => {
                        this.router.navigateByUrl('login')
                    });
                    break;
                case 403:
                    message =`Ha ocurrido un error (403). No está autorizado para acceder a este recurso.`;
                    this.snackBar.open(message, `Cerrar`, { duration: 0 });
                    break;
                case 404:
                    message = `No se encuentran datos para esta petición`;
                    this.snackBar.open(message, `Cerrar`, { duration: 0 });
                    break;
                case 500:
                  if (err.error)
                      message = `Ha ocurrido un error en el servidor. Por favor, contacte con el administrador del sistema. ${err.error}`;
                  else
                    message = `Ha ocurrido un error en el servidor. Por favor, contacte con el administrador del sistema.`;
                    this.snackBar.open(message, `Cerrar`, { duration: 0 });
                    break;
                default:
                    message = `Se ha producido un  error indeterminado`;
                    this.snackBar.open(message);
                    break;
            }
        }
        else {
            message = `Se ha producido un  error indeterminado`;
            this.snackBar.open(message);
        }
    }
    displayMessage(message: string){
      this.snackBar.open(message, `Cerrar`, { duration: 0 });
    }
}


