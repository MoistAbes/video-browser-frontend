import {Component, HostListener, signal} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthRequest} from '../../models/security/auth-request';
import {AuthApiService} from '../../services/api/auth-api-service';
import {JwtService} from '../../services/local/jwt-service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../services/local/user-service';
import {WebSocketService} from '../../services/websocket/websocket-service';

@Component({
  selector: 'app-login-page',
  imports: [
    MatFormField,
    MatLabel,
    MatFormField,
    MatFormField,
    MatIcon,
    MatInput,
    MatButton,
    MatIconButton,
    NgClass,
    FormsModule
  ],
  templateUrl: './login-page.html',
  standalone: true,
  styleUrl: './login-page.scss'
})
export class LoginPage {
  username: string = '';
  password: string = '';
  repeatPassword: string = '';

  isLogin: boolean = true;
  hide = signal(true);

  usernameError: boolean = false;
  passwordError: boolean = false;
  repeatPasswordError: boolean = false;

  constructor(private authApiService: AuthApiService,
              private jwtService: JwtService,
              private router: Router,
              private toastr: ToastrService,
              private userService: UserService,
              private websocketService: WebSocketService) {
  }

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  registerUser() {

    if (this.validateRegisterValues()) {
      const authRequest: AuthRequest = new AuthRequest()
      authRequest.username = this.username.trim();
      authRequest.password = this.password.trim();

      this.register(authRequest);
    }
  }

  loginUser() {

    if (this.validateLoginValues()) {
      const authRequest: AuthRequest = new AuthRequest()
      authRequest.username = this.username.trim();
      authRequest.password = this.password.trim();

      this.login(authRequest);
    }else {
      console.log("validation failed")
    }

  }

  validateLoginValues(): boolean {
    const formattedUsername: string = this.username.trim();
    const formattedPassword: string = this.password.trim();

    this.usernameError = formattedUsername.length === 0;
    this.passwordError = formattedPassword.length === 0;


    return !(this.usernameError || this.passwordError);
  }

  areRegisterValuesFilled(): boolean {
    const formattedUsername: string = this.username.trim();
    const formattedPassword: string = this.password.trim();
    const formattedRepeatPassword: string = this.repeatPassword.trim();

    this.usernameError = formattedUsername.length === 0;
    this.passwordError = formattedPassword.length === 0;
    this.repeatPasswordError = formattedRepeatPassword.length === 0;

    return !(this.usernameError || this.passwordError || this.repeatPasswordError);
  }



  validateRegisterValues(): boolean {

    const formattedUsername: string = this.username.trim();
    const formattedPassword: string = this.password.trim();
    const formattedRepeatPassword: string = this.repeatPassword.trim();

    if (formattedUsername.length < 3) {
      this.toastr.warning("Username must be at least 3 characters");
      return false;
    }

    if (formattedPassword.length < 6) {
      this.toastr.warning("Password must be at least 6 characters");
      return false;
    }

    if (formattedPassword !== formattedRepeatPassword) {
      this.toastr.warning("Passwords do not match");
      return false;
    }

    return true;
  }

  register(authRequest: AuthRequest) {
    this.authApiService.register(authRequest).subscribe({
      next: () => {},
      error: err => {
        this.toastr.warning(err.error.message)
        console.log("Error: ", err)
      },
      complete: () => {
        this.toastr.success("Successfully registered account")
        this.clearForm()
        this.isLogin = true;
      }
    })
  }

  login(authRequest: AuthRequest) {
    this.authApiService.login(authRequest).subscribe({
      next: token => {
        this.jwtService.saveToken(token.token)
        this.userService.loadUser();
        console.log("Login Token: ", this.jwtService.getToken())


        // 🔗 Połącz się z WebSocketem
        this.websocketService.connect();

      },
      error: err => {
        console.log("Error: ", err)
        this.toastr.warning(err.error.message, err.statusText);

      },
      complete: () => {
        this.router.navigateByUrl('/home');      }
    })
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent; // <-- wymuszenie typu
    if (this.isLogin) {
      console.log("login")
      this.loginUser();
    } else {
      console.log("register")
      this.registerUser();
    }
  }


  clearForm () {
    this.username = ''
    this.password = '';
    this.repeatPassword = ''
  }


}
