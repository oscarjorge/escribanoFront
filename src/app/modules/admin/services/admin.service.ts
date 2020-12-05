import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Subject } from 'rxjs';
import { API_USER_URL, API_PROJECT_URL, API_ROLE_URL, API_PROJECT_USER_URL } from '../../shared/constants/constants';
import { map } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { ProjectUser } from '../models/project-user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getUsers$ = new Subject<User[]>();
  getUsersError$ = new Subject<any>();

  getUser$ = new Subject<User>();
  getUserError$ = new Subject<any>();
  editUser$ = new Subject<User>();
  editUserError$ = new Subject<any>();
  deleteUser$ = new Subject<any>();
  deleteUserError$ = new Subject<any>();
  forwardMail$ = new Subject<any>();
  forwardMailError$ = new Subject<any>();

  getProjects$ = new Subject<Project[]>();
  getProjectsError$ = new Subject<any>();
  proposalUser$ = new Subject<any>();
  proposalUserError$ = new Subject<any>();
  editProjects$ = new Subject<Project>();
  editProjectsError$ = new Subject<any>();
  addProjects$ = new Subject<any>();
  addProjectsError$ = new Subject<any>();
  deleteProjects$ = new Subject<any>();
  deleteProjectsError$ = new Subject<any>();

  getRoles$ = new Subject<Role[]>();
  getRolesError$ = new Subject<any>();

  getProjectUser$ = new Subject<ProjectUser[]>();
  getProjectUserError$ = new Subject<any>();
  getProjectUserCurrent$ = new Subject<ProjectUser[]>();
  getProjectUserCurrentError$ = new Subject<any>();

  constructor(private apiService: ApiService) { }
  proposalUser(mail: string, nick: string) {
    this.apiService.post(`${API_USER_URL}`, {'mail':mail, 'NickName': nick})
      .pipe(
        map(res => {
          return res;
        })
      ).subscribe(
        res => {
          this.proposalUser$.next(res);
        },
        err => {
          this.proposalUserError$.next(err);
        }
      )
  }
  getUsers() {
    this.apiService.get<User[]>(`${API_USER_URL}`)
      .pipe(
        map(res => {
          let result: User[] = [];
          res.forEach(element => {
            result.push(new User(element));
          });
          return result;
        })
      ).subscribe(
        res => {
          this.getUsers$.next(res);
        },
        err => {
          this.getUsersError$.next(err);
        }
      )
  }
  getUser(mail:string) {
    this.apiService.get<User>(`${API_USER_URL}/GetByMail/${mail}`)
      .pipe(
        map(res => {
          return new User(res);
        })
      ).subscribe(
        res => {
          this.getUser$.next(res);
        },
        err => {
          this.getUserError$.next(err);
        }
      )
  }
  editUser(user: User) {
    user.roleUser = [];
    user.roles.forEach(role => {
      user.roleUser.push({
        idRole:role.idRole,
        idUser : user.idUser,
        idRoleUser : 0
      })
    });
    this.apiService.put(`${API_USER_URL}/${user.mail}`,user)
      .pipe(
        map(res => {
          return res;
        })
      ).subscribe(
        res => {
          this.editUser$.next(res);
        },
        err => {
          this.editUserError$.next(err);
        }
      )
  }
  deleteUser(user: User) {
    this.apiService.put(`${API_USER_URL}/delete/${user.idUser}`)
      .pipe(
        map(res => {
          return res;
        })
      ).subscribe(
        res => {
          this.deleteUser$.next(user.idUser);
        },
        err => {
          this.deleteUserError$.next(err);
        }
      )
  }
  forwardMail(user: User) {
    this.apiService.put(`${API_USER_URL}/forwardmail`, user)
      .pipe(
        map(res => {
          return res;
        })
      ).subscribe(
        res => {
          this.forwardMail$.next(user.idUser);
        },
        err => {
          this.forwardMailError$.next(err);
        }
      )
  }
  getProjects() {
    this.apiService.get<Project[]>(`${API_PROJECT_URL}`)
      .pipe(
        map(res => {
          let result: Project[] = [];
          res.forEach(element => {
            result.push(new Project(element));
          });
          return result;
        })
      ).subscribe(
        res => {
          this.getProjects$.next(res);
        },
        err => {
          this.getProjectsError$.next(err);
        }
      )
  }
  editProject(project: Project) {
    this.apiService.put(`${API_PROJECT_URL}/${project.idProject}`,project)
      .pipe(
        map(res => {
          return res;
        })
      ).subscribe(
        res => {
          this.editProjects$.next(res);
        },
        err => {
          this.editProjectsError$.next(err);
        }
      )
  }
  addProject(project: Project) {
    this.apiService.post(`${API_PROJECT_URL}`,project)
      .pipe(
        map(res => {
          return res;
        })
      ).subscribe(
        res => {
          this.addProjects$.next(res);
        },
        err => {
          this.addProjectsError$.next(err);
        }
      )
  }
  deleteProject(project: Project) {
    this.apiService.delete(`${API_PROJECT_URL}/${project.idProject}`)
      .pipe(
        map(res => {
          return res;
        })
      ).subscribe(
        res => {
          this.deleteProjects$.next(res);
        },
        err => {
          this.deleteProjectsError$.next(err);
        }
      )
  }
  getRoles() {
    this.apiService.get<Role[]>(`${API_ROLE_URL}`)
      .pipe(
        map(res => {
          let result: Role[] = [];
          res.forEach(element => {
            result.push(new Role(element));
          });
          return result;
        })
      ).subscribe(
        res => {
          this.getRoles$.next(res);
        },
        err => {
          this.getRolesError$.next(err);
        }
      )
  }
  getProjectUser() {
    this.apiService.get<ProjectUser[]>(`${API_PROJECT_USER_URL}`)
      .pipe(
        map(res => {
          let result: ProjectUser[] = [];
          res.forEach(element => {
            result.push(new ProjectUser(element));
          });
          return result;
        })
      ).subscribe(
        res => {
          this.getProjectUser$.next(res);
        },
        err => {
          this.getProjectUserError$.next(err);
        }
      )
  }
  getProjectUserByCurrentUser() {
    this.apiService.get<ProjectUser[]>(`${API_PROJECT_USER_URL}/GetByCurrentUser`)
      .pipe(
        map(res => {
          let result: ProjectUser[] = [];
          res.forEach(element => {
            result.push(new ProjectUser(element));
          });
          return result;
        })
      ).subscribe(
        res => {
          this.getProjectUserCurrent$.next(res);
        },
        err => {
          this.getProjectUserCurrentError$.next(err);
        }
      )
  }
}
