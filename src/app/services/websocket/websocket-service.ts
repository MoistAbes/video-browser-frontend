import { Injectable } from '@angular/core';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {JwtService} from '../local/jwt-service';

@Injectable({ providedIn: 'root' })
export class WebSocketService {

  private stompClient: Client | null = null;

  constructor(private jwtService: JwtService) {}

  private createClient(): Client {
    const token = this.jwtService.getToken();

    return new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: str => console.log(str),
      reconnectDelay: 5000,
      onConnect: frame => {
        console.log('✅ Połączono z WebSocketem:', frame);
      },
      onStompError: frame => {
        console.error('❌ Błąd STOMP:', frame);
      }
    });
  }

  connect(): void {
    const token = this.jwtService.getToken();

    if (!token) {
      console.error("Brak tokena JWT → nie łączę się z WebSocket!");
      return;
    }

    if (!this.stompClient) {
      this.stompClient = this.createClient();
    }

    if (!this.stompClient.active) {
      this.stompClient.activate();
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null; // 👈 żeby przy kolejnym logowaniu stworzył się nowy klient z nowym tokenem
    }
  }

  send(destination: string, body: any): void {
    if (this.stompClient?.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body)
      });
    }
  }

  subscribe(topic: string, callback: (message: any) => void): void {
    if (this.stompClient?.connected) {
      this.stompClient.subscribe(topic, message => {
        callback(JSON.parse(message.body));
      });
    }
  }
}


