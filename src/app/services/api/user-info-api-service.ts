import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserInfoModel} from '../../models/user-info-model';
import {Endpoints} from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserInfoApiService {

  constructor(private http: HttpClient) {
  }

  public findAllFriends(): Observable<UserInfoModel[]> {
    return this.http.get<UserInfoModel[]>(Endpoints.user.friends)
  }

}
