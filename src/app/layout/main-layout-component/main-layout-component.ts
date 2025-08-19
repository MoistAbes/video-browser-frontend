import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TopbarComponent} from '../../components/topbar-component/topbar-component';
import {animate, style, transition, trigger} from '@angular/animations';
import {JwtService} from '../../services/local/jwt-service';

@Component({
  selector: 'app-main-layout-component',
  imports: [RouterOutlet, TopbarComponent],
  templateUrl: './main-layout-component.html',
  standalone: true,
  styleUrl: './main-layout-component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class MainLayoutComponent {

  constructor(public jwtService: JwtService) {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] || '';
  }
}
