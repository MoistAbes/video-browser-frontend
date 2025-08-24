import {Component, OnInit} from '@angular/core';
import {JwtService} from '../../services/local/jwt-service';
import {UserInfoApiService} from '../../services/api/user-info-api-service';
import {UserInfoModel} from '../../models/user/user-info-model';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../services/local/user-service';
import {NgSelectComponent} from '@ng-select/ng-select';
import {UserIconApiService} from '../../services/api/user-icon-api-service';
import {UserIconModel} from '../../models/user/user-icon-model';
import {ToastrService} from 'ngx-toastr';

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

  constructor(public jwtService: JwtService,
              private userInfoApiService: UserInfoApiService,
              private userService: UserService,
              private userIconApiService: UserIconApiService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser(); // tutaj faktycznie odpalasz pobranie usera


    this.userService.user$.subscribe(user => {
      this.user = user;
      console.log("user accoutn page: ", this.user)
    });



    this.findAllIcons();
  }

  updateUser() {
    this.updateIconColor();

    this.updateIcon();
  }

  updateIconColor() {
    this.userInfoApiService.updateIconColor(this.user!.iconColor).subscribe({
      next: () => {
        // Aktualizujemy usera w serwisie
        this.userService.updateUser({ ...this.user! });
      },
      error: err => {
        console.log("Error while updating icon color: ", err);
      },
      complete: () => {
        this.toastrService.success("Successfully updated icon color")

      }
    });
  }

  updateIcon() {
    this.userInfoApiService.updateIcon(this.user!.icon!.id).subscribe({
      next: value => {
        this.userService.updateUser({ ...this.user! });

      },
      error: err => {},
      complete: () => {
        this.toastrService.success("Successfully updated icon")
      }
    })
  }

  findAllIcons() {
    this.userIconApiService.findAllUserIcons().subscribe({
      next: data => {
        this.icons = data
      },
      error: err => {},
      complete: () => {
      }
    })
  }



}
