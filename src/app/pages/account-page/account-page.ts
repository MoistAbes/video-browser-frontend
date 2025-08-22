import {Component, OnInit} from '@angular/core';
import {JwtService} from '../../services/local/jwt-service';
import {UserInfoApiService} from '../../services/api/user-info-api-service';
import {UserInfoModel} from '../../models/user/user-info-model';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../services/local/user-service';
import {NgSelectComponent} from '@ng-select/ng-select';
import {UserIconApiService} from '../../services/api/user-icon-api-service';
import {UserIconModel} from '../../models/user/user-icon-model';

@Component({
  selector: 'app-account-page',
  imports: [
    FormsModule,
    NgSelectComponent
  ],
  templateUrl: './account-page.html',
  standalone: true,
  styleUrl: './account-page.scss'
})
export class AccountPage implements OnInit {

  user: UserInfoModel | null = null;
  icons: UserIconModel[] = []
  selectedIcon: UserIconModel | undefined;

  constructor(public jwtService: JwtService,
              private userInfoApiService: UserInfoApiService,
              private userService: UserService,
              private userIconApiService: UserIconApiService,) {
  }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.findAllIcons();
  }

  updateUser() {
    this.updateIconColor();

    if (this.selectedIcon?.name != this.user?.icon) {
      this.updateIcon();
    }
  }

  updateIconColor() {
    this.userInfoApiService.updateIconColor(this.user!.iconColor).subscribe({
      next: () => {
        // Aktualizujemy usera w serwisie
        this.userService.updateUser({ ...this.user! });
      },
      error: err => {
        console.log("Error while updating icon color: ", err);
      }
    });
  }

  updateIcon() {
    this.userInfoApiService.updateIcon(this.selectedIcon!.id).subscribe({
      next: value => {
        this.user!.icon = this.selectedIcon!.name
        this.userService.updateUser({ ...this.user! });

      },
      error: err => {},
      complete: () => {}
    })
  }

  findAllIcons() {
    this.userIconApiService.findAllUserIcons().subscribe({
      next: data => {
        this.icons = data

        this.selectedIcon = this.icons.find(icon => this.user?.icon === icon.name)
      },
      error: err => {},
      complete: () => {}
    })
  }



}
