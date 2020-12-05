import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Subject } from 'rxjs';
import { API_CHECKIN_URL } from '../../shared/constants/constants';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { CheckInModel, CheckInCalendar } from '../../admin/models/checkin.model';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
  constructor(private apiService: ApiService) { }
  getCheckIns$ = new Subject<CheckInModel[]>();
  getCheckInsError$ = new Subject<any>();
  getCheckInsUserDate$ = new Subject<CheckInModel[]>();
  getCheckInsUserDateError$ = new Subject<any>();
  addCheckIns$ = new Subject<CheckInModel[]>();
  addCheckInsError$ = new Subject<any>();
  getCheckIns() {
    this.apiService.get<CheckInModel[]>(`${API_CHECKIN_URL}/GetByUser`)
      .pipe(
        map(res => {
          let arr : CheckInModel[] = [];
          res.forEach(element => {
            arr.push(new CheckInModel(element));

          });
          return arr;
        })
      ).subscribe(
        res => {
          this.getCheckIns$.next(res);
        },
        err => {
          this.getCheckInsError$.next(err);
        }
      )
  }
  getCheckInsUserDate(date: string) {
    this.apiService.get<CheckInModel[]>(`${API_CHECKIN_URL}/GetByUserAndDate/${date}`)
      .pipe(
        map(res => {
          let arr : CheckInModel[] = [];
          res.forEach(element => {
            arr.push(new CheckInModel(element));

          });
          return arr;
        })
      ).subscribe(
        res => {
          this.getCheckInsUserDate$.next(res);
        },
        err => {
          this.getCheckInsUserDateError$.next(err);
        }
      )
  }
  addCheckIns(checkIns: CheckInModel[]) {
    this.apiService.post(`${API_CHECKIN_URL}`,checkIns)
      .pipe(
        map(res => {
          let arr : CheckInModel[] = [];
          res.forEach(element => {
            arr.push(new CheckInModel(element));

          });
          return arr;
        })
      ).subscribe(
        res => {
          this.addCheckIns$.next(res);
        },
        err => {
          this.addCheckInsError$.next(err);
        }
      )
  }
  postCheckinCurrentUser(checkIns: CheckInModel[]) {
    this.apiService.post(`${API_CHECKIN_URL}/AddCheckinCurrentUser`,checkIns)
      .pipe(
        map(res => {
          let arr : CheckInModel[] = [];
          res.forEach(element => {
            arr.push(new CheckInModel(element));

          });
          return arr;
        })
      ).subscribe(
        res => {
          this.addCheckIns$.next(res);
        },
        err => {
          this.addCheckInsError$.next(err);
        }
      )
  }

}
