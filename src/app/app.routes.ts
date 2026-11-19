import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Post } from './pages/post/post';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'posts', component: Post, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
