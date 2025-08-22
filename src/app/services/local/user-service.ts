import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserInfoModel} from '../../models/user/user-info-model';
import {UserInfoApiService} from '../api/user-info-api-service';
import {JwtService} from './jwt-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*
  BehaviorSubject to specjalny typ Subject z biblioteki RxJS, który:

    Przechowuje aktualną wartość (jak zmienna).
    Emituję tę wartość do każdego nowego subskrybenta.
    Pozwala na reaktywne podejście — komponenty mogą się "nasłuchiwać" na zmiany.

    Dzięki temu:

    Jeśli użytkownik się zmieni (np. edytuje profil), wszystkie komponenty automatycznie dostaną nową wartość.
    Nie musisz ręcznie przekazywać danych między komponentami.
    Masz czysty, reaktywny przepływ danych.
   */
  private userSubject: BehaviorSubject<UserInfoModel | null> = new BehaviorSubject<UserInfoModel | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private userInfoApiService: UserInfoApiService,
              private jwtService: JwtService,) {}

  loadUser(): void {
    this.userInfoApiService.findUserInfo().subscribe({
      next: (user) => this.userSubject.next(user),
      error: (err) => console.error('Failed to load user', err)
    });
  }

  getCurrentUser(): UserInfoModel | null {
    if (!this.userSubject.value && this.jwtService.isLoggedIn()) {
      this.loadUser(); // automatyczne załadowanie
    }
    return this.userSubject.value;
  }


  updateUser(user: UserInfoModel) {
    this.userSubject.next(user);
  }


}
