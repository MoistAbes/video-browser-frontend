import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {JwtService} from '../../services/local/jwt-service';

@Component({
  selector: 'app-topbar-component',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './topbar-component.html',
  standalone: true,
  styleUrl: './topbar-component.scss'
})
export class TopbarComponent {

  constructor(public jwtService: JwtService,
              private router: Router,) {
  }

  logout() {
    // tu dodajesz logikę wylogowania
    console.log('Wylogowano!');

    this.jwtService.clearToken()
    this.router.navigateByUrl('/login');
  }

  routeToAccountPage() {
    this.router.navigateByUrl('/account')
  }
}
