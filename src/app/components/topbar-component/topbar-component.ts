import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {JwtService} from '../../services/local/jwt-service';
import {UserInfoApiService} from '../../services/api/user-info-api-service';
import {UserInfoModel} from '../../models/user/user-info-model';
import {UserService} from '../../services/local/user-service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-topbar-component',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './topbar-component.html',
  standalone: true,
  styleUrl: './topbar-component.scss'
})
export class TopbarComponent implements OnInit{

  user: UserInfoModel | null = null;
  friendList: UserInfoModel[] = []
  @Output() openSidebar = new EventEmitter<UserInfoModel[]>();

  constructor(public jwtService: JwtService,
              private router: Router,
              private userInfoApiService: UserInfoApiService,
              private userService: UserService,) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser(); // tutaj faktycznie odpalasz pobranie usera


    this.userService.user$.subscribe(user => {
      this.user = user;
      console.log("topbar component user: ", this.user)
    });

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

  loadFriends() {

    //open sidebar
    this.userInfoApiService.findAllFriends().subscribe({
      next: (result) => {
        this.friendList = result
        console.log("FRIENDS: ", this.friendList);
        // wysyłamy listę do layoutu razem z sygnałem otwarcia sidebaru
        this.openSidebar.emit(this.friendList);
      },
      error: (err) => {
        console.log("Error while loading friends: ", err);
      },
      complete: () => {}
    })
  }

}
