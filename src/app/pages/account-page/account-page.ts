import {Component, OnInit} from '@angular/core';
import {JwtService} from '../../services/local/jwt-service';
import {UserInfoApiService} from '../../services/api/user-info-api-service';
import {UserInfoModel} from '../../models/user-info-model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-account-page',
  imports: [
    FormsModule
  ],
  templateUrl: './account-page.html',
  standalone: true,
  styleUrl: './account-page.scss'
})
export class AccountPage implements OnInit {

  user: UserInfoModel | undefined

  constructor(public jwtService: JwtService,
              private userInfoApiService: UserInfoApiService,) {
  }

  ngOnInit(): void {
    this.loadCurrentUserInfo();
  }


  updateUser() {


    this.updateIconColor();
  }

  loadCurrentUserInfo() {
    this.userInfoApiService.findUserInfo().subscribe({
      next: data => {
        this.user = data;
        console.log("fetched user: ", this.user)
      },
      error: err => {},
      complete: () => {}
    })
  }



  updateIconColor() {
    this.userInfoApiService.updateIconColor(this.user!.iconColor).subscribe({
      next: () => {},
      error: err => {
        console.log("Error while updating icon color: ", err)
      },
      complete: () => {}
    })
  }


}
