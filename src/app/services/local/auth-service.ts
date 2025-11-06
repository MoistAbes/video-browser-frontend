import { Router } from '@angular/router';
import { WebSocketService } from '../websocket/websocket-service';
import { JwtService } from './jwt-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  public logout() {
    this.jwtService.clearToken();
    this.webSocketService.disconnect();
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    console.log('checking if im logged in');
    if (!this.jwtService.getToken() || this.jwtService.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }
}
