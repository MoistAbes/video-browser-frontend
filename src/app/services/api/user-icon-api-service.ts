import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserInfoModel} from '../../models/user/user-info-model';
import {Endpoints} from '../../endpoints/endpoints';
import {UserIconModel} from '../../models/user/user-icon-model';

@Injectable({
  providedIn: 'root'
})
export class UserIconApiService {

  constructor(private http: HttpClient) { }

  public findAllUserIcons(): Observable<UserIconModel[]> {
    return this.http.get<UserIconModel[]>(Endpoints.userIcon.findAll)
  }
}
