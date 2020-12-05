import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Role } from '../../../models/role.model';
import { API_USER_URL } from '../../../../shared/constants/constants';
import { Project } from '../../../models/project.model';
import { Router } from '@angular/router';


@Component({
  selector: 'admin-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.less']
})
export class UserFormComponent implements OnInit, OnChanges {

  @Input() item: User;
  @Input() roles: Role[];
  @Output() onSave = new EventEmitter<User>();
  @Output() onUploaded = new EventEmitter<any>();
  form: FormGroup;
  url: string;
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.item && changes.item.currentValue){
      this.url =`${API_USER_URL}/profileother/${this.item.idUser}`;

      this.form = this.fb.group({
        nickName: new FormControl(this.item.nickName, [Validators.required]),
        name: new FormControl(this.item.name, [Validators.required]),
        surname: new FormControl(this.item.surname),
        active: new FormControl(this.item.active),
        admin: new FormControl(this.item.roles.find(r=>r.description == "ADMIN")?true:false, [Validators.required]),
      });
    }
  }
  save(){
    if(this.form.valid){
      this.item.nickName = this.form.get('nickName').value;
      this.item.name = this.form.get('name').value;
      this.item.surname = this.form.get('surname').value;
      this.item.active = this.form.get('active').value;
      this.item.roles = (this.form.get('admin').value)? this.roles: this.roles.filter(r=>r.description!="ADMIN");
      this.onSave.emit(this.item);
    }

  }
  uploaded(e) {
    this.onUploaded.emit(this.item);
    //this.snackBar.open("La imagen de perfil ha sido subido.");
  }
  clickRowProject(project: Project){
    this.router.navigate([`admin/projects/${project.idProject}`]);
  }
}
