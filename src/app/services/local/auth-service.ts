import { WebSocketService } from '../websocket/websocket-service';
import { JwtService } from './jwt-service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(
    private jwtService: JwtService,
    private webSocketService: WebSocketService
  ) {
    const hasToken = this.hasValidToken();
    this.loggedInSubject = new BehaviorSubject<boolean>(hasToken);
    this.isLoggedIn$ = this.loggedInSubject.asObservable();
  }

  private hasValidToken(): boolean {
    const token = this.jwtService?.getToken?.();
    return !!token && !this.jwtService.isTokenExpired();
  }

  public logout() {
    this.jwtService.clearToken();
    this.webSocketService.disconnect();
    this.loggedInSubject.next(false);
  }

  public login(token: string) {
    this.jwtService.saveToken(token);
    this.webSocketService.connect();
    this.loggedInSubject.next(true);
  }

  public isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
