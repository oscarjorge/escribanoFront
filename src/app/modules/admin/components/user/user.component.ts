import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { ErrorService } from '../../../../services/error/error.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { CardExtendedComponent } from 'card-extended';

@Component({
  selector: 'admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChildren(CardExtendedComponent) cards: QueryList<CardExtendedComponent>;
  getUsersSubscription: Subscription;
  getUsersErrorSubscription: Subscription;
  editUserSubscription: Subscription;
  editUserErrorSubscription: Subscription;
  deleteUserSubscription: Subscription;
  deleteUserErrorSubscription: Subscription;
  forwardMailSubscription: Subscription;
  forwardMailErrorSubscription: Subscription;

  getRolesSubscription: Subscription;
  getRolesErrorSubscription: Subscription;
  items: User[];
  itemEditing: User;
  loading:boolean;
  roles: Role[];
  userTitle: string = "Usuario";
  constructor(private service: AdminService, private errorService: ErrorService) { }

  ngOnInit() {
    this.getUsersSubscription = this.service.getUsers$.subscribe(
      items=>{
        this.items = items;
        this.loading = false;
      }
    );
    this.getUsersErrorSubscription = this.service.getUsersError$.subscribe(
      err=>{
        this.errorService.manageError(err);
        this.loading = false;
      }
    );
    this.getRolesSubscription = this.service.getRoles$.subscribe(
      items=>{
        this.roles = items;
      }
    );
    this.getRolesErrorSubscription = this.service.getRolesError$.subscribe(
      err=>{
        this.errorService.manageError(err);
      }
    );
    this.editUserSubscription = this.service.editUser$.subscribe(
      project=>{
        this.cards.last.close();
        this.userTitle = 'Usuario';
      }
    );
    this.editUserErrorSubscription = this.service.editUserError$.subscribe(
      err=>{
        this.errorService.manageError(err);
      }
    );

    this.deleteUserSubscription = this.service.deleteUser$.subscribe(
      idUser=>{
        this.items = this.items.filter(i=>i.idUser!=idUser);
      }
    );
    this.deleteUserErrorSubscription = this.service.deleteUserError$.subscribe(
      err=>{
        this.errorService.manageError(err);
      }
    );
    this.forwardMailSubscription = this.service.forwardMail$.subscribe(
      idUser=>{
        this.items.find(i=>i.idUser==idUser).allowForwardConfirmMail = false;
        this.errorService.displayMessage(`El mail se ha enviado de nuevo para que el usuario confirme su alta. El plazo caduca dentro de 24 horas.`);
      }
    );
    this.forwardMailErrorSubscription = this.service.forwardMailError$.subscribe(
      err=>{
        this.errorService.manageError(err);
      }
    );


    this.loading = true;
    this.service.getUsers();
    this.service.getRoles();
  }
  delete(item:User){
    this.service.deleteUser(item);
  }
  edit(item:User){
    this.userTitle = item.nickName;
    this.cards.last.open();
    this.itemEditing = item;
  }
  forward(item:User){
    this.service.forwardMail(item);
  }
  save(item:User){
      this.service.editUser(item);
  }
  uploaded(item:User){
    this.service.getUsers();
  }
  ngOnDestroy(){
    if(this.getUsersSubscription)this.getUsersSubscription.unsubscribe();
    if(this.getUsersErrorSubscription)this.getUsersErrorSubscription.unsubscribe();
    if(this.editUserSubscription)this.editUserSubscription.unsubscribe();
    if(this.editUserErrorSubscription)this.editUserErrorSubscription.unsubscribe();
    if(this.deleteUserSubscription)this.deleteUserSubscription.unsubscribe();
    if(this.deleteUserErrorSubscription)this.deleteUserErrorSubscription.unsubscribe();
    if(this.getRolesSubscription)this.getRolesSubscription.unsubscribe();
    if(this.getRolesErrorSubscription)this.getRolesErrorSubscription.unsubscribe();
  }

}
