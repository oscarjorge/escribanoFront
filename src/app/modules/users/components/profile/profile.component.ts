import { Component, OnInit } from '@angular/core';
import { API_USER_URL } from '../../../../modules/shared/constants/constants';
import { AuthService } from '../../../../auth/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from '../../../../modules/admin/services/admin.service';
import { User } from '../../../../modules/admin/models/user.model';
import { ErrorService } from '../../../../services/error/error.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  url: string;
  multiple: boolean;
  form: FormGroup;
  user: User;
  constructor(private authService: AuthService, private fb: FormBuilder, private adminService: AdminService, private errorService: ErrorService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.url = `${API_USER_URL}/profile`;
    this.multiple = true;
    this.adminService.getUser(this.authService.user.mail);
    this.adminService.getUser$.subscribe(user => {
      this.user = user;
      this.form = this.fb.group({
        nick: new FormControl(user.nickName, [Validators.required]),
        name: new FormControl(user.name),
        surname: new FormControl(user.surname),
      });
    })
    this.adminService.editUser$.subscribe(
      user => { this.snackBar.open("Los datos del perfil han sido guardados.");}
    );
    this.adminService.editUserError$.subscribe(
      err => { this.errorService.manageError(err);}
    );
  }
  uploaded(e) {
    this.authService.setUser();
    this.snackBar.open("La imagen de perfil ha sido subido.");
  }
  error(e) {
    this.snackBar.open("Se ha producido un error al subir la imagen de perfil.");
  }
  save() {
    if (this.form.valid) {
      this.user.nickName = this.form.get('nick').value;
      this.user.name = this.form.get('name').value;
      this.user.surname = this.form.get('surname').value;
      this.adminService.editUser(this.user);
    }
  }
}
