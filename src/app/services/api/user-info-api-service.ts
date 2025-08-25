import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserInfoModel} from '../../models/user/user-info-model';
import {Endpoints} from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserInfoApiService {

  constructor(private http: HttpClient) {
  }

  public findUserInfo(): Observable<UserInfoModel> {
    return this.http.get<UserInfoModel>(Endpoints.user.userInfo)
  }

  public findAllFriends(): Observable<UserInfoModel[]> {
    return this.http.get<UserInfoModel[]>(Endpoints.user.friends)
  }


  public updateIcon(iconId: number, iconColor: string): Observable<any> {
    return this.http.put<any>(Endpoints.user.updateIcon + iconId, null, {
      params: { iconColor }
    })
  }

}
