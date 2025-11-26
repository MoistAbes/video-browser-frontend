import {Component, OnInit} from '@angular/core';
import {JwtService} from '../../../services/local/jwt-service';
import {UserInfoApiService} from '../../../services/api/user-info-api-service';
import {UserInfoModel} from '../../../models/user/user-info-model';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../../services/local/user-service';
import {NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent} from '@ng-select/ng-select';
import {UserIconApiService} from '../../../services/api/user-icon-api-service';
import {UserIconModel} from '../../../models/user/user-icon-model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-account-page',
  imports: [
    FormsModule,
    NgSelectComponent,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective
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
    });

    this.findAllIcons();
  }

  updateUser() {
    this.updateIcon();
  }


  updateIcon() {
    this.userInfoApiService.updateIcon(this.user!.icon!.id, this.user!.iconColor).subscribe({
      next: () => {
        this.userService.updateUser({ ...this.user! });

      },
      error: err => {
        console.log("Error while updating icon: ", err)
      },
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
