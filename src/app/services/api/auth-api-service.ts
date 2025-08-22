import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtToken} from '../../models/security/jwt-token';
import {Endpoints} from '../../endpoints/endpoints';
import {AuthRequest} from '../../models/security/auth-request';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http: HttpClient) { }

  register(authRequest: AuthRequest): Observable<any> {
    return this.http.post<any>(Endpoints.auth.register, authRequest);
  }

  login(authRequest: AuthRequest): Observable<JwtToken> {
    return this.http.post<JwtToken>(Endpoints.auth.login, authRequest);
  }
}
