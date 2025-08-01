import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-topbar-component',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './topbar-component.html',
  styleUrl: './topbar-component.scss'
})
export class TopbarComponent {

}
