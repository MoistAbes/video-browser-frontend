import { Routes } from '@angular/router';
import {MovieDetailPage} from './pages/movie-detail-page/movie-detail-page';
import {AdminPage} from './pages/admin-page/admin-page';
import {MainLayoutComponent} from './layout/main-layout-component/main-layout-component';
import {MoviePage} from './pages/movie-page/movie-page';
import {ShowPage} from './pages/show-page/show-page';
import {SearchPage} from './pages/search-page/search-page';
import {HomePage} from './pages/home-page/home-page';
import {LoginPage} from './pages/login-page/login-page';
import {authGuard} from './guards/auth-guard';
import {redirectGuard} from './guards/redirect-guard';
import {adminGuard} from './guards/admin-guard';
import {AccountPage} from './pages/account-page/account-page';
import {loginGuard} from './guards/login-guard';
export const routes: Routes = [
  {
    path: '',
    canActivate: [redirectGuard],
    pathMatch: 'full',
    component: MainLayoutComponent, // Angular wymaga componentu
  },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivateChild: [authGuard],
    children: [
      { path: 'home', component: HomePage, canActivate: [authGuard], data: { animation: 'Home' } },
      { path: 'search', component: SearchPage, canActivate: [authGuard], data: { animation: 'Search' } },
      { path: 'movies', component: MoviePage, canActivate: [authGuard], data: { animation: 'Movies' } },
      { path: 'shows', component: ShowPage, canActivate: [authGuard], data: { animation: 'Shows' } },
      { path: 'account', component: AccountPage, canActivate: [authGuard], data: { animation: 'Account' } },
      { path: 'movie-details/:parentTitle', component: MovieDetailPage, canActivate: [authGuard], data: { animation: 'MovieDetails' } },
      { path: 'admin', component: AdminPage, canActivate: [authGuard ,adminGuard], data: { animation: 'Admin' } },
      { path: 'login', component: LoginPage, canActivate: [loginGuard], data: { animation: 'Login' } },
    ],
  },
  { path: '**', redirectTo: 'login' },
];


