import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {JwtService} from './services/local/jwt-service';
import {WebSocketService} from './services/websocket/websocket-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy{
  protected title = 'video-browser-app-frontend';

  constructor(
    private jwtService: JwtService,
    private websocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    const token = this.jwtService.getToken();
    if (token && !this.jwtService.isTokenExpired()) {
      console.log("🔗 Auto-connect WebSocket przy starcie aplikacji");
      this.websocketService.connect();
    }
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }}
