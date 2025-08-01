import { Routes } from '@angular/router';
import {HomePage} from './pages/home-page/home-page';
import {MovieDetailPage} from './pages/movie-detail-page/movie-detail-page';
import {AdminPage} from './pages/admin-page/admin-page';
import {MainLayoutComponent} from './layout/main-layout-component/main-layout-component';
import {MoviePage} from './pages/movie-page/movie-page';
import {ShowPage} from './pages/show-page/show-page';
import {AnimePage} from './pages/anime-page/anime-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // ← ten komponent zawiera sidebar i router-outlet
    children: [
      { path: 'home', component: HomePage },
      { path: 'movies', component: MoviePage },
      { path: 'shows', component: ShowPage },
      { path: 'anime', component: AnimePage },
      { path: 'movie-details/:parentTitle', component: MovieDetailPage },
      { path: 'admin', component: AdminPage },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },


  // fallback route
  { path: '**', redirectTo: 'home' },
];
