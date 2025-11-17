import { AfterViewInit, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JwtService } from './services/local/jwt-service';
import { WebSocketService } from './services/websocket/websocket-service';
import { LenisService } from './services/local/lenis-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy, AfterViewInit {
  protected readonly title = signal('video-browser-demo');

  constructor(
    private jwtService: JwtService,
    private websocketService: WebSocketService,
    private lenisService: LenisService // 👈 wstrzykujemy Lenis
  ) {}

  ngAfterViewInit(): void {
    this.lenisService.init(); // uruchamiamy dopiero po wyrenderowaniu DOM

    // 🔥 dodajemy klasę scrolling na <body> gdy trwa scroll
    setInterval(() => {
      if (this.lenisService.isScrolling) {
        document.body.classList.add('scrolling');
      } else {
        document.body.classList.remove('scrolling');
      }
    }, 50);
  }

  // ngAfterViewInit(): void {
  //   this.lenisService.init(); // uruchamiamy dopiero po wyrenderowaniu DOM
  // }

  ngOnInit(): void {
    const token: string | null = this.jwtService.getToken();
    if (token && !this.jwtService.isTokenExpired()) {
      console.log('🔗 Auto-connect WebSocket przy starcie aplikacji');
      this.websocketService.connect();
    }
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
