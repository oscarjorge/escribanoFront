import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { ErrorService } from '../../../../services/error/error.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-proposal-user',
  templateUrl: './proposal-user.component.html',
  styleUrls: ['./proposal-user.component.less']
})
export class ProposalUserComponent implements OnInit, OnDestroy {

  proposalUserSubscription: Subscription;
  proposalUserErrorSubscription: Subscription;
  form: FormGroup;
  sending: boolean=false;
  constructor(private adminService: AdminService, private errorService: ErrorService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      nick: new FormControl("", [Validators.required]),
    });
    this.proposalUserSubscription = this.adminService.proposalUser$.subscribe(
      res=>{
        this.sending = false;
        this.snackBar.open('Un mail ha sido enviado al usuario proponiendole que confirme su alta de usuario.', `Cerrar`, { duration: 0 });
      }
    )
    this.proposalUserErrorSubscription = this.adminService.proposalUserError$.subscribe(
      res=>{
        this.errorService.manageError(res);
        this.sending = false;
      }
    )
  }
  send(){
    if(this.form.valid){
      this.sending = true;
      this.adminService.proposalUser(this.form.get('email').value, this.form.get('nick').value);
    }
  }
  onKeyPress(e: KeyboardEvent){
    if(e.key === '.')
      e.preventDefault();
  }
  ngOnDestroy(): void {
    if(this.proposalUserSubscription)this.proposalUserSubscription.unsubscribe();
    if(this.proposalUserErrorSubscription)this.proposalUserErrorSubscription.unsubscribe();
  }
}
