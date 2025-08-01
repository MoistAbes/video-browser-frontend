import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TopbarComponent} from '../../components/topbar-component/topbar-component';

@Component({
  selector: 'app-main-layout-component',
  imports: [
    RouterOutlet,
    TopbarComponent
  ],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.scss'
})
export class MainLayoutComponent {

}
