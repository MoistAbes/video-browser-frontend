import { Routes } from '@angular/router';
import { MovieDetailPage } from './pages/movie-detail-page/movie-detail-page';
import { AdminPage } from './pages/admin/admin-page/admin-page';
import { MainLayoutComponent } from './layout/main-layout-component/main-layout-component';
import { LoginPage } from './pages/login-page/login-page';
import { authGuard } from './guards/auth-guard';
import { redirectGuard } from './guards/redirect-guard';
import { adminGuard } from './guards/admin-guard';
import { AccountPage } from './pages/user/account-page/account-page';
import { loginGuard } from './guards/login-guard';
import { MovieCollectionsPage } from './pages/content/movie-collections-page/movie-collections-page';
import { HomePage } from './pages/content/home-page/home-page';
import { SearchPage } from './pages/content/search-page/search-page';
import { MoviesPage } from './pages/content/movies-page/movies-page';
import { TvShowsPage } from './pages/content/tv-shows-page/tv-shows-page';
import { UniversesPage } from './pages/content/universes-page/universes-page';
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
    children: [
      {
        path: 'home',
        component: HomePage,
        canActivate: [authGuard],
        data: { animation: 'Home' },
      },
      {
        path: 'search',
        component: SearchPage,
        canActivate: [authGuard],
        data: { animation: 'Search' },
      },
      {
        path: 'movies',
        component: MoviesPage,
        canActivate: [authGuard],
        data: { animation: 'Movies' },
      },
      {
        path: 'tv-shows',
        component: TvShowsPage,
        canActivate: [authGuard],
        data: { animation: 'Tv-shows' },
      },
      {
        path: 'movie-collections',
        component: MovieCollectionsPage,
        canActivate: [authGuard],
        data: { animation: 'Movie-collections' },
      },
      {
        path: 'universes',
        component: UniversesPage,
        canActivate: [authGuard],
        data: { animation: 'Universes' },
      },
      {
        path: 'account',
        component: AccountPage,
        canActivate: [authGuard],
        data: { animation: 'Account' },
      },
      {
        path: 'movie-details/:parentTitle',
        component: MovieDetailPage,
        canActivate: [authGuard],
        data: { animation: 'MovieDetails' },
      },
      {
        path: 'admin',
        component: AdminPage,
        canActivate: [authGuard, adminGuard],
        data: { animation: 'Admin' },
      },
      {
        path: 'login',
        component: LoginPage,
        canActivate: [loginGuard],
        data: { animation: 'Login' },
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
