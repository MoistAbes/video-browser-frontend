import { Injectable } from '@angular/core';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {


  private readonly stompClient: Client;

  constructor() {
    this.stompClient = this.createClient();
  }

  private createClient(): Client {
    return new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      debug: str => console.log(str),
      reconnectDelay: 5000,
      onConnect: frame => {
        console.log('Połączono z WebSocketem:', frame);
      },
      onStompError: frame => {
        console.error('Błąd STOMP:', frame);
      }
    });
  }

  connect(): void {
    if (!this.stompClient.active) {
      this.stompClient.activate();
    }
  }

  disconnect(): void {
    this.stompClient.deactivate();
  }

  send(destination: string, body: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body)
      });
    }
  }

  subscribe(topic: string, callback: (message: any) => void): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(topic, message => {
        callback(JSON.parse(message.body));
      });
    }
  }


}

