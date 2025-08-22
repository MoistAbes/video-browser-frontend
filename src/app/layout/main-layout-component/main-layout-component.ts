import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TopbarComponent} from '../../components/topbar-component/topbar-component';
import {animate, style, transition, trigger} from '@angular/animations';
import {JwtService} from '../../services/local/jwt-service';
import {NgClass} from '@angular/common';
import {UserInfoModel} from '../../models/user/user-info-model';

@Component({
  selector: 'app-main-layout-component',
  imports: [RouterOutlet, TopbarComponent, NgClass],
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

  isSidebarOpen: boolean = false;
  friendList: UserInfoModel[] = [];

  constructor(public jwtService: JwtService) {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] || '';
  }

  handleOpenSidebar(friends: UserInfoModel[]) {
    this.friendList = friends;
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
